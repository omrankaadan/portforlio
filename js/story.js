export const PHASES = [
  {
    key: "setup",
    label: "THE WORKSPACE",
    at: 0.0,
    shot: { pos: [-1.25, 1.05, 0.72], look: [0.15, 0.62, -0.26], fov: 46, bokeh: 0.55 },
  },
  {
    key: "idea",
    label: "PROJECT BRIEF",
    at: 0.16,
    shot: { pos: [0.3, 1.0, 0.68], look: [0.02, 0.84, -0.3], fov: 48, bokeh: 0.95 },
  },
  {
    key: "requirements",
    label: "THE SYSTEM",
    at: 0.32,
    shot: { pos: [-0.46, 1.08, 0.68], look: [0.05, 0.86, -0.3], fov: 52, bokeh: 0.85 },
  },
  {
    key: "breath",
    label: "THE PAUSE",
    at: 0.43,
    shot: { pos: [0.06, 1.7, 1.05], look: [0.04, 0.78, -0.23], fov: 58, bokeh: 0.16 },
  },
  {
    key: "plan",
    label: "ARCHITECTURE",
    at: 0.6,
    shot: { pos: [-0.34, 0.98, 0.6], look: [-0.6, 0.45, -0.04], fov: 44, bokeh: 0.7 },
  },
  {
    key: "build",
    label: "IMPLEMENTATION",
    at: 0.72,
    shot: { pos: [0.16, 1.02, 0.66], look: [0.02, 0.88, -0.3], fov: 46, bokeh: 1.15 },
  },
  {
    key: "live",
    label: "OPERATIONS",
    at: 0.82,
    shot: { pos: [0.62, 1.22, 1.02], look: [0.3, 0.66, -0.2], fov: 52, bokeh: 0.85 },
  },
  {
    key: "responsive",
    label: "RESPONSIVE",
    at: 0.92,
    shot: { pos: [0.52, 0.66, 0.54], look: [0.66, 0.45, 0.06], fov: 34, bokeh: 1.3 },
  },
  {
    key: "ship",
    label: "IN PRODUCTION",
    at: 1.0,
    shot: { pos: [-1.08, 1.0, 0.7], look: [0.16, 0.6, -0.26], fov: 48, bokeh: 0.4 },
  },
];

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export function phaseAt(p) {
  const v = clamp01(p);
  let i = 0;
  for (let k = 0; k < PHASES.length; k++) {
    if (v >= PHASES[k].at) i = k;
  }
  const a = PHASES[i].at;
  const b = i < PHASES.length - 1 ? PHASES[i + 1].at : 1;
  return { index: i, key: PHASES[i].key, label: PHASES[i].label, local: clamp01((v - a) / (b - a || 1)) };
}

function lerpShot(v) {
  const t = clamp01(v);
  let i = 0;
  while (i < PHASES.length - 2 && t >= PHASES[i + 1].at) i++;
  const a = PHASES[i].shot;
  const b = PHASES[Math.min(PHASES.length - 1, i + 1)].shot;
  const span = PHASES[Math.min(PHASES.length - 1, i + 1)].at - PHASES[i].at;
  const e = smooth(clamp01((t - PHASES[i].at) / (span || 1)));
  return {
    pos: [lerp(a.pos[0], b.pos[0], e), lerp(a.pos[1], b.pos[1], e), lerp(a.pos[2], b.pos[2], e)],
    look: [lerp(a.look[0], b.look[0], e), lerp(a.look[1], b.look[1], e), lerp(a.look[2], b.look[2], e)],
    fov: lerp(a.fov, b.fov, e),
    bokeh: lerp(a.bokeh, b.bokeh, e),
  };
}

const RANGES = {
  idea: [0.16, 0.32],
  requirements: [0.32, 0.43],
  plan: [0.6, 0.72],
  build: [0.72, 0.82],
  app: [0.82, 0.92],
  mobile: [0.92, 1.0],
};

export class Story {
  constructor() {
    this.p = 0;
    this.target = 0;
    this.phase = phaseAt(0);
    this.shot = lerpShot(0);
    this.listeners = new Set();
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  setTarget(p) {
    this.target = clamp01(p);
  }

  update(dt) {
    const gap = this.target - this.p;
    if (Math.abs(gap) < 0.0004) this.p = this.target;
    else this.p += gap * (1 - Math.exp(-5.2 * Math.min(dt, 0.5)));
    this.phase = phaseAt(this.p);
    this.shot = lerpShot(this.p);
    for (const fn of this.listeners) fn(this);
  }

  range(name) {
    const [a, b] = RANGES[name];
    return clamp01((this.p - a) / (b - a));
  }

  local() {
    return this.phase.local;
  }
}
