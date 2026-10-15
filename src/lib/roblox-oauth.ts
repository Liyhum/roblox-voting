export const ROBLOX_CLIENT_ID = process.env.ROBLOX_CLIENT_ID || "";
export const ROBLOX_CLIENT_SECRET = process.env.ROBLOX_CLIENT_SECRET || "";

export const isRobloxOAuthConfigured = Boolean(
  ROBLOX_CLIENT_ID &&
  ROBLOX_CLIENT_SECRET &&
  !ROBLOX_CLIENT_ID.includes("your-")
);

export function getAppBaseUrl(requestUrl?: string): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }
  if (requestUrl) {
    const url = new URL(requestUrl);
    return `${url.protocol}//${url.host}`;
  }
  return "https://roblox-voting-web.vercel.app";
}

export interface RobloxUserInfo {
  sub: string; // Roblox User ID
  name: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
}
