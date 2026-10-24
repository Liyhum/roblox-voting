import fs from "fs";
import path from "path";

export type EventStatusType = "not_started" | "active" | "ended";

export interface EventStatusData {
  status: EventStatusType;
  startedAt: number | null;
  durationSeconds: number | null;
  endsAt: number | null;
  customEndDate?: string | null;
  updatedAt: number;
}

const STATUS_FILE = path.join(process.cwd(), ".event-status.json");

// Default initial state is strictly "not_started"
const DEFAULT_STATE: EventStatusData = {
  status: "not_started",
  startedAt: null,
  durationSeconds: null,
  endsAt: null,
  customEndDate: null,
  updatedAt: Date.now(),
};

// In-memory cache for high performance
let memoryCache: EventStatusData = { ...DEFAULT_STATE };
let lastReadTime = 0;

export function getEventStatus(): EventStatusData {
  const now = Date.now();

  // Refresh from file at most once every 1000ms
  if (now - lastReadTime > 1000) {
    try {
      if (fs.existsSync(STATUS_FILE)) {
        const raw = fs.readFileSync(STATUS_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          memoryCache = {
            status: parsed.status || "not_started",
            startedAt: parsed.startedAt || null,
            durationSeconds: parsed.durationSeconds || null,
            endsAt: parsed.endsAt || null,
            customEndDate: parsed.customEndDate || null,
            updatedAt: parsed.updatedAt || now,
          };
        }
      }
    } catch {
      // Fall back to memoryCache if file read fails
    }
    lastReadTime = now;
  }

  // Auto-expire active voting if duration was set and endsAt has passed
  if (
    memoryCache.status === "active" &&
    memoryCache.endsAt &&
    now >= memoryCache.endsAt
  ) {
    memoryCache = {
      ...memoryCache,
      status: "ended",
      updatedAt: now,
    };
    saveEventStatusToFile(memoryCache);
  }

  return memoryCache;
}

function saveEventStatusToFile(data: EventStatusData) {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write .event-status.json:", err);
  }
}

export function setEventStatus(
  action: "start" | "pause" | "reset" | "end" | "set_end_date",
  durationSeconds?: number,
  customEndDate?: string | null
): EventStatusData {
  const now = Date.now();
  let updated: EventStatusData;

  switch (action) {
    case "start": {
      const dur = durationSeconds && durationSeconds > 0 ? durationSeconds : null;
      const endsAt = dur ? now + dur * 1000 : null;
      updated = {
        ...memoryCache,
        status: "active",
        startedAt: now,
        durationSeconds: dur,
        endsAt,
        updatedAt: now,
      };
      break;
    }
    case "pause": {
      updated = {
        ...memoryCache,
        status: "not_started",
        updatedAt: now,
      };
      break;
    }
    case "reset": {
      updated = {
        ...memoryCache,
        status: "not_started",
        startedAt: null,
        durationSeconds: null,
        endsAt: null,
        updatedAt: now,
      };
      break;
    }
    case "end": {
      updated = {
        ...memoryCache,
        status: "ended",
        updatedAt: now,
      };
      break;
    }
    case "set_end_date": {
      updated = {
        ...memoryCache,
        customEndDate: customEndDate || null,
        updatedAt: now,
      };
      break;
    }
    default:
      updated = memoryCache;
  }

  memoryCache = updated;
  lastReadTime = now;
  saveEventStatusToFile(updated);
  return updated;
}

export function isVotingActive(): boolean {
  const current = getEventStatus();
  return current.status === "active";
}
