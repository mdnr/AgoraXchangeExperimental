/* eslint-disable */
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const EXE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(fs.existsSync);

async function main() {
  const browser = await puppeteer.launch({
    executablePath: EXE, headless: "new",
    args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"],
  });
  // Mobile viewport
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.goto("http://localhost:3000/products/aurora-headphones", { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));

  // 1. No horizontal overflow on mobile.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  console.log("MOBILE OVERFLOW:", overflow, overflow ? "FAIL" : "PASS");

  // 2. Upload tile present; upload a GLB from public/models.
  const hasUpload = await page.evaluate(() => [...document.querySelectorAll("button")].some((b) => b.textContent.includes("Upload")));
  console.log("UPLOAD TILE EXISTS:", hasUpload, hasUpload ? "PASS" : "FAIL");

  const input = await page.$('input[type="file"]');
  await input.uploadFile(path.resolve("public/models/headphones.glb"));
  await new Promise((r) => setTimeout(r, 800));

  // 3. Upload should activate 3D with the custom model.
  const uploaded = await page.evaluate(() => ({
    hasCanvas: document.querySelectorAll(".product-viewer canvas").length > 0,
    chip: [...document.querySelectorAll(".product-viewer *")].some((n) => n.textContent.includes("Your model")),
  }));
  console.log("UPLOAD ACTIVATED:", JSON.stringify(uploaded), (!uploaded.hasCanvas || !uploaded.chip) ? "FAIL" : "PASS");

  // 4. Back to photos exits.
  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Back to photos")).click());
  await new Promise((r) => setTimeout(r, 400));
  const backedOut = await page.evaluate(() => ({
    hasCanvas: document.querySelectorAll(".product-viewer canvas").length > 0,
    mainImg: !!document.querySelector(".product-viewer img"),
  }));
  console.log("BACK:", JSON.stringify(backedOut), (backedOut.hasCanvas || !backedOut.mainImg) ? "FAIL" : "PASS");

  // 5. Re-enter 3D using uploaded model persists (chip present), then clear it.
  await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("View in 3D")).click());
  await new Promise((r) => setTimeout(r, 500));
  const chipAgain = await page.evaluate(() => [...document.querySelectorAll(".product-viewer *")].some((n) => n.textContent.includes("Your model")));
  console.log("CHEM PERSIST AFTER RE-ENTER:", chipAgain, chipAgain ? "PASS" : "FAIL");

  // Clear uploaded model -> chip gone, product model still renders.
  const cleared = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === "Clear uploaded model");
    if (!btn) return false;
    btn.click();
    return true;
  });
  console.log("CLEAR BUTTON CLICKED:", cleared, cleared ? "PASS" : "FAIL");
  await new Promise((r) => setTimeout(r, 600));

  const afterClear = await page.evaluate(() => ({
    hasChip: [...document.querySelectorAll(".product-viewer *")].some((n) => n.textContent.includes("Your model")),
    mainImg: !!document.querySelector(".product-viewer img"),
  }));
  console.log("AFTER CLEAR:", JSON.stringify(afterClear), (afterClear.hasChip || !afterClear.mainImg) ? "FAIL" : "PASS");

  // 6. Rejected upload type shows error.
  await input.uploadFile("C:\\Users\\aiman\\AppData\\Local\\Temp\\opencode\\invalid.txt");
  await new Promise((r) => setTimeout(r, 400));
  const err = await page.evaluate(() => [...document.querySelectorAll("p")].some((n) => n.textContent.includes("Unsupported file type")));
  console.log("INVALID FILE ERROR:", err, err ? "PASS" : "FAIL");

  console.log("CONSOLE ERRORS:", errors.length ? errors.join(" | ") : "none");
  await browser.close();
}
main().catch((e) => { console.error("SCRIPT FAIL:", e.message); process.exit(1); });