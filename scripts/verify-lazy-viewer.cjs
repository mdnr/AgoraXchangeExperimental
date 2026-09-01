/* eslint-disable */
// Verifies the lazy 3D viewer: no canvas/mesh on load, activates only on click.
const puppeteer = require("puppeteer-core");
const fs = require("fs");

const EXE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(fs.existsSync);

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EXE,
    headless: "new",
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto("http://localhost:3000/products/aurora-headphones", { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));

  // 1. On load there should be NO canvas and a "View in 3D" button.
  try {
    await page.waitForFunction(
      () => [...document.querySelectorAll("button")].some((b) => b.textContent.includes("View in 3D")),
      { timeout: 10000 }
    );
  } catch (e) {
    const dbg = await page.evaluate(() => ({
      buttons: [...document.querySelectorAll("button")].map((b) => b.textContent),
      viewer: document.querySelector(".product-viewer")?.outerHTML.slice(0, 300) ?? "no viewer",
    }));
    console.log("DEBUG:", JSON.stringify(dbg));
    throw e;
  }
  const before = await page.evaluate(() => ({
    hasCanvas: !!document.querySelector(".product-viewer canvas"),
    button: [...document.querySelectorAll("button")].some((b) => b.textContent.includes("View in 3D")),
    glbFetched: performance.getEntriesByType("resource").some((r) => r.name.includes(".glb")),
  }));
  console.log("ON LOAD:", JSON.stringify(before));
  console.log((before.hasCanvas === false && before.button === true && before.glbFetched === false ? "PASS" : "FAIL") + " lazy-viewer-not-mounted-on-load");

  // 2. Click the button → canvas + GLB appear.
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("View in 3D"));
    if (!btn) return false;
    btn.click();
    return true;
  });
  console.log("CLICKED:", clicked);
  await page.waitForFunction(() => !!document.querySelector(".product-viewer canvas"), { timeout: 10000 });
  await page.waitForFunction(() => {
    const node = [...document.querySelectorAll(".product-viewer *")].find((n) => n.textContent.includes("Loading 3D") && n.children.length === 0);
    return node && node.closest("div").className.includes("opacity-0");
  }, { timeout: 15000 });
  const after = await page.evaluate(() => ({
    hasCanvas: !!document.querySelector(".product-viewer canvas"),
    glbFetched: performance.getEntriesByType("resource").some((r) => r.name.includes(".glb")),
  }));
  console.log("AFTER CLICK:", JSON.stringify(after));
  console.log((after.hasCanvas === true && after.glbFetched === true ? "PASS" : "FAIL") + " viewer-activates-on-click");

  console.log("CONSOLE ERRORS:", errors.length ? errors.join(" | ") : "none");
  await browser.close();
}

main().catch((e) => {
  console.error("SCRIPT FAIL:", e.message);
  process.exit(1);
});