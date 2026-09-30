import * as THREE from "three";
import { Batcher, mulberry32, G } from "./util.js";
import { C as c, P } from "../palette.js";

function tintGeometry(geo, hexColor) {
  const col = new THREE.Color(hexColor);
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = col.r;
    arr[i * 3 + 1] = col.g;
    arr[i * 3 + 2] = col.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
  return geo;
}

export class DeveloperWorkspace {
  constructor(materials, opts = {}) {
    this.mats = materials;
    this.group = new THREE.Group();
    this.anchors = {};

    const solid = new Batcher();
    const metal = new Batcher();
    const wood = new Batcher();
    const rubber = new Batcher();
    const fabric = new Batcher();
    const ceramic = new Batcher();
    const paper = new Batcher();
    const skin = new Batcher();
    const glow = new Batcher();

    this.buildDesk(solid, metal, wood, rubber);
    this.buildMainMonitor(solid, metal, rubber, glow);
    this.buildKeyboard(solid, rubber, glow);
    this.buildMouse(solid, rubber);
    this.buildNotebookAndPen(paper, solid);
    this.buildMug(ceramic, solid);
    this.buildHeadphones(metal, rubber, fabric);
    this.buildPlant(ceramic, solid);
    this.buildDeskLamp(metal, solid, rubber);
    this.buildCables(rubber);
    this.buildDeveloper(metal, solid, fabric, skin);

    this.group.add(
      ...[
        solid.mesh(materials.plastic),
        metal.mesh(materials.metal),
        wood.mesh(materials.wood),
        rubber.mesh(materials.rubber),
        fabric.mesh(materials.fabric),
        ceramic.mesh(materials.ceramic),
        paper.mesh(materials.paper),
        skin.mesh(materials.skin),
        glow.mesh(materials.glow),
      ].filter(Boolean)
    );
    this.group.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });

    this.buildDeskMat();
    this.buildContactShadows();
    this.anchors.desk = new THREE.Vector3(0, 0.36, 0.1);
  }

  buildDesk(solid, metal, wood, rubber) {
    const W = 2.1;
    const D = 0.86;
    const TH = 0.036;
    const Y = 0.36;

    wood.box(0, Y, 0, W, TH, D, c.wood, 0, 0, 0);
    wood.box(0, Y - TH / 2 - 0.004, 0, W - 0.006, 0.006, D - 0.006, c.woodEdge);

    const legX = W / 2 - 0.09;
    const legZ = D / 2 - 0.09;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        metal.box(sx * legX, Y / 2 - 0.005, sz * legZ, 0.05, Y - TH, 0.05, c.steel);
      }
    }
    metal.box(0, 0.06, -legZ, W - 0.2, 0.03, 0.03, c.steel);
    metal.box(0, 0.06, legZ, W - 0.2, 0.03, 0.03, c.steel);
    metal.box(-legX, 0.06, 0, 0.03, 0.03, D - 0.2, c.steel);
    metal.box(legX, 0.06, 0, 0.03, 0.03, D - 0.2, c.steel);

    metal.box(-legX + 0.02, 0.24, -legZ + 0.02, 0.035, 0.2, D - 0.24, c.steelLight);
    for (let i = 0; i < 2; i++) {
      metal.box(-legX + 0.04, 0.2 + i * 0.09, -legZ + 0.02, 0.02, 0.008, 0.16, c.aluDark);
      metal.box(-legX + 0.055, 0.2 + i * 0.09, -legZ + 0.02, 0.012, 0.014, 0.03, c.alu);
    }

    metal.box(0.86, Y + 0.001, -0.3, 0.12, 0.012, 0.05, c.black);
    rubber.box(0.86, Y - 0.004, -0.3, 0.135, 0.014, 0.065, c.blackSoft);

    this.deskY = Y + TH / 2;
  }

  buildDeskMat() {
    const g = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.0024, 0.56), this.mats.deskMat);
    g.position.set(0, this.deskY + 0.0012, 0.02);
    g.receiveShadow = true;
    this.group.add(g);
    this.deskMat = g;
  }

  buildMainMonitor(solid, metal, rubber, glow) {
    const Y = this.deskY;
    const cx = 0.0;
    const cz = -0.34;
    const W = 1.3;
    const H = 0.75;
    const bezel = 0.014;
    const tilt = -0.055;

    metal.box(cx, Y + 0.01, cz + 0.05, 0.36, 0.02, 0.22, c.aluDark);
    metal.box(cx, Y + 0.014, cz + 0.05, 0.3, 0.024, 0.17, c.black);
    metal.box(cx, Y + 0.02, cz + 0.048, 0.34, 0.006, 0.06, c.alu);
    metal.box(cx, Y + 0.19, cz + 0.05, 0.055, 0.36, 0.028, c.alu);
    metal.box(cx, Y + 0.372, cz + 0.032, 0.13, 0.028, 0.055, c.aluDark, 0, -0.2);

    const panel = new THREE.Group();
    panel.position.set(cx, Y + 0.29 + H / 2, cz);
    panel.rotation.x = tilt;
    this.group.add(panel);
    this.monitor = panel;

    const shellB = new Batcher();
    shellB.box(0, 0, -0.004, W, H, 0.03, c.aluDark);
    shellB.box(0, 0, 0.008, W - 0.012, H - 0.012, 0.006, c.black);
    shellB.box(0, -H / 2 - 0.006, 0.006, 0.3, 0.012, 0.022, c.aluDark);
    const shell = shellB.mesh(this.mats.plastic);
    shell.castShadow = true;
    shell.receiveShadow = true;
    panel.add(shell);

    this.monitorScreenAnchor = new THREE.Object3D();
    this.monitorScreenAnchor.position.set(0, 0, 0.012);
    panel.add(this.monitorScreenAnchor);
    this.anchors.monitor = this.monitorScreenAnchor;
    this.monitorSize = [W - bezel * 2, H - bezel * 2];

    glow.quad(cx - W / 2 + 0.06, Y + 0.29 + H + 0.002, cz + 0.012, 0, 0, 1, 1, 0, 0, 0.02, 0.004, c.status);
    glow.quad(cx, Y + 0.29 + H - 0.002, cz + 0.012, 0, 0, 1, 1, 0, 0, W * 0.7, 0.001, P.neutral.black);
  }

  buildKeyboard(solid, rubber, glow) {
    const Y = this.deskY;
    const W = 0.46;
    const D = 0.145;
    const H = 0.018;
    const x = 0.0;
    const z = 0.2;

    solid.box(x, Y + H / 2, z, W, H, D, c.blackSoft);
    solid.box(x, Y + H + 0.002, z, W - 0.008, 0.004, D - 0.008, c.keycapAlt);

    const rows = [15, 15, 14, 13, 10];
    const kw = (W - 0.03) / 15;
    const kh = (D - 0.022) / 5;
    for (let r = 0; r < rows.length; r++) {
      const n = rows[r];
      const rowW = n * kw;
      const x0 = x - rowW / 2 + kw / 2;
      for (let i = 0; i < n; i++) {
        rubber.box(
          x0 + i * kw,
          Y + H + 0.007,
          z - D / 2 + 0.014 + kh / 2 + r * kh,
          kw - 0.0045,
          0.005,
          kh - 0.0045,
          r === 0 && i === 4 ? c.keycapAlt : c.keycap
        );
      }
    }

    rubber.box(x, Y + H + 0.006, z - D / 2 + 0.0045, W * 0.9, 0.004, 0.007, c.keycapAlt);
    rubber.box(x - W / 2 + 0.012, Y + H + 0.007, z + D / 2 - 0.014, 0.012, 0.005, 0.05, c.keycapAlt);

    glow.quad(x - W / 2 + 0.004, Y + H * 0.5, z + D / 2 - 0.03, 0, 0, 1, 0, 1, 0, 0.004, 0.03, c.status);
  }

  buildMouse(solid, rubber) {
    const Y = this.deskY;
    const x = 0.34;
    const z = 0.19;
    solid.ico(x, Y + 0.011, z, 0.028, c.blackSoft);
    rubber.box(x, Y + 0.026, z - 0.008, 0.016, 0.005, 0.018, c.keycapAlt);
    rubber.box(x, Y + 0.003, z + 0.012, 0.05, 0.002, 0.018, c.black);
    solid.cylinder(x, Y + 0.001, z - 0.03, 0.006, 0.002, c.black, 0, 0, 0, "cyl8");
  }

  buildNotebookAndPen(paper, solid) {
    const Y = this.deskY;
    const x = -0.42;
    const z = 0.19;
    const W = 0.3;
    const D = 0.22;

    paper.box(x, Y + 0.008, z, W, 0.014, D, c.paper);
    solid.box(x, Y + 0.0035, z, W + 0.008, 0.005, D + 0.008, P.secondary.forest);
    solid.box(x - W / 2 - 0.004, Y + 0.009, z, 0.008, 0.016, D + 0.006, P.metal.brass);

    this.notebookPlane = new THREE.Object3D();
    this.notebookPlane.position.set(x, Y + 0.0155, z);
    this.notebookPlane.rotation.x = -Math.PI / 2;
    this.notebookPlane.rotation.z = 0.03;
    this.group.add(this.notebookPlane);
    this.anchors.notebook = this.notebookPlane;

    solid.cylinder(x + 0.19, Y + 0.005, z + 0.06, 0.0055, 0.13, c.pen, 0, Math.PI / 2, 0.25, "cyl8");
    solid.cylinder(x + 0.19 + 0.05, Y + 0.005, z + 0.045, 0.0062, 0.02, P.metal.brass, 0, Math.PI / 2, 0.25, "cyl8");
  }

  buildMug(ceramic, solid) {
    const Y = this.deskY;
    const x = 0.88;
    const z = 0.2;
    ceramic.cylinder(x, Y + 0.045, z, 0.042, 0.09, c.mug, 0, 0, 0, "cyl");
    ceramic.cylinder(x, Y + 0.092, z, 0.037, 0.004, c.coffee, 0, 0, 0, "cyl");
    ceramic.cylinder(x, Y + 0.016, z, 0.043, 0.008, c.mug, 0, 0, 0, "cyl");

    const handle = new THREE.TorusGeometry(0.022, 0.0055, 6, 12, Math.PI * 1.3);
    ceramic.add(handle, mat4(x + 0.048, Y + 0.048, z, Math.PI / 2, 0, -0.35), c.mug);
    this.anchors.mug = new THREE.Vector3(x, Y + 0.1, z);
  }

  buildHeadphones(metal, rubber, fabric) {
    const Y = this.deskY;
    const x = -0.86;
    const z = 0.22;

    const band = new THREE.TorusGeometry(0.082, 0.008, 6, 18, Math.PI * 0.92);
    metal.add(band, mat4(x, Y + 0.01, z - 0.02, 0, Math.PI / 2, 0), c.aluDark);
    rubber.add(band, mat4(x, Y + 0.009, z - 0.02, 0, Math.PI / 2, 0), c.blackSoft);

    for (const sx of [-1, 1]) {
      const cx = x + sx * 0.082;
      rubber.cylinder(cx, Y + 0.019, z + 0.012, 0.037, 0.032, c.black, 0, 0, Math.PI / 2);
      fabric.cylinder(cx, Y + 0.019, z + 0.026, 0.034, 0.014, c.fabricDark, 0, 0, Math.PI / 2);
      metal.cylinder(cx, Y + 0.019, z - 0.006, 0.013, 0.018, c.alu, 0, 0, Math.PI / 2);
    }
    this.anchors.headphones = new THREE.Vector3(x, Y + 0.05, z);
  }

  buildPlant(ceramic, solid) {
    const Y = this.deskY;
    const x = 0.92;
    const z = -0.28;
    ceramic.cylinder(x, Y + 0.06, z, 0.062, 0.12, c.pot, 0, 0, 0, "cyl");
    ceramic.cylinder(x, Y + 0.122, z, 0.055, 0.006, P.organic.soil, 0, 0, 0, "cyl");
    solid.cylinder(x, Y + 0.12, z, 0.012, 0.05, c.leafDark, 0, 0, 0, "cyl8");

    const rng = mulberry32(97);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + rng() * 0.5;
      const len = 0.1 + rng() * 0.09;
      const tilt = 0.5 + rng() * 0.5;
      solid.ico(
        x + Math.cos(a) * len * 0.5 * Math.sin(tilt),
        Y + 0.16 + rng() * 0.06,
        z + Math.sin(a) * len * 0.5 * Math.sin(tilt),
        0.032 + rng() * 0.02,
        i % 3 === 0 ? c.leafDark : c.leaf
      );
    }
  }

  buildDeskLamp(metal, solid, rubber) {
    const Y = this.deskY;
    const x = -0.94;
    const z = -0.22;

    rubber.cylinder(x, Y + 0.008, z, 0.055, 0.016, c.black, 0, 0, 0, "cyl");
    metal.cylinder(x, Y + 0.014, z, 0.048, 0.008, c.aluDark, 0, 0, 0, "cyl");
    metal.cylinder(x, Y + 0.2, z, 0.008, 0.38, c.aluDark, 0, 0, 0, "cyl8");
    metal.cylinder(x + 0.1, Y + 0.362, z, 0.007, 0.21, c.aluDark, 0, 0, 1.05, "cyl8");
    metal.cylinder(x + 0.2, Y + 0.31, z, 0.006, 0.13, c.aluDark, 0, 0, 1.05, "cyl8");

    const shade = new THREE.Mesh(
      tintGeometry(new THREE.ConeGeometry(0.062, 0.08, 16, 1, true), c.lampShade),
      this.mats.metal
    );
    shade.position.set(x + 0.245, Y + 0.276, z);
    shade.rotation.set(0, 0, -0.55);
    shade.castShadow = true;
    this.group.add(shade);
    this.lampShade = shade;

    const rim = new THREE.Mesh(
      tintGeometry(new THREE.TorusGeometry(0.062, 0.004, 5, 16), P.metal.brass),
      this.mats.metal
    );
    rim.position.set(x + 0.27, Y + 0.245, z);
    rim.rotation.set(Math.PI / 2, 0, -0.55);
    this.group.add(rim);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 10, 8),
      new THREE.MeshBasicMaterial({ color: c.lampGlow, toneMapped: false })
    );
    bulb.position.set(x + 0.255, Y + 0.245, z);
    this.group.add(bulb);
    this.lampBulb = bulb;

    this.lampLight = new THREE.PointLight(P.light.lamp, 1.05, 2.8, 2);
    this.lampLight.position.set(x + 0.27, Y + 0.225, z);
    this.lampLight.castShadow = false;
    this.group.add(this.lampLight);

    this.anchors.lamp = new THREE.Vector3(x + 0.27, Y + 0.23, z);
  }

  buildCables(rubber) {
    const Y = this.deskY;
    const path = (ax, ay, az, bx, by, bz, sag, tubeR, segs) => {
      const pts = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        pts.push(
          new THREE.Vector3(
            ax + (bx - ax) * t,
            ay + (by - ay) * t - Math.sin(t * Math.PI) * sag,
            az + (bz - az) * t
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.25);
      rubber.add(
        new THREE.TubeGeometry(curve, Math.max(8, segs * 3), tubeR, 5, false),
        new THREE.Matrix4(),
        c.cable
      );
    };

    path(0.16, Y + 0.004, -0.33, 0.86, Y + 0.004, -0.3, 0.014, 0.005, 8);
    path(-0.72, Y + 0.004, -0.2, 0.86, Y + 0.004, -0.3, 0.03, 0.0045, 10);
    path(0.86, Y + 0.004, -0.3, 0.87, Y - 0.3, -0.42, 0.06, 0.0045, 10);
    path(0.34, Y + 0.004, 0.22, 0.34, Y + 0.002, 0.42, 0.01, 0.0035, 6);
  }

  buildDeveloper(metal, solid, fabric, skin) {
    const z = 0.46;
    const x = 0.0;

    fabric.box(x, 0.24, z + 0.2, 0.5, 0.58, 0.09, c.fabricDark, 0, -0.13, 0);
    fabric.box(x, 0.18, z + 0.16, 0.44, 0.12, 0.07, c.fabric, 0, 0, 0);
    metal.box(x, 0.02, z + 0.18, 0.06, 0.04, 0.06, c.steel);
    metal.cylinder(x, 0.11, z + 0.18, 0.022, 0.16, c.aluDark, 0, 0, 0, "cyl8");
    metal.box(x, 0.2, z + 0.18, 0.22, 0.04, 0.05, c.steel);

    solid.box(x, 0.5, z, 0.4, 0.34, 0.24, c.cloth, 0, -0.11, 0);
    solid.box(x, 0.645, z - 0.045, 0.38, 0.13, 0.19, c.cloth, 0, -0.11, 0);

    solid.cylinder(x, 0.745, z - 0.03, 0.046, 0.09, c.skin, 0, 0, 0, "cyl8");
    skin.cylinder(x, 0.678, z - 0.022, 0.041, 0.1, c.skin, 0, 0, 0, "cyl8");
    solid.ico(x, 0.795, z - 0.035, 0.056, c.hair);
    solid.box(x, 0.822, z + 0.03, 0.1, 0.02, 0.06, c.hair);
    solid.box(x, 0.835, z - 0.05, 0.11, 0.03, 0.08, c.hair);

    for (const sx of [-1, 1]) {
      const shoulder = new THREE.Vector3(x + sx * 0.195, 0.535, z + 0.01);
      const elbow = new THREE.Vector3(x + sx * 0.255, 0.452, z - 0.145);
      const wrist = new THREE.Vector3(x + sx * 0.128, 0.404, z - 0.235);
      limb(solid, shoulder, elbow, 0.044, c.cloth);
      limb(solid, elbow, wrist, 0.036, c.cloth);
      solid.ico(elbow.x, elbow.y, elbow.z, 0.046, c.cloth);
    }

    this.buildHands();
    this.anchors.developer = new THREE.Vector3(x, 0.78, z);
  }

  buildHands() {
    this.hands = [];

    const fingerB = new Batcher();
    fingerB.add(G.box, matScaled(0, 0, -0.014, 0.018, 0.02, 0.028), c.skin);
    fingerB.add(G.box, matScaled(0, -0.005, -0.041, 0.016, 0.017, 0.023, 0.55), c.skin);
    const fingerGeo = fingerB.geometry();

    for (const sx of [-1, 1]) {
      const group = new THREE.Group();

      const handB = new Batcher();
      handB.add(G.box, matScaled(0, 0, 0, 0.082, 0.026, 0.07), c.skin);
      handB.add(G.box, matScaled(-sx * 0.048, -0.002, -0.012, 0.022, 0.019, 0.038, 0, sx * 0.55), c.skin);
      group.add(new THREE.Mesh(handB.geometry(), this.mats.skin));

      const fingers = [];
      for (let f = 0; f < 4; f++) {
        const pivot = new THREE.Group();
        pivot.position.set(-0.03 + f * 0.02, -0.001, -0.042);
        pivot.add(new THREE.Mesh(fingerGeo, this.mats.skin));
        group.add(pivot);
        fingers.push(pivot);
      }

      group.position.set(sx * 0.118, this.deskY + 0.024, 0.212);
      group.rotation.set(-0.1, sx * 0.18, 0);
      this.group.add(group);
      this.hands.push({ group, fingers, side: sx, baseY: group.position.y });
    }
  }

  setTyping(amount, time) {
    if (!this.hands) return;
    const a = Math.max(0, Math.min(1, amount));
    for (const h of this.hands) {
      for (let f = 0; f < h.fingers.length; f++) {
        const n = Math.sin(time * 7.6 + h.side * 1.9 + f * 0.62) * 0.5 + 0.5;
        h.fingers[f].rotation.x = -0.1 - a * (0.2 + n * 0.62);
      }
      h.group.position.y =
        h.baseY - a * 0.005 * (0.5 + 0.5 * Math.sin(time * 7.6 + h.side * 1.9));
    }
  }

  buildContactShadows() {
    const spots = [
      [0.0, 0.2, 0.5, 0.24, 0.3],
      [-0.42, 0.19, 0.26, 0.26, 0.24],
      [0.66, 0.09, 0.13, 0.13, 0.13],
      [-0.86, 0.22, 0.2, 0.2, 0.17],
      [0.92, -0.28, 0.17, 0.17, 0.17],
      [-0.94, -0.22, 0.15, 0.15, 0.15],
      [0.88, 0.2, 0.11, 0.11, 0.11],
      [0.34, 0.19, 0.07, 0.08, 0.09],
      [0.0, 0.46, 0.44, 0.42, 0.32],
      [-0.1, 0.21, 0.2, 0.16, 0.12],
      [0.11, 0.21, 0.2, 0.16, 0.12],
    ];
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    for (const [x, z, sx, sz] of spots) {
      const m = new THREE.Mesh(geo, this.mats.contact);
      m.position.set(x, this.deskY + 0.0016, z);
      m.scale.set(sx, 1, sz);
      m.renderOrder = 2;
      this.group.add(m);
    }
    const floor = new THREE.Mesh(geo, this.mats.contact.clone());
    floor.material.opacity = 0.5;
    floor.position.set(0, 0.002, 0.3);
    floor.scale.set(1.5, 1, 0.7);
    floor.renderOrder = 2;
    this.group.add(floor);
  }
}

function mat4(x, y, z, rx = 0, ry = 0, rz = 0) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
    new THREE.Vector3(1, 1, 1)
  );
}

const UP = new THREE.Vector3(0, 1, 0);
function limb(batch, a, b, r, color) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length() || 0.0001;
  const q = new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().divideScalar(len));
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  const m = new THREE.Matrix4().compose(mid, q, new THREE.Vector3(r * 2, len, r * 2));
  return batch.add(G.cyl8, m, color);
}

function matScaled(x, y, z, sx, sy, sz, rx = 0, rz = 0) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, 0, rz)),
    new THREE.Vector3(sx, sy, sz)
  );
}

export { c as PALETTE };
