/* eslint-disable */
// Generates placeholder GLB product models procedurally using Three.js
global.FileReader = class {
  readAsDataURL(blob) {
    this.result = blob;
    if (this.onloadend) this.onloadend();
  }
  readAsArrayBuffer(blob) {
    if (blob instanceof ArrayBuffer) {
      this.result = blob;
      if (this.onloadend) this.onloadend();
      return;
    }
    if (blob && typeof blob.arrayBuffer === "function") {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
      return;
    }
    this.result = blob;
    if (this.onloadend) this.onloadend();
  }
};
const THREE = require("three");
const { GLTFExporter } = require("three/examples/jsm/exporters/GLTFExporter.js");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public", "models");
fs.mkdirSync(outDir, { recursive: true });

function mesh(geometry, color, metalness, roughness, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  const m = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness,
    })
  );
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.scale.set(sx, sy, sz);
  return m;
}

function buildHeadphones() {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, 0.09, 16, 48, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.6, roughness: 0.35 })
  );
  frame.rotation.z = Math.PI / 2;
  frame.position.y = 0.25;
  group.add(frame);

  const cupGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 32);
  const leftCup = mesh(cupGeo, 0x2b2b2b, 0.4, 0.5, -1.05, -0.45, 0);
  leftCup.rotation.x = Math.PI / 2;
  const rightCup = mesh(cupGeo, 0x2b2b2b, 0.4, 0.5, 1.05, -0.45, 0);
  rightCup.rotation.x = Math.PI / 2;

  const padGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32);
  const leftPad = mesh(padGeo, 0x111111, 0.1, 0.9, -1.05, -0.45, 0.09);
  leftPad.rotation.x = Math.PI / 2;
  const rightPad = mesh(padGeo, 0x111111, 0.1, 0.9, 1.05, -0.45, -0.09);
  rightPad.rotation.x = Math.PI / 2;

  const accent = mesh(new THREE.TorusKnotGeometry(0.25, 0.07, 64, 8, 2, 3), 0xc0a060, 0.9, 0.2, 0, 0.25, 0, 0, 0, 0, 0.9, 0.5, 0.9);
  group.add(leftCup, rightCup, leftPad, rightPad, accent);
  return group;
}

function buildSmartwatch() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.65, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x1b1b1b, metalness: 0.7, roughness: 0.3 })
  );
  body.position.y = 0.25;
  group.add(body);

  const screen = new THREE.Mesh(
    new THREE.BoxGeometry(0.47, 0.57, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x0a0f1e, metalness: 0.2, roughness: 0.1, emissive: 0x0a1a3a, emissiveIntensity: 0.4 })
  );
  screen.position.y = 0.25;
  screen.position.z = 0.065;
  group.add(screen);

  const strapGeo = new THREE.BoxGeometry(0.06, 0.42, 0.12);
  const topStrap = mesh(strapGeo, 0x303030, 0.1, 0.8, 0, 0.55, 0);
  const botStrap = mesh(strapGeo, 0x303030, 0.1, 0.8, 0, -0.16, 0);
  group.add(topStrap, botStrap);
  return group;
}

function buildSpeaker() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.82, 1.2, 48),
    new THREE.MeshStandardMaterial({ color: 0x242424, metalness: 0.3, roughness: 0.55 })
  );
  body.position.y = 0.6;
  group.add(body);

  const grille = mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.75, 32), 0x0d0d0d, 0.1, 0.9, 0, 0.72, 0);
  group.add(grille);

  const ring = mesh(new THREE.TorusGeometry(0.5, 0.03, 12, 48), 0xc0a060, 0.9, 0.2, 0, 0.6, Math.PI / 2);
  group.add(ring);
  return group;
}

function buildLamp() {
  const group = new THREE.Group();
  const base = mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.12, 48), 0x1e1e1e, 0.5, 0.4, 0, 0.06, 0);
  group.add(base);

  const pole = mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16), 0x333333, 0.6, 0.35, 0, 0.9, 0);
  group.add(pole);

  const head = mesh(new THREE.SphereGeometry(0.28, 32, 24), 0xa5b4c8, 0.3, 0.2, 0.28, 1.62, 0);
  const bulb = mesh(new THREE.SphereGeometry(0.12, 24, 18), 0xfff2cc, 0.0, 0.3, 0.28, 1.62, 0);
  bulb.material.emissive = new THREE.Color(0xffd98a);
  bulb.material.emissiveIntensity = 1.2;
  group.add(head, bulb);
  return group;
}

function exportGLB(name, object) {
  const exporter = new GLTFExporter();
  exporter.parse(
    object,
    (result) => {
      const buffer = Buffer.from(result);
      fs.writeFileSync(path.join(outDir, name), buffer);
      console.log("Wrote", name, buffer.length, "bytes");
    },
    (err) => console.error("Error exporting", name, err),
    { binary: true }
  );
}

exportGLB("headphones.glb", buildHeadphones());
exportGLB("smartwatch.glb", buildSmartwatch());
exportGLB("speaker.glb", buildSpeaker());
exportGLB("lamp.glb", buildLamp());
