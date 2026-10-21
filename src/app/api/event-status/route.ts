import { NextRequest, NextResponse } from "next/server";
import { getEventStatus, setEventStatus } from "@/lib/event-status";

export async function GET() {
  const status = getEventStatus();
  return NextResponse.json({
    success: true,
    ...status,
    serverTime: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  let body: {
    action?: "start" | "pause" | "reset" | "end";
    durationSeconds?: number;
    pin?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const { action, durationSeconds, pin } = body;

  const validPin = (process.env.HOST_ADMIN_PIN || "treckl2026").trim();

  // Validate Host PIN
  if (!pin || pin.trim() !== validPin) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Host PIN. Access denied.",
      },
      { status: 401 }
    );
  }

  if (!action || !["start", "pause", "reset", "end"].includes(action)) {
    return NextResponse.json(
      { success: false, message: "Invalid action. Supported: start, pause, reset, end." },
      { status: 400 }
    );
  }

  const updated = setEventStatus(action, durationSeconds);

  return NextResponse.json({
    success: true,
    message: `Event voting status successfully updated to: ${updated.status}`,
    ...updated,
    serverTime: Date.now(),
  });
}
