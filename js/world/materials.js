import * as THREE from "three";
import { P } from "../palette.js";
import {
  woodMaps,
  brushedMaps,
  fabricMaps,
  paperMap,
  ceramicMaps,
  deskMatMap,
  coffeeMap,
  contactShadowTexture,
} from "./textures.js";

export function createMaterials() {
  const wood = woodMaps();
  const brushed = brushedMaps();
  const fabric = fabricMaps();
  const ceramic = ceramicMaps();
  const mat = deskMatMap();

  const M = {};

  M.wood = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: wood.map,
    roughnessMap: wood.roughnessMap,
    roughness: 1,
    metalness: 0,
    clearcoat: 0.28,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.55,
    vertexColors: true,
  });

  M.metal = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: brushed.map,
    roughnessMap: brushed.roughnessMap,
    roughness: 0.42,
    metalness: 0.92,
    envMapIntensity: 1.15,
    vertexColors: true,
  });

  M.plastic = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.62,
    metalness: 0.05,
    clearcoat: 0.3,
    clearcoatRoughness: 0.42,
    envMapIntensity: 0.6,
    vertexColors: true,
  });

  M.rubber = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.94,
    metalness: 0,
    envMapIntensity: 0.25,
    vertexColors: true,
  });

  M.fabric = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: fabric.map,
    roughnessMap: fabric.roughnessMap,
    roughness: 1,
    metalness: 0,
    sheen: 0.5,
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(P.person.chair),
    envMapIntensity: 0.35,
    vertexColors: true,
  });

  M.ceramic = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: ceramic.map,
    roughnessMap: ceramic.roughnessMap,
    roughness: 0.34,
    metalness: 0.02,
    clearcoat: 0.55,
    clearcoatRoughness: 0.22,
    envMapIntensity: 0.95,
    vertexColors: true,
  });

  M.paper = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: paperMap(),
    roughness: 0.94,
    metalness: 0,
    envMapIntensity: 0.4,
    vertexColors: true,
  });

  M.deskMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: mat.map,
    roughnessMap: mat.roughnessMap,
    roughness: 1,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.85,
    envMapIntensity: 0.3,
    vertexColors: true,
  });

  M.coffee = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: coffeeMap(),
    roughness: 0.16,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.5,
    vertexColors: true,
  });

  M.coffee.map.wrapS = M.coffee.map.wrapT = THREE.ClampToEdgeWrapping;

  M.contact = new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: contactShadowTexture(),
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });

  M.wall = new THREE.MeshStandardMaterial({
    color: P.room.wall,
    roughness: 0.94,
    metalness: 0,
    envMapIntensity: 0.35,
    vertexColors: true,
  });

  M.floor = new THREE.MeshStandardMaterial({
    color: P.room.floor,
    roughness: 0.72,
    metalness: 0.05,
    envMapIntensity: 0.4,
    vertexColors: true,
  });

  M.glow = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
    toneMapped: false,
  });

  M.skin = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.62,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.6,
    envMapIntensity: 0.5,
    vertexColors: true,
  });

  M.screenGlass = new THREE.MeshPhysicalMaterial({
    color: P.device.screenOff,
    roughness: 0.3,
    metalness: 0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.07,
    envMapIntensity: 0.5,
    vertexColors: false,
  });

  return M;
}

export function applyEnvironment(materials, envMap) {
  for (const key of Object.keys(materials)) {
    const m = materials[key];
    if (m.isMeshStandardMaterial) {
      m.envMap = envMap;
      m.needsUpdate = true;
    }
  }
}

export function disposeMaterials(materials) {
  for (const key of Object.keys(materials)) materials[key].dispose();
}
