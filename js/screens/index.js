import { ScreenSurface } from "./surface.js";
import { drawEditor, drawTerminal, drawIdle } from "./dev.js";
import { drawProjectBrief, drawBrief, drawDesign } from "./story.js";
import { drawApp } from "./app.js";
import { drawAppMobile } from "./appmobile.js";
import { drawNotebook } from "./notebook.js";

function attach(anchor, surface) {
  if (!anchor) return surface;
  surface.mesh.position.set(0, 0, 0);
  anchor.add(surface.mesh);
  return surface;
}

export function createScreens(workspace, devices) {
  const [mw, mh] = workspace.monitorSize;

  const main = attach(
    workspace.anchors.monitor,
    new ScreenSurface({
      width: mw,
      height: mh,
      pixels: [1280, 720],
      intensity: 1.25,
      interval: 0.09,
      draw: (g, w, h, t, p) => {
        if (p.key === "breath") return drawIdle(g, w, h, t);
        switch (p.key) {
          case "setup":
            return drawIdle(g, w, h, t);
          case "idea":
            return drawProjectBrief(g, w, h, p.local);
          case "requirements":
            return drawBrief(g, w, h, t, p.local);
          case "plan":
            return drawDesign(g, w, h, t, p.local);
          case "build":
            return drawEditor(g, w, h, t, p.build);
          default:
            return drawApp(g, w, h, t, p.app);
        }
      },
    })
  );

  const laptop = attach(
    devices.laptop.anchor,
    new ScreenSurface({
      width: devices.laptop.size[0],
      height: devices.laptop.size[1],
      pixels: [1024, 660],
      intensity: 1.15,
      interval: 0.12,
      draw: (g, w, h, t, p) => {
        if (p.key === "breath") return drawIdle(g, w, h, t);
        switch (p.key) {
          case "idea":
            return drawProjectBrief(g, w, h, p.local);
          case "requirements":
            return drawBrief(g, w, h, t, Math.min(1, p.local + 0.15));
          case "plan":
            return drawDesign(g, w, h, t, Math.max(0, p.local - 0.2));
          case "build":
            return drawEditor(g, w, h, t, Math.min(1, p.build * 1.15));
          case "live":
            return drawTerminal(g, w, h, t, 1, false);
          case "responsive":
            return drawTerminal(g, w, h, t, 1, false);
          case "ship":
            return drawTerminal(g, w, h, t, 1, true);
          default:
            return drawIdle(g, w, h, t);
        }
      },
    })
  );

  const second = attach(
    devices.second.anchor,
    new ScreenSurface({
      width: devices.second.size[0],
      height: devices.second.size[1],
      pixels: [760, 540],
      intensity: 1.2,
      interval: 0.14,
      draw: (g, w, h, t, p) => {
        if (p.key === "breath") return drawIdle(g, w, h, t);
        switch (p.key) {
          case "plan":
            return drawDesign(g, w, h, t, p.local);
          case "build":
            return drawEditor(g, w, h, t, Math.max(0, p.build - 0.18));
          case "live":
          case "responsive":
          case "ship":
            return drawApp(g, w, h, t, Math.min(1, p.app + 0.15));
          case "requirements":
            return drawBrief(g, w, h, t, Math.max(0, p.local - 0.3));
          default:
            return drawIdle(g, w, h, t);
        }
      },
    })
  );

  const notebook = attach(
    workspace.anchors.notebook,
    new ScreenSurface({
      width: 0.288,
      height: 0.208,
      pixels: [900, 660],
      intensity: 0.6,
      interval: 0.22,
      glass: false,
      draw: (g, w, h, t, p) => p.key === "breath" ? drawIdle(g, w, h, t) : drawNotebook(g, w, h, t, p.plan),
    })
  );

  const phone = attach(
    devices.phone.anchor,
    new ScreenSurface({
      width: devices.phone.size[0],
      height: devices.phone.size[1],
      pixels: [540, 1120],
      intensity: 1.4,
      interval: 0.1,
      draw: (g, w, h, t, p) => p.key === "breath" ? drawIdle(g, w, h, t) : drawAppMobile(g, w, h, t, p.mobile),
    })
  );

  return { main, laptop, second, notebook, phone };
}

export function drawStageSurfaces(screens, time, story, force = false) {
  const p = {
    key: story.phase.key,
    label: story.phase.label,
    local: story.phase.local,
    plan: story.range("plan"),
    build: story.range("build"),
    app: story.range("app"),
    mobile: story.range("mobile"),
  };
  screens.main.tick(time, force, p);
  screens.laptop.tick(time, force, p);
  screens.second.tick(time, force, p);
  screens.notebook.tick(time, force, p);
  screens.phone.tick(time, force, p);
  return p;
}

export function disposeScreens(screens) {
  for (const k of Object.keys(screens)) screens[k].dispose();
}
