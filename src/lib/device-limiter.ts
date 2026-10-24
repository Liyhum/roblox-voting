import fs from "fs";
import path from "path";

interface DeviceLimitStore {
  // deviceId -> { voterId: number, username: string }
  deviceToUser: Record<string, { voterId: number; username: string }>;
  // voterId -> deviceId
  userToDevice: Record<string, string>;
  // ip -> array of voterIds
  ipToUsers: Record<string, number[]>;
}

const FILE_PATH = path.join(process.cwd(), ".device-voters.json");

let memoryStore: DeviceLimitStore = {
  deviceToUser: {},
  userToDevice: {},
  ipToUsers: {},
};

let isLoaded = false;

function loadStore() {
  if (isLoaded) return;
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryStore = {
          deviceToUser: parsed.deviceToUser || {},
          userToDevice: parsed.userToDevice || {},
          ipToUsers: parsed.ipToUsers || {},
        };
      }
    }
  } catch {
    // ignore
  }
  isLoaded = true;
}

function saveStore() {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save .device-voters.json:", err);
  }
}

/**
 * Validates strict 1 USN = 1 Device and 1 IP limit
 */
export function validateDeviceAndIp(
  voterId: number,
  username: string,
  deviceId: string,
  clientIp: string
): { allowed: boolean; reason?: string } {
  loadStore();

  const voterKey = String(voterId);
  const cleanIp = (clientIp || "unknown").trim();
  const cleanDevice = (deviceId || "").trim();

  // 1. Check if this device was already used by another voter
  if (cleanDevice && memoryStore.deviceToUser[cleanDevice]) {
    const bound = memoryStore.deviceToUser[cleanDevice];
    if (bound.voterId !== voterId) {
      return {
        allowed: false,
        reason: `Perangkat (Device) ini sudah digunakan oleh akun @${bound.username}. Sistem membatasi 1 Perangkat hanya untuk 1 Akun Roblox.`,
      };
    }
  }

  // 2. Check if this voter was already bound to a different device
  if (cleanDevice && memoryStore.userToDevice[voterKey]) {
    const boundDevice = memoryStore.userToDevice[voterKey];
    if (boundDevice !== cleanDevice) {
      return {
        allowed: false,
        reason: `Akun @${username} sudah terdaftar pada perangkat lain. 1 Akun hanya diizinkan voting dari 1 perangkat.`,
      };
    }
  }

  // 3. Check IP address limit (Max 2 accounts per IP to prevent bot farms/proxies)
  if (cleanIp && cleanIp !== "127.0.0.1" && cleanIp !== "unknown") {
    const existingUsersOnIp = memoryStore.ipToUsers[cleanIp] || [];
    if (!existingUsersOnIp.includes(voterId) && existingUsersOnIp.length >= 2) {
      return {
        allowed: false,
        reason: `Batas kuota jaringan IP telah tercapai (Maksimal 2 akun per IP address).`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Binds device and IP to the voter account upon successful vote
 */
export function recordDeviceAndIp(
  voterId: number,
  username: string,
  deviceId: string,
  clientIp: string
) {
  loadStore();

  const voterKey = String(voterId);
  const cleanIp = (clientIp || "unknown").trim();
  const cleanDevice = (deviceId || "").trim();

  if (cleanDevice) {
    memoryStore.deviceToUser[cleanDevice] = { voterId, username };
    memoryStore.userToDevice[voterKey] = cleanDevice;
  }

  if (cleanIp && cleanIp !== "127.0.0.1" && cleanIp !== "unknown") {
    if (!memoryStore.ipToUsers[cleanIp]) {
      memoryStore.ipToUsers[cleanIp] = [];
    }
    if (!memoryStore.ipToUsers[cleanIp].includes(voterId)) {
      memoryStore.ipToUsers[cleanIp].push(voterId);
    }
  }

  saveStore();
}
