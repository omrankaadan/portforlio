import * as THREE from "three";
import { clamp01, lerp } from "./world/util.js";

const FRAG = `
precision highp float;

uniform sampler2D tScene;
uniform sampler2D tDepth;
uniform vec2 uTexel;
uniform float uFocus;
uniform float uRange;
uniform float uMaxBlur;
uniform float uExposure;
uniform float uVignette;
uniform float uGrain;
uniform float uTime;
uniform vec2 uCursor;
uniform vec3 uTint;
uniform float uTintAmount;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float linearDepth(float d) {
  float z = d * 2.0 - 1.0;
  return (2.0 * uFocus * uRange) / (uRange + uFocus - z * (uRange - uFocus));
}

float coc(float depth) {
  return clamp(abs(depth - uFocus) / uRange, 0.0, 1.0);
}

void main() {
  float d = texture2D(tDepth, vUv).x;
  float depth = linearDepth(d);
  float blur = coc(depth);
  float px = uMaxBlur;

  vec3 col = vec3(0.0);
  float total = 0.0;

  for (int y = -3; y <= 3; y++) {
    for (int x = -3; x <= 3; x++) {
      vec2 off = vec2(float(x), float(y)) * uTexel * px * (0.35 + blur * 0.9);
      vec2 uv = vUv + off;
      float sd = linearDepth(texture2D(tDepth, uv).x);
      float w = 1.0;
      if (sd < depth - 0.04) w = 0.06;
      float sb = clamp(abs(sd - uFocus) / uRange, 0.0, 1.0);
      w *= 1.0 - smoothstep(0.0, 0.9, sb - blur) * 0.85;
      w *= exp(-float(x * x + y * y) * 0.09);
      col += texture2D(tScene, uv).rgb * w;
      total += w;
    }
  }
  col /= max(total, 0.0001);

  col *= uExposure;
  col = mix(col, col * uTint, uTintAmount);

  float d2 = distance(vUv, uCursor);
  float glare = exp(-d2 * 3.4) * 0.045 * (0.6 + 0.4 * sin(uTime * 0.7));
  col += glare * uTint;

  float vig = 1.0 - uVignette * pow(length((vUv - 0.5) * vec2(1.08, 1.0)) * 1.42, 2.1);
  col *= clamp(vig, 0.0, 1.2);

  float g = hash(vUv * vec2(1920.0, 1080.0) + uTime) - 0.5;
  col += g * uGrain;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export class PostFX {
  constructor(renderer, opts = {}) {
    this.renderer = renderer;
    this.quality = opts.quality || "high";
    this.enabled = true;

    const size = renderer.getSize(new THREE.Vector2());
    const dpr = renderer.getPixelRatio();

    const rtOpts = {
      type: THREE.HalfFloatType,
      colorSpace: THREE.SRGBColorSpace,
      samples: this.quality === "high" ? 4 : 0,
      depthBuffer: true,
    };

    this.sceneTarget = new THREE.WebGLRenderTarget(Math.max(1, size.x * dpr), Math.max(1, size.y * dpr), rtOpts);
    this.depthTarget = new THREE.WebGLRenderTarget(Math.max(1, size.x * dpr), Math.max(1, size.y * dpr), {
      type: THREE.FloatType,
      depthBuffer: true,
    });

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tScene: { value: this.sceneTarget.texture },
        tDepth: { value: this.depthTarget.depthTexture || null },
        uTexel: { value: new THREE.Vector2(1 / (size.x * dpr), 1 / (size.y * dpr)) },
        uFocus: { value: 1.2 },
        uRange: { value: 1.1 },
        uMaxBlur: { value: 3.4 },
        uExposure: { value: 1.0 },
        uVignette: { value: 0.42 },
        uGrain: { value: 0.012 },
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0.5, 0.5) },
        uTint: { value: new THREE.Color(0.55, 0.72, 0.9) },
        uTintAmount: { value: 0 },
      },
    });

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material);
    this.quadScene = new THREE.Scene();
    this.quadScene.add(this.quad);
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.setSize(size.x, size.y, dpr);
  }

  setSize(w, h, dpr) {
    const pw = Math.max(1, Math.floor(w * dpr));
    const ph = Math.max(1, Math.floor(h * dpr));
    if (this.width === pw && this.height === ph) return;
    this.width = pw;
    this.height = ph;
    this.sceneTarget.setSize(pw, ph);
    this.depthTarget.setSize(pw, ph);
    if (!this.depthTarget.depthTexture) {
      this.depthTarget.depthTexture = new THREE.DepthTexture(pw, ph);
      this.depthTarget.depthTexture.type = THREE.FloatType;
      this.depthTarget.depthTexture.minFilter = THREE.NearestFilter;
      this.depthTarget.depthTexture.magFilter = THREE.NearestFilter;
      this.material.uniforms.tDepth.value = this.depthTarget.depthTexture;
    } else {
      this.depthTarget.depthTexture.image.width = pw;
      this.depthTarget.depthTexture.image.height = ph;
      this.depthTarget.depthTexture.needsUpdate = true;
    }
    this.material.uniforms.uTexel.value.set(1 / pw, 1 / ph);
  }

  setQuality(q) {
    this.quality = q;
    const u = this.material.uniforms;
    if (q === "low") {
      u.uMaxBlur.value = 1.6;
      u.uGrain.value = 0.006;
      u.uVignette.value = 0.3;
    } else if (q === "medium") {
      u.uMaxBlur.value = 2.6;
      u.uGrain.value = 0.01;
      u.uVignette.value = 0.38;
    } else {
      u.uMaxBlur.value = 3.4;
      u.uGrain.value = 0.012;
      u.uVignette.value = 0.42;
    }
  }

  setFocus(distance, range, blur) {
    this.material.uniforms.uFocus.value = distance;
    this.material.uniforms.uRange.value = Math.max(0.2, range);
    this.material.uniforms.uMaxBlur.value = blur * (this.quality === "low" ? 0.5 : 1);
  }

  setExposure(v) {
    this.material.uniforms.uExposure.value = v;
  }

  setTint(color, amount) {
    this.material.uniforms.uTint.value.copy(color);
    this.material.uniforms.uTintAmount.value = amount;
  }

  setCursor(nx, ny) {
    this.material.uniforms.uCursor.value.set(clamp01(nx * 0.5 + 0.5), clamp01(ny * 0.5 + 0.5));
  }

  render(scene, camera, time) {
    const r = this.renderer;
    const u = this.material.uniforms;
    u.uTime.value = time;

    if (!this.enabled) {
      r.setRenderTarget(null);
      r.render(scene, camera);
      this.sceneStats = {
        calls: r.info.render.calls,
        triangles: r.info.render.triangles,
        points: r.info.render.points,
        lines: r.info.render.lines,
      };
      return;
    }

    const prevAuto = r.autoClear;
    r.autoClear = true;
    r.setRenderTarget(this.sceneTarget);
    r.clear();
    r.render(scene, camera);

    this.sceneStats = {
      calls: r.info.render.calls,
      triangles: r.info.render.triangles,
      points: r.info.render.points,
      lines: r.info.render.lines,
    };

    r.setRenderTarget(this.depthTarget);
    r.clear();
    r.render(scene, camera);
    r.autoClear = prevAuto;

    r.setRenderTarget(null);
    r.render(this.quadScene, this.quadCamera);
  }

  dispose() {
    this.sceneTarget.dispose();
    this.depthTarget.dispose();
    this.material.dispose();
    this.quad.geometry.dispose();
  }
}

export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * Math.min(dt, 0.5)));
}
