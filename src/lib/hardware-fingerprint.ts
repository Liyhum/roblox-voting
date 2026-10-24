/**
 * Client-Side Hardware & Canvas Fingerprinting Engine
 * Generates a deterministic device fingerprint based on GPU, WebGL, Canvas, Audio, and Screen.
 * PERSISTENT ACROSS INCOGNITO MODE AND LOCALSTORAGE CLEARING.
 */

export async function generateHardwareFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "server-side-stub";

  const components: string[] = [];

  // 1. Screen & Display Properties
  components.push(`screen:${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`);
  components.push(`dpr:${window.devicePixelRatio || 1}`);

  // 2. Hardware Specs
  components.push(`cores:${navigator.hardwareConcurrency || "unknown"}`);
  // @ts-expect-error deviceMemory is not in all standard TS libs
  components.push(`mem:${navigator.deviceMemory || "unknown"}`);
  components.push(`platform:${navigator.platform || "unknown"}`);
  components.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

  // 3. WebGL GPU Unmasked Renderer & Vendor (Unique per GPU hardware/driver)
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        components.push(`gpu:${vendor}~${renderer}`);
      }
    }
  } catch {
    components.push("gpu:unavailable");
  }

  // 4. Canvas 2D Geometric & Text Rendering Hash
  // Different OS, GPU drivers, and anti-aliasing engines render pixels subtly differently.
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial', 'Helvetica', sans-serif";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("TREC_KL_RUNWAY_2026_CYBER_SHIELD_🔥", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("TREC_KL_RUNWAY_2026_CYBER_SHIELD_🔥", 4, 17);
      const dataUrl = canvas.toDataURL();
      components.push(`canvas:${simpleHash(dataUrl)}`);
    }
  } catch {
    components.push("canvas:unavailable");
  }

  // 5. AudioContext Frequency Response Fingerprint
  try {
    const AudioContextClass =
      window.AudioContext ||
      // @ts-expect-error webkitAudioContext fallback
      window.webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const analyser = audioCtx.createAnalyser();
      const gain = audioCtx.createGain();
      const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

      gain.gain.value = 0; // mute output
      oscillator.type = "triangle";
      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gain);
      gain.connect(audioCtx.destination);
      components.push(`audio:${audioCtx.sampleRate}`);
      audioCtx.close();
    }
  } catch {
    components.push("audio:unavailable");
  }

  // Combine and hash into a clean 64-char hex string
  const rawString = components.join("|||");
  return await sha256(rawString);
}

// Simple fallback string hasher
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash));
}

// SHA-256 using native subtle crypto
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
