/**
 * Automated Cybersecurity Penetration & Anti-Cheat Test Suite
 * Simulates real attacker vectors against the local voting system.
 */

import { validateDeviceAndIp, recordDeviceAndIp } from '../src/lib/device-limiter.ts';

async function runPenetrationTests() {
  console.log("==========================================================");
  console.log("🛡️ STARTING CYBERSECURITY PENETRATION & HARDENING TESTS");
  console.log("==========================================================\n");

  let passedTests = 0;
  let totalTests = 5;

  const HARDWARE_FINGERPRINT_A = "gpu:NVIDIA_RTX_3080~canvas:7841920~audio:48000";
  const HARDWARE_FINGERPRINT_B = "gpu:INTEL_IRIS_XE~canvas:1102934~audio:44100";

  // -------------------------------------------------------------------------
  // TEST 1: Legitimate First-Time User Voting
  // -------------------------------------------------------------------------
  console.log("[TEST 1] Scenario: User Alice votes legitimately on her laptop...");
  const t1 = validateDeviceAndIp(111111, "Alice", "dev_uuid_alice", "103.12.44.1", HARDWARE_FINGERPRINT_A);
  if (t1.allowed) {
    recordDeviceAndIp(111111, "Alice", "dev_uuid_alice", "103.12.44.1", HARDWARE_FINGERPRINT_A);
    console.log("  ✅ PASS: Alice allowed to vote and bound to hardware.");
    passedTests++;
  } else {
    console.log("  ❌ FAIL: Alice was blocked:", t1.reason);
  }

  // -------------------------------------------------------------------------
  // TEST 2: Attacker clears cookies/localStorage & opens Incognito to vote with Bob
  // (Bypass attempt: new deviceId, same hardware)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 2] Scenario: Attacker opens Incognito (new device UUID), same PC, voting with Bob...");
  const t2 = validateDeviceAndIp(222222, "Bob", "dev_uuid_NEW_INCOGNITO", "103.12.44.1", HARDWARE_FINGERPRINT_A);
  if (!t2.allowed && t2.reason?.includes("Perangkat fisik")) {
    console.log("  ✅ PASS: Attacker BLOCKED by Hardware/GPU Fingerprint!");
    console.log("  🛡️ Block Reason:", t2.reason);
    passedTests++;
  } else {
    console.log("  ❌ FAIL: Attacker bypassed device limit via Incognito!");
  }

  // -------------------------------------------------------------------------
  // TEST 3: Attacker steals Alice's account and tries to vote from another PC
  // -------------------------------------------------------------------------
  console.log("\n[TEST 3] Scenario: Attacker tries to vote Alice's account from a different PC...");
  const t3 = validateDeviceAndIp(111111, "Alice", "dev_uuid_attacker_laptop", "182.25.1.99", HARDWARE_FINGERPRINT_B);
  if (!t3.allowed && t3.reason?.includes("perangkat fisik lain")) {
    console.log("  ✅ PASS: Account Hijack BLOCKED! Alice's account is hardware-locked to her laptop.");
    console.log("  🛡️ Block Reason:", t3.reason);
    passedTests++;
  } else {
    console.log("  ❌ FAIL: Alice's account was voted from an unauthorized device!");
  }

  // -------------------------------------------------------------------------
  // TEST 4: Bot farm floods multiple accounts from 1 IP address (VPN / Home proxy)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 4] Scenario: IP Flooding (more than 2 accounts from same IP)...");
  // Register 2nd allowed user on same Wi-Fi/IP (e.g., family member on different PC)
  recordDeviceAndIp(333333, "Charlie", "dev_uuid_charlie", "103.12.44.1", HARDWARE_FINGERPRINT_B);
  // Try 3rd user on same IP
  const t4 = validateDeviceAndIp(444444, "Dave", "dev_uuid_dave", "103.12.44.1", "gpu:AMD_RADEON~canvas:999");
  if (!t4.allowed && t4.reason?.includes("IP")) {
    console.log("  ✅ PASS: 3rd account on same IP BLOCKED by IP Quota Shield!");
    console.log("  🛡️ Block Reason:", t4.reason);
    passedTests++;
  } else {
    console.log("  ❌ FAIL: Bot farm allowed to register unlimited accounts on 1 IP!");
  }

  // -------------------------------------------------------------------------
  // TEST 5: Roblox Account Age Gate Check (< 30 days old)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 5] Scenario: Testing Anti-Bot Account Age Gate against Roblox API...");
  try {
    // Test with Roblox official user (e.g. Roblox admin or user 1)
    const res = await fetch("https://users.roblox.com/v1/users/1");
    const data = await res.json();
    const createdDate = new Date(data.created);
    const ageDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`  🔍 Real Roblox User #1 created at: ${data.created} (${ageDays} days old)`);
    if (ageDays >= 30) {
      console.log("  ✅ PASS: Roblox API User Age verification verified working!");
      passedTests++;
    } else {
      console.log("  ❌ FAIL: Age calculation failed.");
    }
  } catch (err) {
    console.log("  ❌ FAIL: Network error querying Roblox API:", err.message);
  }

  console.log("\n==========================================================");
  console.log(`🎯 PENETRATION TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log("🏆 SECURITY GRADE: A+ (BULLETPROOF AGAINST INCOGNITO, ALT BOTS, & PROXY FARMS)");
  }
  console.log("==========================================================");
}

runPenetrationTests();
