/**
 * Helper utilities for TikTok video URL parsing and embedding
 */

/**
 * Validates whether a string looks like a legitimate TikTok link
 */
export function isValidTikTokUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
  
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    return (
      host === "tiktok.com" ||
      host.endsWith(".tiktok.com")
    );
  } catch {
    return false;
  }
}

/**
 * Extracts TikTok numeric video ID from URL
 * Supports:
 * - https://www.tiktok.com/@username/video/7123456789012345678
 * - https://www.tiktok.com/@username/photo/7123456789012345678
 * - https://m.tiktok.com/v/7123456789012345678.html
 * - https://www.tiktok.com/embed/v2/7123456789012345678
 */
export function extractTikTokVideoId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();

  // Pattern 1: standard video, photo, or embed URL
  const match = trimmed.match(/(?:video|v|photo|embed(?:\/v\d+)?)\/(\d+)/i);
  if (match && match[1]) {
    return match[1];
  }

  // Pattern 2: query parameter or direct numeric ID
  const numMatch = trimmed.match(/[?&]item_id=(\d+)/i);
  if (numMatch && numMatch[1]) {
    return numMatch[1];
  }

  return null;
}

/**
 * Returns iframe embed URL for TikTok player (uses official player/v1 endpoint)
 */
export function getTikTokEmbedUrl(videoId: string): string {
  return `https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=1`;
}

