import * as THREE from "three";
import { Batcher, mulberry32 } from "./util.js";

export function buildRoom(materials) {
  const g = new THREE.Group();

  const floorB = new Batcher();
  floorB.quad(0, 0, 0, 0, 1, 0, 1, 0, 0, 9, 9, 0xffffff);
  const floor = floorB.mesh(materials.floor);
  floor.receiveShadow = true;
  g.add(floor);

  const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.7), materials.contact);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.0015, 0.35);
  rug.material = materials.contact;
  rug.renderOrder = 1;
  rug.visible = false;
  g.add(rug);

  const wallB = new Batcher();
  wallB.quad(0, 1.5, -1.35, 0, 0, 1, 1, 0, 0, 7, 3, 0xffffff);
  wallB.quad(-2.6, 1.5, 0, 0, 0, 1, 0, 0, -1, 4, 3, 0xbfc4c9);
  wallB.quad(2.75, 1.5, 0, 0, 0, 1, 0, 0, 1, 4.2, 3, 0x9aa2ac);
  const walls = wallB.mesh(materials.wall);
  walls.receiveShadow = true;
  g.add(walls);

  const trimB = new Batcher();
  trimB.box(0, 0.06, -1.34, 7, 0.12, 0.03, 0x1b1f26);
  trimB.box(-2.58, 0.06, 0, 0.03, 0.12, 4, 0x1b1f26);
  trimB.box(2.73, 0.06, 0, 0.03, 0.12, 4.2, 0x1b1f26);
  const trim = trimB.mesh(materials.wall);
  trim.receiveShadow = true;
  g.add(trim);

  const shelf = new Batcher();
  shelf.box(-1.05, 1.32, -1.3, 1.1, 0.032, 0.22, 0x6b4f38);
  shelf.box(-1.05, 1.5, -1.31, 0.9, 0.3, 0.018, 0x2c333d);
  const shelfMesh = shelf.mesh(materials.wood);
  shelfMesh.castShadow = true;
  shelfMesh.receiveShadow = true;
  g.add(shelfMesh);

  const books = new Batcher();
  const rng = mulberry32(41);
  let bx = -1.48;
  while (bx < -0.66) {
    const w = 0.026 + rng() * 0.022;
    const h = 0.17 + rng() * 0.08;
    const tint = [0x3d4a5c, 0x4a3f5c, 0x2f4a44, 0x5c4436, 0x39424f][Math.floor(rng() * 5)];
    books.box(bx + w / 2, 1.352 + h / 2, -1.29, w, h, 0.14 + rng() * 0.03, tint, 0, 0, rng() < 0.16 ? 0.14 : 0);
    bx += w + 0.006;
  }
  const booksMesh = books.mesh(materials.plastic);
  booksMesh.castShadow = true;
  g.add(booksMesh);

  const frameB = new Batcher();
  frameB.box(0.72, 1.5, -1.325, 0.62, 0.44, 0.024, 0x1a1e24);
  frameB.box(0.72, 1.5, -1.31, 0.56, 0.38, 0.012, 0x39424f);
  const frame = frameB.mesh(materials.wood);
  frame.castShadow = true;
  g.add(frame);

  const win = new Batcher();
  win.box(-1.75, 1.42, -1.3, 0.9, 1.2, 0.02, 0x38414d);
  win.box(-1.75, 1.42, -1.285, 0.84, 1.14, 0.012, 0x6d7f96);
  win.box(-1.75, 1.42, -1.276, 0.03, 1.14, 0.01, 0x2b333d);
  win.box(-1.75, 1.42, -1.276, 0.84, 0.03, 0.01, 0x2b333d);
  const winMesh = win.mesh(materials.plastic);
  g.add(winMesh);

  const blinds = new Batcher();
  for (let i = 0; i < 12; i++) {
    blinds.box(-1.75, 0.86 + i * 0.1, -1.24, 0.9, 0.03, 0.008, 0x9aa1a9, 0, 0.3, 0);
  }
  const blindsMesh = blinds.mesh(materials.metal);
  blindsMesh.castShadow = true;
  g.add(blindsMesh);

  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.026, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0xffe6c0, toneMapped: false })
  );
  bulb.position.set(0.72, 1.5, -1.28);
  g.add(bulb);

  return g;
}
