import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const REQUIRED_GROUP_ID = 740188661; // FEMME'S STUDIO
const REQUIRED_GROUP_NAME = "FEMME'S STUDIO";
const REQUIRED_GROUP_URL = `https://www.roblox.com/groups/${REQUIRED_GROUP_ID}`;

export async function GET(request: Request) {
  // Rate limiting: Max 40 requests per minute per IP
  const rateResult = checkRateLimit(request, {
    keyPrefix: "roblox_avatar",
    limit: 40,
    windowMs: 60 * 1000,
  });

  if (!rateResult.success) {
    return NextResponse.json(
      { error: "Too many avatar lookup requests. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(rateResult.retryAfterSeconds) },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // 1. Get Roblox User ID by Username
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false,
      }),
      cache: "no-store",
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "Failed to fetch Roblox user" }, { status: 404 });
    }

    const userData = await userRes.json();
    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json({ error: "Roblox user not found" }, { status: 404 });
    }

    const robloxUser = userData.data[0];
    const userId = robloxUser.id;

    // 2. Fetch Headshot Avatar Thumbnail
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      { next: { revalidate: 3600 } }
    );

    let avatarUrl = "";
    if (thumbRes.ok) {
      const thumbData = await thumbRes.json();
      if (thumbData.data && thumbData.data.length > 0) {
        avatarUrl = thumbData.data[0].imageUrl;
      }
    }

    // 3. Verify Membership in official Roblox Group (740188661 - FEMME'S STUDIO)
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
            g.group?.id === REQUIRED_GROUP_ID
        );
        if (found) {
          isInGroup = true;
          roleName = found.role?.name || "Member";
        }
      }
    } catch (err) {
      console.error("Group check error:", err);
    }

    return NextResponse.json({
      id: userId,
      name: robloxUser.name,
      displayName: robloxUser.displayName,
      avatarUrl,
      isInGroup,
      roleName,
      groupId: REQUIRED_GROUP_ID,
      groupName: REQUIRED_GROUP_NAME,
      groupUrl: REQUIRED_GROUP_URL,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
