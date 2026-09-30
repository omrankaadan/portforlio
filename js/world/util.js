import * as THREE from "three";

export function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smooth = (t) => t * t * (3 - 2 * t);
export const range = (t, a, b) => clamp01((t - a) / (b - a || 1));

const nonIndexedCache = new Map();
function nonIndexed(geo) {
  let g = nonIndexedCache.get(geo.uuid);
  if (!g) {
    g = geo.index ? geo.toNonIndexed() : geo.clone();
    nonIndexedCache.set(geo.uuid, g);
  }
  return g;
}

export const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 12, 1),
  cyl8: new THREE.CylinderGeometry(0.5, 0.5, 1, 8, 1),
  cone: new THREE.ConeGeometry(0.5, 1, 10),
  ico: new THREE.IcosahedronGeometry(0.5, 0),
  ico1: new THREE.IcosahedronGeometry(0.5, 1),
  sphere: new THREE.SphereGeometry(0.5, 14, 10),
  plane: new THREE.PlaneGeometry(1, 1),
  torus: new THREE.TorusGeometry(0.5, 0.12, 8, 24),
};

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _sc = new THREE.Vector3(1, 1, 1);

export function xform(x, y, z, ry, sx, sy, sz, rx = 0, rz = 0) {
  _e.set(rx, ry, rz);
  _q.setFromEuler(_e);
  _p.set(x, y, z);
  _sc.set(sx, sy, sz);
  return _m.compose(_p, _q, _sc);
}

export class Batcher {
  constructor() {
    this.pos = [];
    this.nor = [];
    this.col = [];
    this._v = new THREE.Vector3();
    this._n = new THREE.Vector3();
    this._c = new THREE.Color();
    this._nm = new THREE.Matrix3();
  }

  get count() {
    return this.pos.length / 3;
  }

  add(geo, matrix, color, emissiveScale = 1) {
    const g = nonIndexed(geo);
    const p = g.attributes.position.array;
    const n = g.attributes.normal.array;
    this._nm.getNormalMatrix(matrix);
    const c = this._c;
    if (color && color.isColor) c.copy(color);
    else if (color !== undefined && color !== null) c.set(color);
    else c.setRGB(1, 1, 1);
    for (let i = 0; i < p.length; i += 3) {
      this._v.set(p[i], p[i + 1], p[i + 2]).applyMatrix4(matrix);
      this._n.set(n[i], n[i + 1], n[i + 2]).applyMatrix3(this._nm).normalize();
      this.pos.push(this._v.x, this._v.y, this._v.z);
      this.nor.push(this._n.x, this._n.y, this._n.z);
      this.col.push(c.r * emissiveScale, c.g * emissiveScale, c.b * emissiveScale);
    }
    return this;
  }

  box(x, y, z, w, h, d, color, rotY = 0, rotX = 0, rotZ = 0) {
    return this.add(G.box, xform(x, y, z, rotY, w, h, d, rotX, rotZ), color);
  }

  cylinder(x, y, z, r, h, color, rotY = 0, rotX = 0, rotZ = 0, seg = "cyl") {
    return this.add(G[seg], xform(x, y, z, rotY, r * 2, h, r * 2, rotX, rotZ), color);
  }

  ico(x, y, z, r, color, seg = "ico") {
    return this.add(G[seg], xform(x, y, z, 0, r * 2, r * 2, r * 2), color);
  }

  quad(cx, cy, cz, rx, ry, rz, ux, uy, uz, w, h, color) {
    const c = this._c;
    if (color && color.isColor) c.copy(color);
    else if (color !== undefined && color !== null) c.set(color);
    else c.setRGB(1, 1, 1);
    const hw = w * 0.5;
    const hh = h * 0.5;
    const nx = ry * uz - rz * uy;
    const ny = rz * ux - rx * uz;
    const nz = rx * uy - ry * ux;
    const v = [
      [-hw, -hh],
      [hw, -hh],
      [hw, hh],
      [-hw, -hh],
      [hw, hh],
      [-hw, hh],
    ];
    for (let i = 0; i < 6; i++) {
      const a = v[i][0];
      const b = v[i][1];
      this.pos.push(cx + rx * a + ux * b, cy + ry * a + uy * b, cz + rz * a + uz * b);
      this.nor.push(nx, ny, nz);
      this.col.push(c.r, c.g, c.b);
    }
    return this;
  }

  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(this.col, 3));
    g.computeBoundingSphere();
    return g;
  }

  mesh(material) {
    if (!this.count) return null;
    const m = new THREE.Mesh(this.geometry(), material);
    m.castShadow = false;
    m.receiveShadow = false;
    return m;
  }
}
