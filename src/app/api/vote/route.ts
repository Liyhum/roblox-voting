import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { supabaseServer, isServerSupabaseConfigured } from "@/lib/supabase-server";

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
  let body: { submissionId?: string; voterUsername?: string; voterId?: number | string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { submissionId, voterUsername, voterId } = body;
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
      // Deterministic numeric hash from username
      let hash = 0;
      const lower = effectiveVoterName.toLowerCase();
      for (let i = 0; i < lower.length; i++) {
        hash = (hash << 5) - hash + lower.charCodeAt(i);
        hash |= 0;
      }
      effectiveVoterId = Math.abs(hash) || 1;
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

  // 5. Validate Voting Deadline
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
