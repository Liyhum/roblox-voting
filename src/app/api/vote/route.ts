import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { supabaseServer, isServerSupabaseConfigured } from "@/lib/supabase-server";
import { getEventStatus } from "@/lib/event-status";
import { validateDeviceAndIp, recordDeviceAndIp } from "@/lib/device-limiter";

// UUID regex validation
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: Max 10 vote requests per minute per IP
  const rateResult = checkRateLimit(req, {
    keyPrefix: "vote_action",
    limit: 10,
    windowMs: 60 * 1000,
  });

  if (!rateResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: `Terlalu banyak permintaan voting. Mohon tunggu ${rateResult.retryAfterSeconds} detik lagi.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateResult.retryAfterSeconds),
        },
      }
    );
  }

  // 2. Validate Origin / Referer to prevent cross-site request forgery (CSRF)
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { success: false, message: "Cross-site voting request rejected (CSRF Protection)." },
          { status: 403 }
        );
      }
    } catch {
      // ignore
    }
  }

  // 3. Parse and Validate Request Body
  let body: {
    submissionId?: string;
    voterUsername?: string;
    voterId?: number | string;
    deviceId?: string;
    hardwareFingerprint?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { submissionId, voterUsername, voterId, deviceId, hardwareFingerprint } = body;
  if (!submissionId || !UUID_REGEX.test(submissionId)) {
    return NextResponse.json(
      { success: false, message: "Invalid submission ID parameter." },
      { status: 400 }
    );
  }

  // 4. Identify Voter (from session cookie OR submitted username)
  const sessionUser = getSessionFromRequest(req);
  let effectiveVoterId: number = 0;
  let effectiveVoterName: string = "";

  if (sessionUser && sessionUser.id && sessionUser.username) {
    effectiveVoterId = sessionUser.id;
    effectiveVoterName = sessionUser.username;
  } else if (voterUsername && typeof voterUsername === "string" && voterUsername.trim().length >= 3) {
    effectiveVoterName = voterUsername.trim();
    if (voterId && Number(voterId) > 0) {
      effectiveVoterId = Number(voterId);
    } else {
      // Lookup authentic Roblox User ID
      try {
        const uRes = await fetch("https://users.roblox.com/v1/usernames/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usernames: [effectiveVoterName], excludeBannedUsers: false }),
          cache: "no-store",
        });
        if (uRes.ok) {
          const uData = await uRes.json();
          if (uData.data && uData.data.length > 0) {
            effectiveVoterId = uData.data[0].id;
            effectiveVoterName = uData.data[0].name;
          }
        }
      } catch (err) {
        console.error("Roblox user lookup error:", err);
      }
    }
  } else {
    return NextResponse.json(
      {
        success: false,
        message: "Please enter your Roblox username to cast a vote.",
      },
      { status: 400 }
    );
  }

  if (!effectiveVoterId || effectiveVoterId <= 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Akun Roblox tidak ditemukan. Pastikan username kamu terdaftar resmi di Roblox.",
      },
      { status: 400 }
    );
  }

  // 5. Anti-Bot Account Age Check: Roblox account must be at least 30 days old
  try {
    const userDetailRes = await fetch(`https://users.roblox.com/v1/users/${effectiveVoterId}`, {
      cache: "no-store",
    });
    if (userDetailRes.ok) {
      const userDetail = await userDetailRes.json();
      if (userDetail && userDetail.created) {
        const createdTime = new Date(userDetail.created).getTime();
        const accountAgeDays = Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24));
        if (accountAgeDays < 30) {
          return NextResponse.json(
            {
              success: false,
              message: `Akun Roblox kamu masih terlalu baru (${accountAgeDays} hari). Minimal umur akun adalah 30 hari untuk mencegah bot / akun klon baru.`,
            },
            { status: 403 }
          );
        }
      }
    }
  } catch (err) {
    console.error("Roblox user age check error:", err);
  }

  // 6. Mandatory Community Check: Must be member of FEMME'S STUDIO (740188661)
  const REQUIRED_GROUP_ID = 740188661;
  let isGroupMember = false;
  try {
    const groupRes = await fetch(
      `https://groups.roblox.com/v1/users/${effectiveVoterId}/groups/roles`,
      { cache: "no-store" }
    );
    if (groupRes.ok) {
      const groupData = await groupRes.json();
      isGroupMember = groupData.data?.some(
        (g: { group?: { id?: number } }) => g.group?.id === REQUIRED_GROUP_ID
      ) || false;
    }
  } catch (err) {
    console.error("Group verification error in /api/vote:", err);
  }

  if (!isGroupMember) {
    return NextResponse.json(
      {
        success: false,
        message: "Akun kamu belum bergabung ke grup resmi 'FEMME'S STUDIO'. Wajib join komunitas terlebih dahulu untuk voting!",
        joinUrl: `https://www.roblox.com/groups/${REQUIRED_GROUP_ID}`,
      },
      { status: 403 }
    );
  }

  // 7. Anti-Sybil Protection: 1 USN = 1 Hardware (GPU/Canvas) + 1 Device & IP Enforcement
  const clientIp = getClientIp(req);
  const effectiveDevice = (deviceId || "").trim();
  const effectiveHardware = (hardwareFingerprint || "").trim();

  const deviceCheck = validateDeviceAndIp(
    effectiveVoterId,
    effectiveVoterName,
    effectiveDevice,
    clientIp,
    effectiveHardware
  );

  if (!deviceCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: deviceCheck.reason || "Batas voting per perangkat atau IP tercapai.",
      },
      { status: 403 }
    );
  }

  // 5. Validate Event Voting Status (Host must initiate voting first)
  const eventStatus = getEventStatus();
  if (eventStatus.status === "not_started") {
    return NextResponse.json(
      {
        success: false,
        message: "Voting has not been started yet. Please wait for the event host to start the voting session.",
      },
      { status: 400 }
    );
  }
  if (eventStatus.status === "ended") {
    return NextResponse.json(
      {
        success: false,
        message: "Voting session has concluded. Thank you for participating!",
      },
      { status: 400 }
    );
  }

  // 6. Validate Voting Deadline (if configured)
  const endDateStr = process.env.NEXT_PUBLIC_VOTING_END_DATE;
  if (endDateStr) {
    const endTimestamp = new Date(endDateStr).getTime();
    if (!isNaN(endTimestamp) && Date.now() >= endTimestamp) {
      return NextResponse.json(
        {
          success: false,
          message: "Voting has officially closed. Thank you for participating!",
        },
        { status: 400 }
      );
    }
  }

  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      { success: false, message: "Database Supabase is not configured on the server." },
      { status: 503 }
    );
  }

  try {
    // 6. Execute atomic verified vote via Supabase RPC
    const { data, error } = await supabaseServer.rpc("cast_verified_vote", {
      target_submission_id: submissionId,
      voter_id: effectiveVoterId,
      voter_name: effectiveVoterName,
    });

    if (error) {
      console.error("Supabase cast_verified_vote error:", error);
      // Fallback to basic increment if votes_log table is not yet migrated
      const { error: incError } = await supabaseServer.rpc("increment_vote", {
        row_id: submissionId,
      });

      if (incError) {
        return NextResponse.json(
          { success: false, message: "Gagal mencatat vote di database: " + incError.message },
          { status: 500 }
        );
      }

      // Record device and IP binding upon successful vote
      recordDeviceAndIp(effectiveVoterId, effectiveVoterName, effectiveDevice, clientIp, effectiveHardware);

      return NextResponse.json({
        success: true,
        message: "Vote berhasil tercatat!",
      });
    }

    if (data && data.success === false) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Batas voting tercapai (Maksimal 2 vote per akun).",
        },
        { status: 400 }
      );
    }

    // Record device and IP binding upon successful vote
    recordDeviceAndIp(effectiveVoterId, effectiveVoterName, effectiveDevice, clientIp, effectiveHardware);

    return NextResponse.json({
      success: true,
      message: data?.message || "Vote berhasil disimpan secara permanen!",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Voting API Exception:", errorMsg);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server saat memproses vote." },
      { status: 500 }
    );
  }
}
