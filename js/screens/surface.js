import * as THREE from "three";

export class ScreenSurface {
  constructor(opts) {
    const {
      width,
      height,
      pixels,
      draw,
      radius = 0.004,
      glass = true,
      intensity = 1.15,
      interval = 0.1,
      anisotropy = 8,
    } = opts;

    this.width = width;
    this.height = height;
    this.drawFn = draw;
    this.interval = interval;
    this.drawCount = 0;
    this.lastDraw = -1;
    this.revisions = 0;

    this.canvas = document.createElement("canvas");
    this.canvas.width = pixels[0];
    this.canvas.height = pixels[1];
    this.ctx = this.canvas.getContext("2d", { alpha: false });

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = anisotropy;
    this.texture.generateMipmaps = false;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.material = new THREE.MeshPhysicalMaterial({
      color: 0x08080a,
      emissive: 0xffffff,
      emissiveMap: this.texture,
      emissiveIntensity: intensity,
      roughness: 0.34,
      metalness: 0,
      clearcoat: glass ? 0.8 : 0,
      clearcoatRoughness: 0.09,
      envMapIntensity: 0.45,
    });

    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 1, 1), this.material);
    this.mesh.renderOrder = 1;
  }

  markDirty() {
    this.dirty = true;
  }

  tick(time, force = false, progress = null) {
    if (progress !== null) this.progress = progress;
    if (!force && time - this.lastDraw < this.interval) return;
    this.lastDraw = time;
    this.drawFn(this.ctx, this.canvas.width, this.canvas.height, time, this.progress || {});
    this.texture.needsUpdate = true;
    this.drawCount++;
    this.revisions++;
  }

  setIntensity(v) {
    this.material.emissiveIntensity = v;
  }

  dispose() {
    this.texture.dispose();
    this.material.dispose();
    this.mesh.geometry.dispose();
  }
}
