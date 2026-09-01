/* eslint-disable */
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const EXE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(fs.existsSync);

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EXE, headless: "new",
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("http://localhost:3000/products/aurora-headphones", { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));

  // 1. On load: main image visible, no canvas, no 3D button in center but corner "View in 3D".
  const onLoad = await page.evaluate(() => {
    const canvases = document.querySelectorAll(".product-viewer canvas");
    const mainImg = document.querySelector(".product-viewer img:not([aria-pressed] *)");
    const view3d = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("View in 3D"));
    return {
      hasCanvas: canvases.length > 0,
      mainImg: !!mainImg,
      corner3DButton: !!view3d && view3d.className.includes("bottom-4 right-4"),
      thumbnails: document.querySelectorAll(".product-viewer + div button").length,
    };
  });
  console.log("ON LOAD:", JSON.stringify(onLoad));
  console.log((!onLoad.hasCanvas && onLoad.mainImg && onLoad.corner3DButton && onLoad.thumbnails === 3 ? "PASS" : "FAIL") + " gallery-loads-image-with-corner-3D-button");

  // 2. First thumbnail main image as primary; capture src.
  const srcs = await page.evaluate(() => [...document.querySelectorAll(".product-viewer + div button img")].map((i) => i.src));
  const mainBefore = await page.evaluate(() => document.querySelector(".product-viewer img")?.src);

  // 3. Click thumbnail 2 -> main image changes, no canvas, active ring moves.
  await page.evaluate(() => document.querySelectorAll(".product-viewer + div button")[1].click());
  const afterThumb = await page.evaluate(() => ({
    mainSrc: document.querySelector(".product-viewer img")?.src,
    hasCanvas: document.querySelectorAll(".product-viewer canvas").length > 0,
  }));
  console.log("THUMB:", JSON.stringify(afterThumb));
  console.log((afterThumb.mainSrc !== mainBefore && afterThumb.mainSrc === srcs[1] && !afterThumb.hasCanvas ? "PASS" : "FAIL") + " thumbnail-swaps-main-image");

  // 4. Click "View in 3D" -> canvas mounts, GLB loads, back button appears.
  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("View in 3D")).click());
  await page.waitForFunction(() => {
    const node = [...document.querySelectorAll(".product-viewer *")].find((n) => n.textContent.includes("Loading 3D") && n.children.length === 0);
    return node && node.closest("div").className.includes("opacity-0");
  }, { timeout: 15000 });
  const in3D = await page.evaluate(() => ({
    hasCanvas: document.querySelectorAll(".product-viewer canvas").length > 0,
    hasBack: [...document.querySelectorAll("button")].some((b) => b.textContent.includes("Back to photos")),
    glbFetched: performance.getEntriesByType("resource").some((r) => r.name.includes(".glb")),
  }));
  console.log("3D:", JSON.stringify(in3D));
  console.log((in3D.hasCanvas && in3D.hasBack && in3D.glbFetched ? "PASS" : "FAIL") + " 3D-activates-on-corner-button");

  // 5. Click "Back to photos" -> canvas unmounts, main image shows again.
  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Back to photos")).click());
  await new Promise((r) => setTimeout(r, 500));
  const back = await page.evaluate(() => ({
    hasCanvas: document.querySelectorAll(".product-viewer canvas").length > 0,
    mainImg: !!document.querySelector(".product-viewer img"),
  }));
  console.log("BACK:", JSON.stringify(back));
  console.log((!back.hasCanvas && back.mainImg ? "PASS" : "FAIL") + " back-button-exits-3D");

  console.log("CONSOLE ERRORS:", errors.length ? errors.join(" | ") : "none");
  await browser.close();
}
main().catch((e) => { console.error("SCRIPT FAIL:", e.message); process.exit(1); });