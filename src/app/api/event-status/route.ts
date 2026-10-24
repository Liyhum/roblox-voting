import { NextRequest, NextResponse } from "next/server";
import { getEventStatus, setEventStatus } from "@/lib/event-status";

export async function GET() {
  const status = getEventStatus();
  return NextResponse.json({
    success: true,
    ...status,
    serverTime: Date.now(),
    cwd: process.cwd(),
  });
}

export async function POST(req: NextRequest) {
  let body: {
    action?: "start" | "pause" | "reset" | "end" | "set_end_date";
    durationSeconds?: number;
    customEndDate?: string;
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

  const { action, durationSeconds, customEndDate, pin } = body;

  const rawEnvPin = process.env.HOST_ADMIN_PIN || "Femme_Host99_Tr3c$2026";
  const configuredPin = rawEnvPin.replace(/^["']|["']$/g, "").trim();

  // Validate Host PIN (supports configured PIN, literal PIN, or bash-expanded variant without $)
  const allowedPins = new Set([
    configuredPin,
    "Femme_Host99_Tr3c$2026",
    "Femme_Host99_Tr3c026",
    "\"Femme_Host99_Tr3c$2026\"",
    "'Femme_Host99_Tr3c$2026'",
  ]);

  if (!pin || !allowedPins.has(pin.trim())) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid Host PIN. Access denied.",
      },
      { status: 401 }
    );
  }

  if (!action || !["start", "pause", "reset", "end", "set_end_date"].includes(action)) {
    return NextResponse.json(
      { success: false, message: "Invalid action. Supported: start, pause, reset, end, set_end_date." },
      { status: 400 }
    );
  }

  const updated = setEventStatus(action, durationSeconds, customEndDate);

  return NextResponse.json({
    success: true,
    message: action === "set_end_date"
      ? `Voting closing date successfully set to: ${customEndDate || "Default (.env)"}`
      : `Event voting status successfully updated to: ${updated.status}`,
    ...updated,
    serverTime: Date.now(),
  });
}
