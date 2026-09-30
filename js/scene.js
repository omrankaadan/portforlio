import * as THREE from "three";
import { createMaterials, disposeMaterials } from "./world/materials.js";
import { buildEnvironment } from "./world/env.js";
import { DeveloperWorkspace } from "./world/workspace.js";
import { buildRoom } from "./world/room.js";
import { buildLaptop, buildPhone, buildSecondMonitor } from "./world/devices.js";
import { createScreens, drawStageSurfaces, disposeScreens } from "./screens/index.js";
import { Story, PHASES, phaseAt } from "./story.js";
import { PostFX } from "./postfx.js";
import { Quality } from "./quality.js";
import { lerp } from "./world/util.js";
import { P, STORY_TINT } from "./palette.js";

export class SceneController {
  constructor(canvas, scroller) {
    this.canvas = canvas;
    this.scroller = scroller || null;

    this.quality = new Quality();
    this.quality.onChange = (q, reason) => this.applyQuality(q, reason);
    this.story = new Story();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
    });
    this.renderer.setPixelRatio(this.quality.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = P.env.exposure;
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(P.env.bg);
    this.scene.fog = new THREE.Fog(P.env.fog, P.env.fogNear, P.env.fogFar);

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.05, 40);
    this.camera.position.set(0, 0.62, 1.34);

    this.materials = createMaterials();
    this.scene.environment = buildEnvironment(this.renderer);
    this.scene.environmentIntensity = P.env.environmentIntensity;

    const buildStart = performance.now();

    this.room = buildRoom(this.materials);
    this.scene.add(this.room);

    this.workspace = new DeveloperWorkspace(this.materials);
    this.scene.add(this.workspace.group);

    const deskY = this.workspace.deskY;
    this.laptop = buildLaptop(this.materials, { x: -0.66, y: deskY, z: 0.02, rotY: 0.34 });
    this.phone = buildPhone(this.materials, { x: 0.66, y: deskY, z: 0.09, rotY: -0.5, tilt: -0.36 });
    this.second = buildSecondMonitor(this.materials, { x: 0.6, y: deskY, z: -0.24, rotY: -0.42 });
    this.scene.add(this.laptop.group, this.phone.group, this.second.group);

    this.screens = createScreens(this.workspace, {
      laptop: this.laptop,
      phone: this.phone,
      second: this.second,
    });

    this.buildLights(deskY);
    this.buildMs = performance.now() - buildStart;

    this.postfx = new PostFX(this.renderer, { quality: this.quality.name });
    this.postfx.enabled = this.quality.dof;
    this.applyQuality(this.quality, "init");

    this.hudEl = document.getElementById("studio-hud");
    this.hudIndex = this.hudEl ? this.hudEl.querySelector(".hud-index") : null;
    this.hudPhase = this.hudEl ? this.hudEl.querySelector(".hud-phase") : null;
    this.hudBar = this.hudEl ? this.hudEl.querySelector(".hud-bar i") : null;
    this.hudTimer = 0;
    this.hudKey = "";

    this.pointer = { x: 0, y: 0 };
    this.smoothPointer = { x: 0, y: 0 };
    this.tintColor = new THREE.Color(1, 0.985, 0.95);
    this.camPos = new THREE.Vector3(0, 0.62, 1.34);
    this.camLook = new THREE.Vector3(0.02, 0.24, 0.1);
    this.focusTarget = new THREE.Vector3(0.02, 0.24, 0.1);

    this.sectionCenters = [];
    this.clock = new THREE.Clock();
    this.time = 0;
    this.frame = 0;
    this.lastScrollY = -1;
    this.navSolid = null;
    this.typing = 0;
    this.deadzone = 0;

    this.story.onChange(() => this.onPhase());

    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("pointermove", (e) => this.onPointer(e), { passive: true });
    window.addEventListener("pointerleave", () => {
      this.pointer.x = 0;
      this.pointer.y = 0;
    });

    this.measureSections();
    window.addEventListener("load", () => this.measureSections());
    document.fonts?.ready.then(() => this.measureSections());
  }

  buildLights(deskY) {
    this.scene.add(new THREE.HemisphereLight(P.light.hemiSky, P.light.hemiGround, 1.7));

    const key = new THREE.DirectionalLight(P.light.key, 1.8);
    key.position.set(-2.1, 2.6, 1.5);
    key.target.position.set(0.1, deskY, 0);
    key.castShadow = false;
    key.shadow.mapSize.set(this.quality.shadowSize || 1024, this.quality.shadowSize || 1024);
    key.shadow.camera.left = -2.2;
    key.shadow.camera.right = 2.2;
    key.shadow.camera.top = 2;
    key.shadow.camera.bottom = -2;
    key.shadow.camera.near = 0.4;
    key.shadow.camera.far = 7;
    key.shadow.bias = -0.0009;
    key.shadow.normalBias = 0.018;
    key.shadow.radius = 5;
    this.scene.add(key, key.target);
    this.keyLight = key;

    const windowFill = new THREE.DirectionalLight(P.light.window, 1.8);
    windowFill.position.set(-2.6, 1.7, -1.1);
    windowFill.target.position.set(0.2, deskY, 0.2);
    this.scene.add(windowFill, windowFill.target);

    const screenBounce = new THREE.PointLight(P.light.screen, 0.28, 2.8, 2);
    screenBounce.position.set(0, deskY + 0.62, -0.24);
    this.scene.add(screenBounce);
    this.screenBounce = screenBounce;

    const rim = new THREE.SpotLight(P.light.rim, 0.24, 4, 1.15, 0.95, 1.5);
    rim.position.set(1.6, 1.5, -1.5);
    rim.target.position.set(0, deskY, 0.1);
    this.scene.add(rim, rim.target);
    this.rimLight = rim;
  }

  applyQuality(q, reason) {
    this.renderer.setPixelRatio(q.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = false;
    this.keyLight.castShadow = false;
    if (q.shadowsEnabled) {
      const s = q.shadowSize || 1024;
      if (this.keyLight.shadow.mapSize.x !== s) {
        this.keyLight.shadow.mapSize.set(s, s);
        if (this.keyLight.shadow.map) {
          this.keyLight.shadow.map.dispose();
          this.keyLight.shadow.map = null;
        }
      }
    }
    if (this.workspace.lampLight) this.workspace.lampLight.castShadow = false;
    this.postfx.setQuality(q.name);
    this.postfx.enabled = q.dof;
    if (reason !== "init") this.renderer.shadowMap.needsUpdate = true;
  }

  measureSections() {
    this.sectionCenters = [...document.querySelectorAll("[data-scene]")].map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + window.scrollY + r.height / 2;
    });
  }

  getScenePos(scrollY) {
    const y = scrollY + window.innerHeight / 2;
    const c = this.sectionCenters;
    if (!c.length) return 0;
    if (y <= c[0]) return 0;
    if (y >= c[c.length - 1]) return c.length - 1;
    for (let i = 0; i < c.length - 1; i++) {
      if (y >= c[i] && y < c[i + 1]) return i + (y - c[i]) / (c[i + 1] - c[i]);
    }
    return 0;
  }

  onPointer(e) {
    this.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    this.pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(this.quality.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.postfx.setSize(window.innerWidth, window.innerHeight, this.quality.pixelRatio);
    this.measureSections();
  }

  updateNav(scrollY) {
    const solid = scrollY > 40;
    if (solid === this.navSolid) return;
    this.navSolid = solid;
    const nav = document.getElementById("nav");
    if (nav) {
      nav.style.background = solid
        ? "rgba(9, 12, 18, 0.86)"
        : "linear-gradient(rgba(9, 12, 18, 0.88), rgba(9, 12, 18, 0))";
    }
  }

  onPhase() {
    const key = `${this.story.phase.index}:${this.story.phase.key}`;
    if (key === this.hudKey) return;
    this.hudKey = key;
    if (this.hudIndex) this.hudIndex.textContent = String(this.story.phase.index + 1).padStart(2, "0");
    if (this.hudEl && this.hudPhase) {
      clearTimeout(this.hudTimer);
      this.hudPhase.classList.add("swap");
      this.hudTimer = setTimeout(() => {
        this.hudPhase.textContent = this.story.phase.label;
        this.hudPhase.classList.remove("swap");
      }, 170);
    }
    for (const k of Object.keys(this.screens)) this.screens[k].markDirty();
  }

  updateHud() {
    if (!this.hudEl) return;
    if (this.hudBar) this.hudBar.style.transform = `scaleX(${this.story.p.toFixed(4)})`;
    this.hudEl.classList.add("on");
  }

  updateCamera(dt) {
    const s = this.story.shot;
    const px = this.smoothPointer.x;
    const py = this.smoothPointer.y;
    const breathing = this.story.phase.key === "breath";
    const driftX = breathing ? Math.sin(this.time * 0.32) * 0.018 : 0;
    const driftY = breathing ? Math.sin(this.time * 0.24) * 0.01 : 0;

    const tx = s.pos[0] + px * 0.045 + driftX;
    const ty = s.pos[1] - py * 0.028 + driftY;
    const tz = s.pos[2];

    const lx = s.look[0] + px * 0.018;
    const ly = s.look[1] - py * 0.012;
    const lz = s.look[2];

    const k = 1 - Math.exp(-6.5 * dt);
    this.camPos.x += (tx - this.camPos.x) * k;
    this.camPos.y += (ty - this.camPos.y) * k;
    this.camPos.z += (tz - this.camPos.z) * k;
    this.camLook.x += (lx - this.camLook.x) * k;
    this.camLook.y += (ly - this.camLook.y) * k;
    this.camLook.z += (lz - this.camLook.z) * k;

    const fov = s.fov + Math.abs(px) * 0.6;
    if (Math.abs(this.camera.fov - fov) > 0.01) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }

    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camLook);
    this.focusTarget.copy(this.camLook);
  }

  updateWorld(dt) {
    const deskY = this.workspace.deskY;
    const key = this.story.phase.key;

    const build = this.story.range("build");
    const app = this.story.range("app");
    const mobile = this.story.range("mobile");
    const resting = key === "breath";

    const idle = key === "setup" ? 1 - this.story.phase.local : 0;
    const typing = key === "build" ? 1 : key === "plan" ? 0.25 : 0;
    this.typing = lerp(this.typing, typing, 1 - Math.exp(-3 * dt));
    this.workspace.setTyping(this.typing, this.time);
    this.workspace.group.position.y = Math.sin(this.time * 0.42) * (resting ? 0.0024 : 0.0012);

    const pulse = 0.5 + 0.5 * Math.sin(this.time * 1.9);
    this.screenBounce.intensity = 0.14 + build * 0.16 + app * 0.2;
    this.screenBounce.color.setHex(app > 0.6 ? P.light.screenActive : P.light.screen);

    this.keyLight.intensity = 1.38 + idle * 0.12 + (resting ? 0.12 : 0) - app * 0.08;
    this.rimLight.intensity = 0.28 + build * 0.18 + app * 0.22;

    if (this.workspace.lampLight) {
      this.workspace.lampLight.intensity = 0.62 + pulse * 0.06 + idle * 0.06;
      this.workspace.lampLight.distance = 2.8;
    }
    if (this.workspace.lampBulb) {
      this.workspace.lampBulb.material.color.setHSL(0.09, 0.75, 0.62 + pulse * 0.04);
    }

    const screenQuiet = resting ? 0.64 : 1;
    this.screens.main.setIntensity((0.88 + build * 0.14 + app * 0.12) * screenQuiet);
    this.screens.second.setIntensity((0.82 + build * 0.14) * screenQuiet);
    this.screens.phone.setIntensity((0.78 + mobile * 0.4) * screenQuiet);
    this.screens.laptop.setIntensity((0.82 + build * 0.14) * screenQuiet);

    this.scene.environmentIntensity = P.env.environmentIntensity + idle * 0.05 + (resting ? 0.08 : 0);

    const lift = mobile;
    const k = 1 - Math.exp(-5 * dt);
    this.phone.group.position.z = lerp(0.09, 0.2, lift);
    this.phone.group.position.y = lerp(this.phone.group.position.y, deskY + 0.052, k);
    this.phone.group.rotation.y = lerp(-0.5, -0.14, lift);
    this.phone.group.rotation.x = lerp(-0.36, -0.1, lift);
    this.phone.group.scale.setScalar(lerp(1, 1.18, lift));
  }

  updatePostFx() {
    const s = this.story.shot;
    const dist = this.camera.position.distanceTo(this.focusTarget);
    const range = 0.55 + s.bokeh * 0.85;
    const quiet = this.story.phase.key === "breath";
    this.postfx.setFocus(dist, quiet ? 2.6 : range, quiet ? 0.3 : 1.1 + s.bokeh * 2.4);

    const app = this.story.range("app");
    this.postfx.setExposure(1.02 + app * 0.06);
    const grade = STORY_TINT[this.story.phase.key];
    this.tintColor.setRGB(...grade.color);
    this.postfx.setTint(this.tintColor, grade.amount + app * 0.025);
    this.postfx.setCursor(this.smoothPointer.x, this.smoothPointer.y);
    this.postfx.material.uniforms.uGrain.value = this.quality.grain && !quiet ? 0.008 : 0;
  }

  start() {
    const loop = () => {
      requestAnimationFrame(loop);
      this.scroller?.update();

      const raw = this.clock.getDelta();
      const dt = Math.min(raw, 0.05);
      this.time += dt;
      this.frame++;
      this.quality.sample(raw, this.time * 1000);

      const scrollY = this.scroller ? this.scroller.y : window.scrollY;
      if (scrollY !== this.lastScrollY) {
        this.lastScrollY = scrollY;
        this.updateNav(scrollY);
      }

      const blend = 1 - Math.exp(-3.6 * Math.min(raw, 0.5));
      this.smoothPointer.x += (this.pointer.x - this.smoothPointer.x) * blend;
      this.smoothPointer.y += (this.pointer.y - this.smoothPointer.y) * blend;

      this.story.setTarget(this.getScenePos(scrollY) / Math.max(1, this.sectionCenters.length - 1));
      this.story.update(dt);

      drawStageSurfaces(this.screens, this.time, this.story, this.frame === 1);
      this.updateCamera(dt);
      this.updateWorld(dt);
      this.updatePostFx();
      this.updateHud();

      if (this.quality.shadowsEnabled && this.frame % 2 === 0) this.renderer.shadowMap.needsUpdate = true;
      const t0 = this.frame === 1 ? performance.now() : 0;
      this.postfx.render(this.scene, this.camera, this.time);
      if (t0) this.firstFrameMs = performance.now() - t0;
    };
    loop();
  }

  get stats() {
    const info = this.renderer.info;
    const s = this.postfx.sceneStats || {};
    return {
      calls: s.calls || 0,
      tris: s.triangles || 0,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      programs: info.programs ? info.programs.length : 0,
      buildMs: Math.round(this.buildMs * 10) / 10,
      firstFrameMs: this.firstFrameMs ? Math.round(this.firstFrameMs) : null,
      frame: this.frame,
      quality: this.quality.name,
      dpr: this.quality.pixelRatio,
      phase: this.story.phase.key,
      p: Math.round(this.story.p * 1000) / 1000,
    };
  }

  get phaseList() {
    return PHASES;
  }

  get phaseInfo() {
    return phaseAt(this.story.p);
  }
}

export function disposeScene(controller) {
  disposeScreens(controller.screens);
  disposeMaterials(controller.materials);
  controller.postfx.dispose();
  controller.renderer.dispose();
}
