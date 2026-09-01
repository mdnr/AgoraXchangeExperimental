/* eslint-disable */
const puppeteer = require("puppeteer-core");
const fs = require("fs");
const zlib = require("zlib");
const EXE = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].find(fs.existsSync);

function decodePNG(path) {
  const buf = fs.readFileSync(path);
  const idat = [];
  let pos = 8, width = 0, height = 0, colorType = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") { width = data.readUInt32BE(0); height = data.readUInt32BE(4); colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
  const stride = width * channels;
  const prev = new Uint8Array(stride);
  const rows = [];
  let offset = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[offset++];
    const row = Buffer.from(raw.subarray(offset, offset + stride));
    offset += stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? row[x - channels] : 0;
      const b = prev[x];
      const c = x >= channels ? prev[x - channels] : 0;
      switch (filter) {
        case 1: row[x] = (row[x] + a) & 0xff; break;
        case 2: row[x] = (row[x] + b) & 0xff; break;
        case 3: row[x] = (row[x] + ((a + b) >> 1)) & 0xff; break;
        case 4: { const p = a + b - c; const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); row[x] = (row[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff; break; }
      }
    }
    prev.set(row);
    rows.push(row);
  }
  return { width, height, channels, rows };
}

// Returns bbox % of pixels that differ notably from the light-grey gradient bg.
function measure(path) {
  const img = decodePNG(path);
  const W = img.width, H = img.height;
  let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1, count = 0;
  const step = 2;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      const i = x * img.channels;
      const r = img.rows[y][i], g = img.rows[y][i + 1], b = img.rows[y][i + 2];
      const lum = (r + g + b) / 3;
      if (lum < 190) { // darker than bg gradient (~245)
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        count++;
      }
    }
  }
  if (!count) return { empty: true };
  const cx = ((minX + maxX) / 2 / W) * 100;
  const cy = ((minY + maxY) / 2 / H) * 100;
  return { empty: false, centerXpct: cx.toFixed(1), centerYpct: cy.toFixed(1), fillPct: ((count * step * step) / (W * H) * 100).toFixed(1) };
}

async function main() {
  const browser = await puppeteer.launch({ executablePath: EXE, headless: "new", args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--no-sandbox"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  let allPass = true;
  for (const slug of ["aurora-headphones", "pulse-smartwatch", "echo-speaker", "lumen-table-lamp"]) {
    await page.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "domcontentloaded", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1200));
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll("button")].find((b) => b.textContent.trim().includes("View in 3D"));
      if (!btn) return false;
      btn.click();
      return true;
    });
    await page.waitForFunction(() => {
      const node = [...document.querySelectorAll(".product-viewer *")].find((n) => n.textContent.includes("Loading 3D") && n.children.length === 0);
      return node && node.closest("div").className.includes("opacity-0");
    }, { timeout: 15000 });
    const path = "C:\\Users\\aiman\\AppData\\Local\\Temp\\opencode\\center-" + slug + ".png";
    const el = await page.$(".product-viewer canvas");
    if (!el) { console.log(slug, "no canvas"); continue; }
    await el.screenshot({ path });
    const m = measure(path);
    const centered = m && !m.empty && Math.abs(m.centerXpct - 50) < 6 && Math.abs(m.centerYpct - 50) < 8;
    if (!centered) allPass = false;
    console.log(slug, JSON.stringify(m), centered ? "PASS" : "WARN/FAIL");
  }
  console.log("CONSOLE ERRORS:", errors.length ? errors.join(" | ") : "none");
  console.log(allPass ? "ALL CENTERED" : "SOME OFF-CENTER");
  await browser.close();
}
main().catch((e) => { console.error("SCRIPT FAIL:", e.message); process.exit(1); });