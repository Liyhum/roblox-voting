import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { supabaseServer, isServerSupabaseConfigured } from "@/lib/supabase-server";
import { isValidTikTokUrl } from "@/lib/tiktok";

// Only allow images
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function sanitizeText(str: string): string {
  return str
    .replace(/[<>]/g, "") // Strip HTML tag brackets
    .trim();
}

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: Max 5 uploads per 10 minutes per IP
  const rateResult = checkRateLimit(req, {
    keyPrefix: "submission_upload",
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: `Terlalu banyak percobaan upload. Mohon tunggu ${Math.ceil(
          rateResult.retryAfterSeconds / 60
        )} menit lagi.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateResult.retryAfterSeconds) },
      }
    );
  }

  // 2. Validate Origin (CSRF protection)
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json(
          { success: false, message: "Cross-site submission rejected." },
          { status: 403 }
        );
      }
    } catch {
      // ignore
    }
  }

  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      { success: false, message: "Database Supabase belum dikonfigurasi di server." },
      { status: 503 }
    );
  }

  // 3. Parse Multipart Form Data
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid form data." },
      { status: 400 }
    );
  }

  const rawUsername = formData.get("username")?.toString() || "";
  const rawCaption = formData.get("caption")?.toString() || "";
  const rawTiktokUrl = formData.get("tiktokUrl")?.toString() || "";
  const file = formData.get("file") as File | null;
  const rawAvatarUrl = formData.get("avatarUrl")?.toString() || "";

  const username = sanitizeText(rawUsername);
  const caption = sanitizeText(rawCaption).slice(0, 150);
  const tiktokUrl = rawTiktokUrl.trim();

  // Validate Username format
  if (!username || !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return NextResponse.json(
      { success: false, message: "Username Roblox tidak valid (3-30 karakter alfanumerik)." },
      { status: 400 }
    );
  }

  // Optional: If user is logged in via OAuth, ensure username matches or is authorized
  const sessionUser = getSessionFromRequest(req);
  if (sessionUser && sessionUser.username.toLowerCase() !== username.toLowerCase()) {
    // If logged in, require them to submit with their own authenticated username
    return NextResponse.json(
      {
        success: false,
        message: `Kamu sedang login sebagai @${sessionUser.username}. Silakan gunakan username akunmu sendiri.`,
      },
      { status: 403 }
    );
  }

  // Validate File
  if (!file || typeof file.size !== "number" || file.size === 0) {
    return NextResponse.json(
      { success: false, message: "Foto outfit wajib diunggah." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { success: false, message: "Ukuran file terlalu besar! Maksimal ukuran adalah 5 MB." },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        success: false,
        message: "Format file tidak didukung! Hanya file gambar (JPG, PNG, WebP) yang diizinkan.",
      },
      { status: 400 }
    );
  }

  // Validate TikTok URL if provided
  if (tiktokUrl && !isValidTikTokUrl(tiktokUrl)) {
    return NextResponse.json(
      {
        success: false,
        message: "Link TikTok tidak valid. Gunakan format https://vt.tiktok.com/... atau https://www.tiktok.com/@...",
      },
      { status: 400 }
    );
  }

  try {
    // 4. Duplicate Check: 1 Username = 1 Submission
    const { data: existingCheck } = await supabaseServer
      .from("submissions")
      .select("id, roblox_username")
      .ilike("roblox_username", username)
      .limit(1);

    if (existingCheck && existingCheck.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Akun Roblox @${existingCheck[0].roblox_username} sudah pernah mendaftar! Setiap username hanya boleh mengirim 1 outfit (1 USN = 1 Submit).`,
        },
        { status: 400 }
      );
    }

    // 5. Upload File to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(fileExt) ? fileExt : "png";
    const fileName = `${Date.now()}_${username.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${safeExt}`;

    const { data: uploadData, error: uploadError } = await supabaseServer.storage
      .from("roblox_images")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { success: false, message: `Gagal upload gambar: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseServer.storage
      .from("roblox_images")
      .getPublicUrl(uploadData.path);

    const imageUrl = publicUrlData.publicUrl;

    // 6. Insert Submission to Database
    const payload: Record<string, unknown> = {
      roblox_username: username,
      roblox_avatar_url: rawAvatarUrl || null,
      caption: caption || null,
      image_url: imageUrl,
      votes: 0,
    };

    if (tiktokUrl) {
      payload.tiktok_url = tiktokUrl;
    }

    let { error: dbError } = await supabaseServer.from("submissions").insert([payload]);

    if (dbError && dbError.message && dbError.message.toLowerCase().includes("tiktok_url")) {
      delete payload.tiktok_url;
      const retryResult = await supabaseServer.from("submissions").insert([payload]);
      if (!retryResult.error) {
        dbError = null;
      } else {
        dbError = retryResult.error;
      }
    }

    if (dbError) {
      if (
        dbError.code === "23505" ||
        dbError.message?.toLowerCase().includes("unique") ||
        dbError.message?.toLowerCase().includes("duplicate")
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Akun Roblox @${username} sudah pernah mendaftar! Setiap akun hanya boleh 1 kali submit.`,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, message: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Outfit runway kamu berhasil terdaftar!",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Submissions API Exception:", errorMsg);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server saat menyimpan outfit." },
      { status: 500 }
    );
  }
}
