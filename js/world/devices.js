import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { Batcher } from "./util.js";
import { P } from "../palette.js";

const PHONE = {
  w: 0.0715,
  h: 0.148,
  d: 0.0082,
};

const LAPTOP = {
  w: 0.325,
  d: 0.228,
  baseH: 0.0125,
  screenH: 0.212,
  tilt: -1.02,
};

function rounded(w, h, d, r) {
  return new RoundedBoxGeometry(w, h, d, 2, Math.min(r, Math.min(w, h, d) * 0.48));
}

function tintAttribute(geometry, hexColor) {
  const color = new THREE.Color(hexColor);
  const colors = new Float32Array(geometry.attributes.position.count * 3);
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

export function buildPhone(materials, opts = {}) {
  const { x = 0.66, y = 0, z = 0.06, rotY = -0.42, tilt = -0.34, scale = 1 } = opts;

  const g = new THREE.Group();
  const w = PHONE.w * scale;
  const h = PHONE.h * scale;
  const d = PHONE.d * scale;

  const body = new THREE.Mesh(rounded(w, h, d, 0.009 * scale), materials.plastic);
  tintAttribute(body.geometry, P.device.shellDark);
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  const frame = new THREE.Mesh(rounded(w * 0.98, h * 0.985, d * 0.55, 0.0085 * scale), materials.metal);
  tintAttribute(frame.geometry, P.metal.alu);
  frame.position.z = d * 0.16;
  frame.castShadow = true;
  g.add(frame);

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.92), materials.screenGlass);
  glass.position.z = d * 0.52;
  g.add(glass);

  const anchor = new THREE.Object3D();
  anchor.position.z = d * 0.56;
  g.add(anchor);

  const bez = new Batcher();
  bez.quad(0, 0, 0, 0, 0, 1, 1, 0, 0, w * 0.055, h * 0.018, P.device.screenOff);
  bez.quad(-w * 0.38, h * 0.44, 0, 0, 0, 1, 1, 0, 0, w * 0.1, h * 0.012, P.device.screenOff);
  const bezels = bez.mesh(materials.plastic);
  bezels.position.z = d * 0.53;
  g.add(bezels);

  g.position.set(x, y + h / 2 * Math.cos(tilt), z);
  g.rotation.set(tilt, rotY, 0);
  g.scale.setScalar(1);

  return { group: g, anchor, glass, size: [w * 0.9, h * 0.92] };
}

export function buildLaptop(materials, opts = {}) {
  const { x = -0.66, y = 0, z = 0.02, rotY = 0.34 } = opts;

  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  const base = new Batcher();
  base.box(0, LAPTOP.baseH / 2, 0, LAPTOP.w, LAPTOP.baseH, LAPTOP.d, P.device.shellGray);
  base.box(0, LAPTOP.baseH * 0.55, LAPTOP.d / 2 - 0.004, LAPTOP.w * 0.72, 0.003, 0.008, P.device.keyDark);
  base.box(0, 0.0035, -LAPTOP.d / 2 + 0.008, LAPTOP.w * 0.6, 0.003, 0.014, P.device.shellDark);
  const baseMesh = base.mesh(materials.metal);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  g.add(baseMesh);

  const kb = new Batcher();
  const rows = [12, 12, 11, 10];
  const kw = LAPTOP.w * 0.86 / 12;
  const kh = 0.0165;
  for (let r = 0; r < rows.length; r++) {
    for (let i = 0; i < rows[r]; i++) {
      kb.box(
        -LAPTOP.w * 0.43 + kw / 2 + i * kw,
        LAPTOP.baseH + 0.0022,
        -LAPTOP.d / 2 + 0.024 + kh / 2 + r * kh,
        kw - 0.0022,
        0.0026,
        kh - 0.0022,
        P.neutral.keycap
      );
    }
  }
  kb.box(0, LAPTOP.baseH + 0.0022, LAPTOP.d / 2 - 0.018, 0.052, 0.0026, 0.024, P.neutral.keycap);
  const kbMesh = kb.mesh(materials.plastic);
  kbMesh.castShadow = true;
  g.add(kbMesh);

  const pad = new THREE.Mesh(rounded(0.1, 0.062, 0.0018, 0.004), materials.plastic);
  tintAttribute(pad.geometry, P.device.trackpad);
  pad.position.set(0, LAPTOP.baseH + 0.0016, LAPTOP.d * 0.2);
  pad.receiveShadow = true;
  g.add(pad);

  const lid = new THREE.Group();
  lid.position.set(0, LAPTOP.baseH, -LAPTOP.d / 2 + 0.006);
  lid.rotation.x = LAPTOP.tilt;
  g.add(lid);

  const lidMesh = new THREE.Mesh(rounded(LAPTOP.w, LAPTOP.screenH, 0.0065, 0.005), materials.metal);
  tintAttribute(lidMesh.geometry, P.device.shellGray);
  lidMesh.position.set(0, LAPTOP.screenH / 2, -0.003);
  lidMesh.castShadow = true;
  lid.add(lidMesh);

  const inner = new THREE.Mesh(new THREE.PlaneGeometry(LAPTOP.w - 0.012, LAPTOP.screenH - 0.014), materials.screenGlass);
  inner.position.set(0, LAPTOP.screenH / 2, 0.0012);
  lid.add(inner);

  const anchor = new THREE.Object3D();
  anchor.position.set(0, LAPTOP.screenH / 2, 0.0022);
  lid.add(anchor);

  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.008, 16), materials.metal);
  tintAttribute(logo.geometry, P.metal.brass);
  logo.position.set(0, LAPTOP.screenH * 0.5, -0.0068);
  logo.rotation.y = Math.PI;
  lid.add(logo);

  return {
    group: g,
    lid,
    anchor,
    glass: inner,
    size: [LAPTOP.w - 0.014, LAPTOP.screenH - 0.016],
  };
}

export function buildSecondMonitor(materials, opts = {}) {
  const { x = 0.66, y = 0, z = -0.24, rotY = -0.5 } = opts;
  const W = 0.34;
  const H = 0.24;

  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = rotY;

  const arm = new Batcher();
  arm.box(0, 0.007, 0, 0.12, 0.014, 0.1, P.metal.aluDark);
  arm.box(0, 0.09, -0.02, 0.026, 0.16, 0.022, P.metal.aluDark);
  arm.box(0, H + 0.02, -0.02, 0.05, 0.03, 0.03, P.metal.aluDark);
  const armMesh = arm.mesh(materials.metal);
  armMesh.castShadow = true;
  g.add(armMesh);

  const panel = new THREE.Group();
  panel.position.set(0, 0.17 + H / 2, -0.012);
  panel.rotation.y = -0.12;
  g.add(panel);

  const shell = new Batcher();
  shell.box(0, 0, -0.002, W, H, 0.018, P.device.shellDark);
  shell.box(0, 0, 0.007, W - 0.008, H - 0.008, 0.004, P.device.screenOff);
  const shellMesh = shell.mesh(materials.plastic);
  shellMesh.castShadow = true;
  panel.add(shellMesh);

  const anchor = new THREE.Object3D();
  anchor.position.z = 0.0095;
  panel.add(anchor);

  return { group: g, panel, anchor, size: [W - 0.012, H - 0.012] };
}

export { PHONE, LAPTOP };
