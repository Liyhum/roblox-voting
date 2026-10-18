import { NextResponse } from "next/server";
import { isRobloxOAuthConfigured } from "@/lib/roblox-oauth";
import { getSessionFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  // Securely verify session using HMAC signature
  const user = getSessionFromRequest(request);

  const response = NextResponse.json({
    user,
    isOAuthConfigured: isRobloxOAuthConfigured,
  });

  // If session is invalid or tampered, ensure legacy cookie is cleaned up
  if (!user) {
    response.cookies.delete("roblox_session_token");
    response.cookies.delete("roblox_user_session");
  }

  return response;
}
