import { NextRequest, NextResponse } from "next/server";
import { extractTikTokVideoId, isValidTikTokUrl, getTikTokEmbedUrl } from "@/lib/tiktok";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Rate limiting: Max 30 requests per minute per IP
  const rateResult = checkRateLimit(req, {
    keyPrefix: "tiktok_resolve",
    limit: 30,
    windowMs: 60 * 1000,
  });

  if (!rateResult.success) {
    return NextResponse.json(
      { error: "Too many TikTok URL resolution requests. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(rateResult.retryAfterSeconds) },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const trimmed = rawUrl.trim();

  if (!isValidTikTokUrl(trimmed)) {
    return NextResponse.json(
      { error: "Invalid TikTok URL. Must start with https:// and be from tiktok.com" },
      { status: 400 }
    );
  }

  // Check if we already have videoId directly
  const directId = extractTikTokVideoId(trimmed);
  if (directId) {
    return NextResponse.json({
      valid: true,
      videoId: directId,
      canonicalUrl: trimmed,
      embedUrl: getTikTokEmbedUrl(directId),
    });
  }

  // If it's a short URL like vt.tiktok.com or vm.tiktok.com, resolve redirect
  try {
    const headRes = await fetch(trimmed, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(5000),
    });

    const finalUrl = headRes.url;
    const resolvedId = extractTikTokVideoId(finalUrl);

    if (resolvedId) {
      return NextResponse.json({
        valid: true,
        videoId: resolvedId,
        canonicalUrl: finalUrl,
        embedUrl: getTikTokEmbedUrl(resolvedId),
      });
    }

    return NextResponse.json({
      valid: true,
      videoId: null,
      canonicalUrl: finalUrl,
      embedUrl: null,
      message: "Resolved URL but could not extract numeric video ID",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to resolve TikTok URL";
    return NextResponse.json(
      {
        valid: false,
        error: errorMsg,
        fallbackUrl: trimmed,
      },
      { status: 500 }
    );
  }
}
