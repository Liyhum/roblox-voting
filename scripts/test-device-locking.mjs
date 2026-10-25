import fs from "fs";
import path from "path";
import { validateDeviceAndIp, recordDeviceAndIp } from "../src/lib/device-limiter.ts";

const TEST_FILE = path.join(process.cwd(), ".device-voters.json");

// Backup original .device-voters.json if exists
let originalContent = null;
if (fs.existsSync(TEST_FILE)) {
  originalContent = fs.readFileSync(TEST_FILE, "utf-8");
}

console.log("=== STARTING COMPREHENSIVE DEVICE LOCK & IPHONE TEST ===");

try {
  // Reset store for fresh test
  fs.writeFileSync(TEST_FILE, JSON.stringify({
    deviceToUser: {},
    userToDevice: {},
    hardwareToUser: {},
    userToHardware: {},
    ipToUsers: {},
  }, null, 2), "utf-8");

  // TEST 1: aillify binds to Device A
  const devA = "dev_aillify_laptop_123";
  const hwA = "hw_nvidia_rtx_pc_aillify_fingerprint_hash_999";
  const ipA = "114.122.10.5";
  const aillifyId = 1001;
  const aillifyUsn = "aillify";

  console.log("\n[1] Check aillify on new device:");
  const check1 = validateDeviceAndIp(aillifyId, aillifyUsn, devA, ipA, hwA);
  console.log("Allowed?", check1.allowed);
  if (!check1.allowed) throw new Error("aillify should be allowed on fresh device");

  // Bind aillify
  recordDeviceAndIp(aillifyId, aillifyUsn, devA, ipA, hwA);
  console.log("-> aillify successfully bound to devA and hwA");

  // TEST 2: User tries to enter 'reeeygar' on Device A (Same browser / normal tab)
  const reeeygarId = 1002;
  const reeeygarUsn = "reeeygar";
  console.log("\n[2] reeeygar tries to connect on SAME Device A (Normal tab):");
  const check2 = validateDeviceAndIp(reeeygarId, reeeygarUsn, devA, ipA, hwA);
  console.log("Allowed?", check2.allowed, "| Reason:", check2.reason);
  if (check2.allowed) throw new Error("reeeygar MUST BE BLOCKED on same device!");

  // TEST 3: User clears localStorage or opens Incognito on Device A (new devId, but SAME hwA)
  const incognitoDevA = "dev_incognito_random_xyz_777";
  console.log("\n[3] reeeygar tries to connect in INCOGNITO on Device A (Same hardware GPU):");
  const check3 = validateDeviceAndIp(reeeygarId, reeeygarUsn, incognitoDevA, ipA, hwA);
  console.log("Allowed?", check3.allowed, "| Reason:", check3.reason);
  if (check3.allowed) throw new Error("reeeygar MUST BE BLOCKED in Incognito by hardware fingerprint!");

  // TEST 4: aillify returns to Device A (should be allowed!)
  console.log("\n[4] aillify returns to Device A (should still be allowed):");
  const check4 = validateDeviceAndIp(aillifyId, aillifyUsn, devA, ipA, hwA);
  console.log("Allowed?", check4.allowed);
  if (!check4.allowed) throw new Error("aillify should be allowed on their own device");

  // TEST 5: iPhone Scenario (AraaCute02 vs Rosieeeepetals)
  console.log("\n[5] iPhone Isolation Test:");
  const iphoneAraaDevice = "dev_iphone_araa_111";
  const iphoneAraaHw = "hw_apple_gpu_isolated_dev_iphone_araa_111";
  const araaId = 10467794308;
  const araaUsn = "AraaCute02";

  recordDeviceAndIp(araaId, araaUsn, iphoneAraaDevice, "180.252.1.1", iphoneAraaHw);
  console.log("-> AraaCute02 bound on iPhone A");

  const iphoneRosieDevice = "dev_iphone_rosie_222";
  const iphoneRosieHw = "hw_apple_gpu_isolated_dev_iphone_rosie_222";
  const rosieId = 2055112233;
  const rosieUsn = "Rosieeeepetals";

  const checkRosie = validateDeviceAndIp(rosieId, rosieUsn, iphoneRosieDevice, "180.252.1.2", iphoneRosieHw);
  console.log("Rosie on iPhone B allowed?", checkRosie.allowed, checkRosie.reason || "OK!");
  if (!checkRosie.allowed) throw new Error("Rosieeeepetals on her own iPhone should NOT be blocked by AraaCute02!");

  // TEST 6: Rosieeeepetals on iPhone B tries to switch to an alt 'reeeygar' on iPhone B
  console.log("\n[6] Rosie's iPhone B tries to switch account to reeeygar:");
  recordDeviceAndIp(rosieId, rosieUsn, iphoneRosieDevice, "180.252.1.2", iphoneRosieHw);
  const checkAltOnRosiePhone = validateDeviceAndIp(reeeygarId, reeeygarUsn, iphoneRosieDevice, "180.252.1.2", iphoneRosieHw);
  console.log("Alt on Rosie's iPhone allowed?", checkAltOnRosiePhone.allowed, "| Reason:", checkAltOnRosiePhone.reason);
  if (checkAltOnRosiePhone.allowed) throw new Error("Alt on Rosie's iPhone MUST BE BLOCKED!");

  console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");

} finally {
  // Restore original content
  if (originalContent !== null) {
    fs.writeFileSync(TEST_FILE, originalContent, "utf-8");
  }
}
