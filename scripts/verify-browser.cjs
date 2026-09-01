/* eslint-disable */
const puppeteer = require("puppeteer-core");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  const exe = require("fs").existsSync(EDGE) ? EDGE : CHROME;
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: "new",
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"],
  });

  const page = await browser.newPage();
  const errors = [];
  const failedRequests = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.type() === "warning") errors.push("WARN: " + msg.text());
  });
  page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message));
  page.on("requestfailed", (req) =>
    failedRequests.push(req.url() + " :: " + (req.failure()?.errorText ?? "unknown"))
  );

  const tests = [
    ["/", "canvas-lite-listener-nope", () => document.querySelectorAll("a[href]").length > 5],
    ["/products/aurora-headphones", "3d-canvas-mounts", () => !!document.querySelector("canvas")],
    // Wait for model load; product-viewer stops showing loading overlay
    ["/products/aurora-headphones", "3d-viewer-active", () => {
      const node = [...document.querySelectorAll(".product-viewer *")].find(
        (n) => n.textContent.includes("Loading 3D") && n.children.length === 0
      );
      if (!node) return false;
      const overlay = node.closest("div");
      return overlay && overlay.className.includes("opacity-0");
    }, 15000],
    ["/products/pulse-smartwatch", "3d-viewer-active-2", () => {
      const node = [...document.querySelectorAll(".product-viewer *")].find(
        (n) => n.textContent.includes("Loading 3D") && n.children.length === 0
      );
      if (!node) return false;
      const overlay = node.closest("div");
      return overlay && overlay.className.includes("opacity-0");
    }, 15000],
  ];

  for (const [url, label, fn, timeout = 10000] of tests) {
    try {
      await page.goto("http://localhost:3000" + url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForFunction(fn, { timeout });
      console.log("PASS", label, url);
    } catch (e) {
      console.log("FAIL", label, url, "-", e.message.split("\n")[0]);
    }
  }

  // Capture the 3D viewer for visual proof
  await page.goto("http://localhost:3000/products/echo-speaker", { waitUntil: "domcontentloaded", timeout: 20000 });
  try {
    await page.waitForFunction(() => {
      const node = [...document.querySelectorAll(".product-viewer *")].find(
        (n) => n.textContent.includes("Loading 3D") && n.children.length === 0
      );
      if (!node) return false;
      return node.closest("div").className.includes("opacity-0");
    }, { timeout: 15000 });
  } catch {}
  const el = await page.$(".product-viewer");
  if (el) {
    await el.screenshot({ path: "C:\\Users\\aiman\\AppData\\Local\\Temp\\opencode\\viewer-shot.png" });
    console.log("SCREENSHOT saved");
  }
  const canvasEl = await page.$(".product-viewer canvas");
  if (canvasEl) {
    await canvasEl.screenshot({ path: "C:\\Users\\aiman\\AppData\\Local\\Temp\\opencode\\canvas-shot.png" });
    console.log("CANVAS SCREENSHOT saved");
  }

  // Second canvas screenshot on the headphones page for cross-checking.
  await page.goto("http://localhost:3000/products/aurora-headphones", { waitUntil: "domcontentloaded", timeout: 20000 });
  try {
    await page.waitForFunction(() => {
      const node = [...document.querySelectorAll(".product-viewer *")].find(
        (n) => n.textContent.includes("Loading 3D") && n.children.length === 0
      );
      if (!node) return false;
      return node.closest("div").className.includes("opacity-0");
    }, { timeout: 15000 });
  } catch {}
  const secondCanvas = await page.$(".product-viewer canvas");
  if (secondCanvas) {
    await secondCanvas.screenshot({ path: "C:\\Users\\aiman\\AppData\\Local\\Temp\\opencode\\canvas-headphones.png" });
    console.log("CANVAS HEADPHONES SCREENSHOT saved");
  }

  // ─── Error state check: abort the GLB request, expect the error UI ───
  const errPage = await browser.newPage();
  const blocked = [];
  await errPage.setRequestInterception(true);
  errPage.on("request", (req) => {
    if (req.url().includes(".glb")) {
      blocked.push(req.url());
      req.abort("failed");
    } else {
      req.continue();
    }
  });
  await errPage.goto("http://localhost:3000/products/lumen-table-lamp", { waitUntil: "domcontentloaded", timeout: 20000 });
  try {
    await errPage.waitForFunction(() => {
      const txt = document.querySelector(".product-viewer");
      return txt ? txt.textContent.includes("Couldn") && txt.textContent.includes("Try again") : false;
    }, { timeout: 15000 });
    console.log("PASS error-state-shows-ui (blocked:", blocked.join(","), ")");
  } catch (e) {
    console.log("FAIL error-state-shows-ui -", e.message.split("\n")[0]);
  }
  await errPage.close();

  console.log("CONSOLE ERRORS:", errors.length ? errors.join(" | ") : "none");
  console.log("FAILED REQUESTS:", failedRequests.length ? failedRequests.join(" | ") : "none");

  const data = await page.evaluate(async () => {
    const canvas = document.querySelector("canvas");
    const gl = canvas && (canvas.getContext("webgl2") || canvas.getContext("webgl"));

    // Sample a grid across the FULL canvas inside rAF (right after the draw
    // within the same frame) to catch any rendered pixels.
    let bestDistinct = -1;
    let bestOpaque = -1;
    if (gl) {
      for (let frame = 0; frame < 60; frame++) {
        await new Promise((resolve) =>
          requestAnimationFrame(() => {
            try {
              const gw = Math.min(canvas.width, 256);
              const gh = Math.min(canvas.height, 256);
              const px = new Uint8Array(64 * 64 * 4);
              let opaque = 0;
              const colors = new Set();
              const STEP = Math.max(1, Math.floor(gw / 64));
              for (let y = 0; y < gh; y += STEP) {
                for (let x = 0; x < gw; x += STEP) {
                  const sub = new Uint8Array(1 * 1 * 4);
                  gl.readPixels(x, gh - 1 - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, sub);
                  colors.add(`${sub[0]},${sub[1]},${sub[2]}`);
                  if (sub[3] > 40) opaque++;
                }
              }
              if (colors.size > bestDistinct) bestDistinct = colors.size;
              if (opaque > bestOpaque) bestOpaque = opaque;
            } catch {}
            resolve();
          })
        );
      }
    }

    const dataUrl = canvas ? canvas.toDataURL("image/png") : "";
    const approxBytes = Math.floor((dataUrl.length * 3) / 4);

    return {
      hasWebGL: !!gl,
      canvasWidth: canvas ? canvas.width : 0,
      canvasHeight: canvas ? canvas.height : 0,
      glError: gl ? gl.getError() : -1,
      distinctPixelColors: bestDistinct,
      opaquePixelsOfGrid: bestOpaque,
      toDataUrlBytes: approxBytes,
    };
  });
  console.log("WEBGL:", JSON.stringify(data));
  const rendered = data.distinctPixelColors > 5 && data.opaquePixelsOfGrid > 20;
  console.log(
    "RENDER " + (rendered ? "PASS" : "WARN") +
      " (distinct=" + data.distinctPixelColors + ", opaqueSamples=" + data.opaquePixelsOfGrid + ")"
  );

  await browser.close();
}

main().catch((e) => {
  console.error("SCRIPT FAIL:", e.message);
  process.exit(1);
});