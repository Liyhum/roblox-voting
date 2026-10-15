import { NextResponse } from "next/server";
import {
  ROBLOX_CLIENT_ID,
  ROBLOX_CLIENT_SECRET,
  getAppBaseUrl,
} from "@/lib/roblox-oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = getAppBaseUrl(request.url);

  if (error) {
    return NextResponse.redirect(
      `${baseUrl}/?auth_error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=Missing_code_or_state`);
  }

  // Get stored state from cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/roblox_oauth_state=([^;]+)/);
  const storedState = match ? match[1] : null;

  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/?auth_error=Invalid_state_verification`);
  }

  try {
    const redirectUri = `${baseUrl}/api/auth/roblox/callback`;

    // 1. Exchange authorization code for access token
    const tokenParams = new URLSearchParams();
    tokenParams.set("client_id", ROBLOX_CLIENT_ID);
    tokenParams.set("client_secret", ROBLOX_CLIENT_SECRET);
    tokenParams.set("grant_type", "authorization_code");
    tokenParams.set("code", code);
    tokenParams.set("redirect_uri", redirectUri);

    const tokenRes = await fetch("https://apis.roblox.com/oauth/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenParams.toString(),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error("Roblox Token Exchange Failed:", errBody);
      return NextResponse.redirect(`${baseUrl}/?auth_error=Token_exchange_failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated Roblox User Profile
    const userInfoRes = await fetch("https://apis.roblox.com/oauth/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(`${baseUrl}/?auth_error=Failed_to_fetch_userinfo`);
    }

    const userInfo = await userInfoRes.json();
    const userId = Number(userInfo.sub);
    const username = userInfo.preferred_username || userInfo.name;
    const displayName = userInfo.nickname || userInfo.name || username;

    // 3. Fetch headshot avatar thumbnail
    let avatarUrl = userInfo.picture || "";
    try {
      const thumbRes = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`
      );
      if (thumbRes.ok) {
        const thumbData = await thumbRes.json();
        if (thumbData.data && thumbData.data.length > 0) {
          avatarUrl = thumbData.data[0].imageUrl;
        }
      }
    } catch {
      // fallback to userInfo.picture
    }

    // 4. Verify Group Membership (740188661 - FEMME'S STUDIO)
    let isInGroup = false;
    let roleName = "";
    try {
      const groupRes = await fetch(
        `https://groups.roblox.com/v1/users/${userId}/groups/roles`,
        { cache: "no-store" }
      );
      if (groupRes.ok) {
        const groupData = await groupRes.json();
        const found = groupData.data?.find(
          (g: { group?: { id?: number }; role?: { name?: string } }) =>
            g.group?.id === 740188661
        );
        if (found) {
          isInGroup = true;
          roleName = found.role?.name || "Member";
        }
      }
    } catch {
      // ignore
    }

    const sessionPayload = {
      id: userId,
      username,
      displayName,
      avatarUrl,
      isInGroup,
      roleName,
      verifiedAt: Date.now(),
    };

    const response = NextResponse.redirect(`${baseUrl}/?auth=success`);

    // Set secure user session cookie
    response.cookies.set("roblox_user_session", JSON.stringify(sessionPayload), {
      httpOnly: false, // Accessible to client so React state can hydrate immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Clear state cookie
    response.cookies.delete("roblox_oauth_state");

    return response;
  } catch (err: unknown) {
    console.error("Roblox OAuth Callback Error:", err);
    return NextResponse.redirect(`${baseUrl}/?auth_error=Unexpected_server_error`);
  }
}
