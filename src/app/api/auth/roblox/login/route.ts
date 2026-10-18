import { NextResponse } from "next/server";
import { ROBLOX_CLIENT_ID, getAppBaseUrl, isRobloxOAuthConfigured } from "@/lib/roblox-oauth";
import { checkRateLimit } from "@/lib/rate-limit";
import crypto from "crypto";

export async function GET(request: Request) {
  // Rate limiting: Max 15 login requests per minute per IP
  const rateResult = checkRateLimit(request, {
    keyPrefix: "roblox_login",
    limit: 15,
    windowMs: 60 * 1000,
  });

  if (!rateResult.success) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": String(rateResult.retryAfterSeconds) },
      }
    );
  }

  if (!isRobloxOAuthConfigured) {
    return NextResponse.json(
      { error: "Roblox OAuth is not configured yet. Please add ROBLOX_CLIENT_ID and ROBLOX_CLIENT_SECRET to .env.local" },
      { status: 500 }
    );
  }

  const baseUrl = getAppBaseUrl(request.url);
  const redirectUri = `${baseUrl}/api/auth/roblox/callback`;

  // Generate random cryptographic state to prevent CSRF
  const state = crypto.randomBytes(24).toString("hex");

  const authorizeUrl = new URL("https://apis.roblox.com/oauth/v1/authorize");
  authorizeUrl.searchParams.set("client_id", ROBLOX_CLIENT_ID);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "openid profile");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl.toString());

  // Store state in HTTP-only cookie for 10 minutes
  response.cookies.set("roblox_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
