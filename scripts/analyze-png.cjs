/* eslint-disable */
const fs = require("fs");
const zlib = require("zlib");

function decodePNG(path) {
  const buf = fs.readFileSync(path);
  const idat = [];
  let pos = 8, width = 0, height = 0, colorType = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
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
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          row[x] = (row[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 0xff;
          break;
        }
      }
    }
    prev.set(row);
    rows.push(row);
  }
  return { width, height, channels, rows };
}

const img = decodePNG(process.argv[2]);
console.log(`size ${img.width}x${img.height} ch=${img.channels}`);
const dark = new Map(); // key = rgb, for dark pixels (< 120 avg luminance)
const light = new Map();
const all = new Map();
let darkCount = 0, total = 0;
const step = Math.max(1, Math.floor((img.width * img.height) / 40000));
for (let y = 0; y < img.height; y += step) {
  for (let x = 0; x < img.width; x += step) {
    const i = x * img.channels;
    const r = img.rows[y][i], g = img.rows[y][i + 1], b = img.rows[y][i + 2];
    const lum = (r + g + b) / 3;
    const key = `${r},${g},${b}`;
    all.set(key, (all.get(key) || 0) + 1);
    const tgt = lum < 140 ? dark : light;
    tgt.set(key, (tgt.get(key) || 0) + 1);
    if (lum < 140) darkCount++;
    total++;
  }
}
console.log(`total samples ${total}, dark%=${((darkCount / total) * 100).toFixed(1)} (${darkCount} dark of ${total})`);
console.log("top 8 colors:", [...all].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => `rgb(${c})x${n}`).join("  "));
if (dark.size) console.log("top 8 DARK colors:", [...dark].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, n]) => `rgb(${c})x${n}`).join("  "));