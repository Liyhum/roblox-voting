import { NextResponse } from "next/server";
import { isRobloxOAuthConfigured } from "@/lib/roblox-oauth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/roblox_user_session=([^;]+)/);

  let user = null;
  if (match) {
    try {
      const decoded = decodeURIComponent(match[1]);
      user = JSON.parse(decoded);
    } catch {
      // invalid cookie json
    }
  }

  return NextResponse.json({
    user,
    isOAuthConfigured: isRobloxOAuthConfigured,
  });
}
