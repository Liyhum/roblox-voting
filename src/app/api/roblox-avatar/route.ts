import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    // 1. Dapatkan Roblox User ID berdasarkan Username
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false,
      }),
      next: { revalidate: 3600 },
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

    // 2. Ambil Headshot Avatar Thumbnail
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

    return NextResponse.json({
      id: userId,
      name: robloxUser.name,
      displayName: robloxUser.displayName,
      avatarUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
