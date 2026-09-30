const EASE = 8.5;
const isTouch = matchMedia("(pointer: coarse)").matches;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

export class SmoothScroll {
  constructor() {
    this.target = window.scrollY;
    this.current = window.scrollY;
    this.enabled = !isTouch && !reduced;
    this.lastTime = performance.now();
    this.selfScroll = false;

    if (this.enabled) {
      document.documentElement.style.scrollBehavior = "auto";
      window.addEventListener("wheel", this.onWheel.bind(this), { passive: false });
      window.addEventListener("keydown", this.onKey.bind(this));
    }
    window.addEventListener("scroll", this.onScroll.bind(this), { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => this.onAnchor(e, a));
    });
  }

  max() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  get y() {
    return this.enabled ? this.current : window.scrollY;
  }

  clamp(v) {
    return Math.max(0, Math.min(this.max(), v));
  }

  onWheel(e) {
    if (e.ctrlKey) return;
    if (document.getElementById("lightbox")?.classList.contains("open")) return;
    e.preventDefault();
    const mult = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    this.target = this.clamp(this.target + e.deltaY * mult);
  }

  onKey(e) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
    const page = window.innerHeight * 0.85;
    const map = { ArrowDown: 90, ArrowUp: -90, PageDown: page, PageUp: -page, Home: -1e9, End: 1e9, " ": page };
    if (e.key in map) {
      e.preventDefault();
      this.target = this.clamp(this.target + map[e.key]);
    }
  }

  onScroll() {
    const d = Math.abs(window.scrollY - this.current);
    if (d > 1) {
      this.current = window.scrollY;
      this.target = window.scrollY;
      this.lastTime = performance.now();
    }
  }

  onAnchor(e, a) {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    const top = this.clamp(el.getBoundingClientRect().top + window.scrollY);
    if (this.enabled) {
      this.target = top;
    } else {
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }
    history.replaceState(null, "", id);
  }

  jumpTo(y) {
    this.target = this.clamp(y);
    this.current = this.target;
    this.apply();
  }

  apply() {
    this.selfScroll = true;
    window.scrollTo(0, this.current);
  }

  update() {
    if (!this.enabled) return;
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    if (!this.selfScroll && Math.abs(window.scrollY - this.current) > 1) {
      this.current = window.scrollY;
      this.target = window.scrollY;
      return;
    }
    this.selfScroll = false;

    const diff = this.target - this.current;
    if (Math.abs(diff) < 0.35) {
      if (this.current !== this.target) {
        this.current = this.target;
        this.apply();
      }
      return;
    }
    this.current += diff * (1 - Math.exp(-EASE * dt));
    this.apply();
  }
}
