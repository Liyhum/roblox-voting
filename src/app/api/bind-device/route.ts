import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/rate-limit";
import { validateDeviceAndIp, recordDeviceAndIp } from "@/lib/device-limiter";

export async function POST(req: NextRequest) {
  let body: {
    voterId: number;
    username: string;
    deviceId: string;
    hardwareFingerprint?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { voterId, username, deviceId, hardwareFingerprint } = body;

  if (!voterId || !username || !deviceId) {
    return NextResponse.json(
      { success: false, message: "Missing required voter/device parameters." },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(req);

  // Validate if this device/hardware is already locked to another username
  const check = validateDeviceAndIp(
    Number(voterId),
    username.trim(),
    deviceId.trim(),
    clientIp,
    (hardwareFingerprint || "").trim()
  );

  if (!check.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: check.reason || "Perangkat ini sudah terkunci untuk akun Roblox lain.",
      },
      { status: 403 }
    );
  }

  // Lock and bind this device to this username immediately upon check-in
  recordDeviceAndIp(
    Number(voterId),
    username.trim(),
    deviceId.trim(),
    clientIp,
    (hardwareFingerprint || "").trim()
  );

  return NextResponse.json({
    success: true,
    message: `Perangkat ini berhasil dikunci permanen untuk akun @${username}.`,
  });
}
