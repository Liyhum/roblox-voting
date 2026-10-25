import fs from "fs";
import path from "path";

interface DeviceLimitStore {
  // Software deviceId -> { voterId: number, username: string }
  deviceToUser: Record<string, { voterId: number; username: string }>;
  // voterId -> deviceId
  userToDevice: Record<string, string>;
  // Hardware GPU/Canvas fingerprint -> { voterId: number, username: string }
  hardwareToUser: Record<string, { voterId: number; username: string }>;
  // voterId -> hardware fingerprint
  userToHardware: Record<string, string>;
  // ip -> array of voterIds
  ipToUsers: Record<string, number[]>;
}

const FILE_PATH = path.join(process.cwd(), ".device-voters.json");

let memoryStore: DeviceLimitStore = {
  deviceToUser: {},
  userToDevice: {},
  hardwareToUser: {},
  userToHardware: {},
  ipToUsers: {},
};

function loadStore() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object") {
        memoryStore = {
          deviceToUser: parsed.deviceToUser || {},
          userToDevice: parsed.userToDevice || {},
          hardwareToUser: parsed.hardwareToUser || {},
          userToHardware: parsed.userToHardware || {},
          ipToUsers: parsed.ipToUsers || {},
        };

        // Migration: release legacy unsalted iOS generic hardware collision for AraaCute02
        let cleaned = false;
        for (const [hwHash, bound] of Object.entries(memoryStore.hardwareToUser)) {
          if (bound && bound.username && bound.username.toLowerCase() === "araacute02") {
            delete memoryStore.hardwareToUser[hwHash];
            cleaned = true;
          }
        }
        if (memoryStore.userToHardware) {
          for (const [vId, hwHash] of Object.entries(memoryStore.userToHardware)) {
            if (!memoryStore.hardwareToUser[hwHash]) {
              delete memoryStore.userToHardware[vId];
              cleaned = true;
            }
          }
        }
        if (cleaned) {
          saveStore();
        }
      }
    }
  } catch {
    // ignore
  }
}

function saveStore() {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(memoryStore, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save .device-voters.json:", err);
  }
}

/**
 * Validates strict 1 USN = 1 Physical Device (Hardware/Canvas), 1 Software Device, and 1 IP limit
 */
/**
 * Validates strict 1 USN = 1 Physical Device (Hardware/Canvas), 1 Software Device, and 1 IP limit
 */
export function validateDeviceAndIp(
  voterId: number,
  username: string,
  deviceId: string,
  clientIp: string,
  hardwareFingerprint?: string,
  userAgent?: string
): { allowed: boolean; reason?: string } {
  loadStore();

  const voterKey = String(voterId);
  const cleanIp = (clientIp || "unknown").trim();
  const cleanDevice = (deviceId || "").trim();
  const cleanHardware = (hardwareFingerprint || "").trim();
  const isApple = /iPad|iPhone|iPod/i.test(userAgent || "");

  // 1. HARDWARE FINGERPRINT CHECK (GPU, Canvas, Audio, Screen)
  // Apple devices (iPhone/iPad/Safari) intentionally mask GPU & hardware nuances for privacy,
  // returning identical "Apple GPU", 4 cores, and uniform canvas for all users of the same model.
  // We do NOT block Apple users with generic hardware hashes because different iPhone users share identical specs.
  // Anti-multi-account on iPhone is strictly enforced by check #2 (deviceToUser: 1 device token = 1 account).
  if (!isApple && cleanHardware && cleanHardware !== "server-side-stub" && cleanHardware.length > 10) {
    if (memoryStore.hardwareToUser[cleanHardware]) {
      const bound = memoryStore.hardwareToUser[cleanHardware];
      if (bound.voterId !== voterId) {
        return {
          allowed: false,
          reason: `Perangkat fisik (Hardware/GPU) ini sudah digunakan oleh akun @${bound.username}. Dilarang membuka Incognito atau membersihkan cache untuk voting menggunakan akun lain.`,
        };
      }
    }
  }

  // 2. Software Device UUID Check: 1 Device = 1 Roblox Account
  // Strictly guarantees 1 Browser Device Token can NEVER be used by more than 1 Roblox account
  if (cleanDevice && memoryStore.deviceToUser[cleanDevice]) {
    const bound = memoryStore.deviceToUser[cleanDevice];
    if (bound.voterId !== voterId) {
      return {
        allowed: false,
        reason: `Perangkat (Device) ini sudah digunakan oleh akun @${bound.username}. Sistem membatasi 1 Perangkat hanya untuk 1 Akun Roblox.`,
      };
    }
  }

  // 3. Strict 1 USN = 1 Device Check (Akun tidak boleh pindah ke HP/PC lain)
  // Strictly guarantees 1 Roblox Account can ONLY be used on the 1 device where it first registered
  if (cleanDevice) {
    // Check if voterId is already bound to a different device
    if (memoryStore.userToDevice[voterKey] && memoryStore.userToDevice[voterKey] !== cleanDevice) {
      return {
        allowed: false,
        reason: `Akun Roblox @${username} sudah terdaftar di perangkat lain. Sistem membatasi 1 Akun hanya boleh digunakan pada 1 perangkat.`,
      };
    }

    // Check if username is already bound to a different device
    for (const [dId, bound] of Object.entries(memoryStore.deviceToUser)) {
      if (bound && bound.username && bound.username.toLowerCase() === username.toLowerCase() && dId !== cleanDevice) {
        return {
          allowed: false,
          reason: `Akun Roblox @${username} sudah terdaftar di perangkat lain. Sistem membatasi 1 Akun hanya boleh digunakan pada 1 perangkat.`,
        };
      }
    }
  }

  // 4. IP Address Check (Max 2 accounts per IP to prevent proxy/bot networks)
  if (cleanIp && cleanIp !== "127.0.0.1" && cleanIp !== "unknown") {
    const existingUsersOnIp = memoryStore.ipToUsers[cleanIp] || [];
    if (!existingUsersOnIp.includes(voterId) && existingUsersOnIp.length >= 2) {
      return {
        allowed: false,
        reason: `Batas kuota jaringan IP telah tercapai (Maksimal 2 akun per koneksi Wi-Fi/IP).`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Binds device, hardware fingerprint, and IP to the voter account upon successful vote
 */
export function recordDeviceAndIp(
  voterId: number,
  username: string,
  deviceId: string,
  clientIp: string,
  hardwareFingerprint?: string,
  userAgent?: string
) {
  loadStore();

  const voterKey = String(voterId);
  const cleanIp = (clientIp || "unknown").trim();
  const cleanDevice = (deviceId || "").trim();
  const cleanHardware = (hardwareFingerprint || "").trim();
  const isApple = /iPad|iPhone|iPod/i.test(userAgent || "");

  if (cleanDevice) {
    memoryStore.deviceToUser[cleanDevice] = { voterId, username };
    memoryStore.userToDevice[voterKey] = cleanDevice;
  }

  // Only record hardware fingerprint for non-Apple devices to avoid poisoning the store with generic "Apple GPU" hashes
  if (!isApple && cleanHardware && cleanHardware !== "server-side-stub" && cleanHardware.length > 10) {
    memoryStore.hardwareToUser[cleanHardware] = { voterId, username };
    memoryStore.userToHardware[voterKey] = cleanHardware;
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
