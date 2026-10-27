import fs from "fs";
import path from "path";
import { validateDeviceAndIp, recordDeviceAndIp } from "../src/lib/device-limiter.ts";

const TEST_FILE = path.join(process.cwd(), ".device-voters.json");

let originalContent = null;
if (fs.existsSync(TEST_FILE)) {
  originalContent = fs.readFileSync(TEST_FILE, "utf-8");
}

console.log("=== STARTING STRICT 1 USN = 1 DEVICE LOCK TEST ===");

try {
  fs.writeFileSync(TEST_FILE, JSON.stringify({
    deviceToUser: {},
    userToDevice: {},
    hardwareToUser: {},
    userToHardware: {},
    ipToUsers: {},
  }, null, 2), "utf-8");

  // TEST 1: aillify binds to Device 1 (PC)
  const devPC = "dev_pc_laptop_111";
  const hwPC = "hw_pc_nvidia_gpu_hash";
  const ipPC = "114.122.1.1";
  const aillifyId = 1001;
  const aillifyUsn = "aillify";
  const uaPC = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";

  console.log("\n[1] Check aillify on Device 1 (PC):");
  const check1 = validateDeviceAndIp(aillifyId, aillifyUsn, devPC, ipPC, hwPC, uaPC);
  console.log("Allowed?", check1.allowed);
  if (!check1.allowed) throw new Error("aillify should be allowed on fresh PC");
  recordDeviceAndIp(aillifyId, aillifyUsn, devPC, ipPC, hwPC, uaPC);

  // TEST 2: aillify tries to connect on Device 2 (iPhone)
  const deviPhone = "dev_iphone_safari_222";
  const hwiPhone = "hw_iphone_apple_gpu_hash";
  const ipiPhone = "180.252.2.2";
  const uaiPhone = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)";

  console.log("\n[2] aillify tries to connect on Device 2 (iPhone):");
  const check2 = validateDeviceAndIp(aillifyId, aillifyUsn, deviPhone, ipiPhone, hwiPhone, uaiPhone);
  console.log("Allowed?", check2.allowed, "| Reason:", check2.reason);
  if (check2.allowed) throw new Error("aillify MUST BE BLOCKED from logging into a second device (iPhone)!");

  // TEST 3: Fresh user (Rosieeeepetals) connects on Device 2 (iPhone)
  const rosieId = 2002;
  const rosieUsn = "Rosieeeepetals";
  console.log("\n[3] Rosieeeepetals connects on Device 2 (iPhone):");
  const check3 = validateDeviceAndIp(rosieId, rosieUsn, deviPhone, ipiPhone, hwiPhone, uaiPhone);
  console.log("Allowed?", check3.allowed);
  if (!check3.allowed) throw new Error("Rosieeeepetals on her own iPhone should be allowed!");
  recordDeviceAndIp(rosieId, rosieUsn, deviPhone, ipiPhone, hwiPhone, uaiPhone);

  // TEST 4: Rosieeeepetals tries to connect on Device 1 (PC)
  console.log("\n[4] Rosieeeepetals tries to connect on Device 1 (PC):");
  const check4 = validateDeviceAndIp(rosieId, rosieUsn, devPC, ipPC, hwPC, uaPC);
  console.log("Allowed?", check4.allowed, "| Reason:", check4.reason);
  if (check4.allowed) throw new Error("Rosieeeepetals MUST BE BLOCKED on Device 1!");

  // TEST 5: Android User A (Samsung/Xiaomi with generic Mali GPU) connects on Phone A
  const devAndroidA = "dev_android_phone_aaa";
  const hwGenericMali = "hw_generic_mali_g57_hash";
  const ipAndroidA = "114.124.50.1";
  const androidUserAId = 3001;
  const androidUserAUsn = "BudiAndroid";
  const uaAndroidA = "Mozilla/5.0 (Linux; Android 14; SM-A155F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

  console.log("\n[5] Android User A (BudiAndroid) on Phone A:");
  const check5 = validateDeviceAndIp(androidUserAId, androidUserAUsn, devAndroidA, ipAndroidA, hwGenericMali, uaAndroidA);
  console.log("Allowed?", check5.allowed);
  if (!check5.allowed) throw new Error("BudiAndroid should be allowed on fresh Android phone");
  recordDeviceAndIp(androidUserAId, androidUserAUsn, devAndroidA, ipAndroidA, hwGenericMali, uaAndroidA);

  // TEST 6: Android User B on Phone B with SAME generic Mali GPU (different person, same phone model)
  const devAndroidB = "dev_android_phone_bbb";
  const ipAndroidB = "114.124.70.2";
  const androidUserBId = 3002;
  const androidUserBUsn = "SitiAndroid";
  const uaAndroidB = "Mozilla/5.0 (Linux; Android 14; SM-A155F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

  console.log("\n[6] Android User B (SitiAndroid) on Phone B with SAME Mali GPU model:");
  const check6 = validateDeviceAndIp(androidUserBId, androidUserBUsn, devAndroidB, ipAndroidB, hwGenericMali, uaAndroidB);
  console.log("Allowed?", check6.allowed);
  if (!check6.allowed) throw new Error("SitiAndroid MUST NOT be blocked by generic Mali GPU collision!");
  recordDeviceAndIp(androidUserBId, androidUserBUsn, devAndroidB, ipAndroidB, hwGenericMali, uaAndroidB);

  // TEST 7: Alt account tries to use Phone A (deviceToUser check)
  const altUserId = 3003;
  const altUserUsn = "BudiAltTuyul";
  console.log("\n[7] Alt account (BudiAltTuyul) tries to use Phone A:");
  const check7 = validateDeviceAndIp(altUserId, altUserUsn, devAndroidA, ipAndroidA, hwGenericMali, uaAndroidA);
  console.log("Allowed?", check7.allowed, "| Reason:", check7.reason);
  if (check7.allowed) throw new Error("Alt account on Phone A MUST BE BLOCKED by deviceToUser!");

  console.log("\n>>> ALL BI-DIRECTIONAL (PC + IPHONE + ANDROID) TESTS PASSED! <<<");

} finally {
  if (originalContent !== null) {
    fs.writeFileSync(TEST_FILE, originalContent, "utf-8");
  }
}
