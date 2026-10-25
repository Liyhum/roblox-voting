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

  console.log("\n>>> ALL BI-DIRECTIONAL 1 USN = 1 DEVICE TESTS PASSED! <<<");

} finally {
  if (originalContent !== null) {
    fs.writeFileSync(TEST_FILE, originalContent, "utf-8");
  }
}
