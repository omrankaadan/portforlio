const TIERS = ["low", "medium", "high"];

function deviceTier() {
  const nav = navigator;
  const mem = nav.deviceMemory || 8;
  const cores = nav.hardwareConcurrency || 8;
  const small = Math.min(window.innerWidth, window.innerHeight) < 760;
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) return 0;
  if (small || mem <= 4 || cores <= 4) return 1;
  if (mem <= 8 || cores <= 8) return 1;
  return 2;
}

export class Quality {
  constructor() {
    const tier = deviceTier();
    this.locked = false;
    this.tier = tier;
    this.dprCap = [1.15, 1.4, 1.75][tier];
    this.shadowSize = [0, 1024, 2048][tier];
    this.shadowsEnabled = tier > 0;
    this.bloom = tier > 1;
    this.dof = tier > 0;
    this.grain = tier > 0;
    this.textures = ["512", "1024", "1024"][tier];
    this.frameBudget = [33, 20, 12][tier];
    this.samples = [0, 0, 4][tier];
    this.slow = 0;
    this.fast = 0;
    this.onChange = null;
    this._last = 0;
  }

  get name() {
    return TIERS[this.tier];
  }

  get pixelRatio() {
    return Math.min(window.devicePixelRatio || 1, this.dprCap);
  }

  sample(dt, now) {
    if (this.locked || dt <= 0) return;
    if (now - this._last < 2500) return;
    this._last = now;

    if (dt > 1 / 24) {
      this.slow++;
      this.fast = 0;
    } else if (dt < 1 / 55) {
      this.fast++;
      this.slow = 0;
    } else {
      this.slow = 0;
      this.fast = 0;
    }

    if (this.slow >= 3 && this.tier > 0) this.apply(this.tier - 1, "down");
    else if (this.fast >= 8 && this.tier < 2) this.apply(this.tier + 1, "up");
  }

  apply(tier, reason) {
    tier = Math.max(0, Math.min(2, tier));
    if (tier === this.tier) return;
    this.tier = tier;
    this.dprCap = [1.15, 1.4, 1.75][tier];
    this.shadowSize = [0, 1024, 2048][tier];
    this.shadowsEnabled = tier > 0;
    this.bloom = tier > 1;
    this.dof = tier > 0;
    this.grain = tier > 0;
    this.samples = [0, 0, 4][tier];
    this.slow = 0;
    this.fast = 0;
    if (this.onChange) this.onChange(this, reason);
  }
}
