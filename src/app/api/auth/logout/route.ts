import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("roblox_session_token");
  response.cookies.delete("roblox_user_session");
  return response;
}
