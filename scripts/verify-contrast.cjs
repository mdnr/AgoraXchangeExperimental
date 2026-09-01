/* eslint-disable */
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const EXE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(fs.existsSync);

async function main() {
  const browser = await puppeteer.launch({ executablePath: EXE, headless: "new", args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox", "--force-dark-mode"],
    // force dark so we verify the fix holds even under dark scheme
  });
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1200));

  const pick = await page.evaluate(() => {
    const css = getComputedStyle(document.body);
    const h2s = [...document.querySelectorAll("h1, h2")].map((h) => ({
      text: h.textContent.trim().slice(0, 30),
      color: getComputedStyle(h).color,
      bg: getComputedStyle(h.closest("section") || document.body).backgroundColor,
    }));
    return { bodyColor: css.color, bodyBg: css.backgroundColor, h2s };
  });
  console.log("BODY:", pick.bodyColor, "on", pick.bodyBg);
  for (const h of pick.h2s) console.log(JSON.stringify(h));

  await page.goto("http://localhost:3000/products/aurora-headphones", { waitUntil: "domcontentloaded", timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1000));
  const prod = await page.evaluate(() =>
    ["Why you", "You may", "Specifications", "Aerospace"].map((t) => {
      const el = [...document.querySelectorAll("h1,h2,h3")].find((h) => h.textContent.includes(t));
      if (!el) return { t, missing: true };
      return { t, color: getComputedStyle(el).color };
    })
  );
  for (const p of prod) console.log(JSON.stringify(p));
  await browser.close();
}
main().catch((e) => { console.error("SCRIPT FAIL:", e.message); process.exit(1); });