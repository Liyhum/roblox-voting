import crypto from "crypto";

// Secret used to sign HMAC session tokens
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ROBLOX_CLIENT_SECRET ||
  "trec-kl-default-super-secret-key-change-in-env";

export interface RobloxSessionUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isInGroup?: boolean;
  roleName?: string;
  verifiedAt: number;
}

/**
 * Creates a cryptographically signed session token:
 * payload_base64.hmac_signature
 */
export function createSignedSession(user: RobloxSessionUser): string {
  const payloadStr = JSON.stringify(user);
  const payloadB64 = Buffer.from(payloadStr, "utf8").toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies and parses a signed session token.
 * Returns null if the signature is invalid or tampered with.
 */
export function verifySignedSession(token: string): RobloxSessionUser | null {
  if (!token || !token.includes(".")) return null;

  const [payloadB64, providedSig] = token.split(".");
  if (!payloadB64 || !providedSig) return null;

  // Compute expected HMAC
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  const bufExpected = Buffer.from(expectedSig);
  const bufProvided = Buffer.from(providedSig);

  if (bufExpected.length !== bufProvided.length) return null;
  if (!crypto.timingSafeEqual(bufExpected, bufProvided)) return null;

  try {
    const jsonStr = Buffer.from(payloadB64, "base64url").toString("utf8");
    const user = JSON.parse(jsonStr) as RobloxSessionUser;

    // Sanity checks on parsed user
    if (!user || typeof user.id !== "number" || !user.username) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the session user from request Cookie header
 */
export function getSessionFromRequest(request: Request): RobloxSessionUser | null {
  const cookieHeader = request.headers.get("cookie") || "";

  // 1. Check for cryptographically signed cookie first
  const matchSigned = cookieHeader.match(/roblox_session_token=([^;]+)/);
  if (matchSigned) {
    const verified = verifySignedSession(matchSigned[1]);
    if (verified) return verified;
  }

  // 2. Legacy fallback during session migration
  const matchLegacy = cookieHeader.match(/roblox_user_session=([^;]+)/);
  if (matchLegacy) {
    try {
      const decoded = decodeURIComponent(matchLegacy[1]);
      const legacyUser = JSON.parse(decoded) as RobloxSessionUser;
      if (legacyUser && typeof legacyUser.id === "number" && legacyUser.username) {
        return legacyUser;
      }
    } catch {
      // ignore
    }
  }

  return null;
}
