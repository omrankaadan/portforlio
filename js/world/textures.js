import * as THREE from "three";

const cache = new Map();

export function memo(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

export function surface(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}

export function toTexture(canvas, opts = {}) {
  const { repeat = [1, 1], srgb = true, aniso = 8, wrap = THREE.RepeatWrapping } = opts;
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = wrap;
  t.repeat.set(repeat[0], repeat[1]);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = aniso;
  return t;
}

export function grain(ctx, w, h, amount) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] = Math.max(0, Math.min(255, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(img, 0, 0);
}

function lumaAt(d, i) {
  return (d[i] * 0.3 + d[i + 1] * 0.5 + d[i + 2] * 0.2) / 255;
}

export function woodMaps() {
  return memo("wood", () => {
    const W = 1024;
    const H = 1024;
    const [c, g] = surface(W, H);
    const base = g.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, "#7a5940");
    base.addColorStop(0.45, "#6d4e37");
    base.addColorStop(1, "#5f432f");
    g.fillStyle = base;
    g.fillRect(0, 0, W, H);

    for (let i = 0; i < 320; i++) {
      const y = Math.random() * H;
      const amp = 2 + Math.random() * 8;
      const freq = 0.003 + Math.random() * 0.011;
      const ph = Math.random() * 6.283;
      const dark = Math.random() < 0.55;
      g.strokeStyle = dark
        ? `rgba(58,38,24,${(0.05 + Math.random() * 0.17).toFixed(3)})`
        : `rgba(186,156,124,${(0.03 + Math.random() * 0.08).toFixed(3)})`;
      g.lineWidth = 0.6 + Math.random() * 2.3;
      g.beginPath();
      for (let x = 0; x <= W; x += 8) {
        const yy = y + Math.sin(x * freq + ph) * amp;
        if (x === 0) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      g.stroke();
    }

    for (let k = 0; k < 3; k++) {
      const cx = 120 + Math.random() * (W - 240);
      const cy = 120 + Math.random() * (H - 240);
      for (let r = 30; r > 0; r -= 3) {
        g.strokeStyle = `rgba(56,36,22,${(0.05 + ((30 - r) / 30) * 0.2).toFixed(3)})`;
        g.lineWidth = 1.4;
        g.beginPath();
        g.ellipse(cx, cy, r * 2.0, r * 0.8, 0.3, 0, 6.283);
        g.stroke();
      }
    }

    grain(g, W, H, 14);

    const [rc, rg] = surface(W, H);
    rg.drawImage(c, 0, 0);
    const img = rg.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 148 + (1 - lumaAt(d, i)) * 88;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    rg.putImageData(img, 0, 0);

    return { map: toTexture(c), roughnessMap: toTexture(rc, { srgb: false }) };
  });
}

export function brushedMaps() {
  return memo("brushed", () => {
    const W = 512;
    const H = 512;
    const [c, g] = surface(W, H);
    g.fillStyle = "#bcb8b0";
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {
      const y = Math.random() * H;
      const len = 40 + Math.random() * 420;
      const x = Math.random() * W;
      const light = Math.random() < 0.5;
      g.strokeStyle = light
        ? `rgba(255,252,246,${(Math.random() * 0.1).toFixed(3)})`
        : `rgba(88,84,76,${(Math.random() * 0.11).toFixed(3)})`;
      g.lineWidth = Math.random() * 1.3 + 0.2;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + len, y + (Math.random() - 0.5) * 1.2);
      g.stroke();
    }
    grain(g, W, H, 10);

    const [rc, rg] = surface(W, H);
    rg.fillStyle = "#6a6a6a";
    rg.fillRect(0, 0, W, H);
    rg.drawImage(c, 0, 0);
    const img = rg.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 96 + (1 - lumaAt(d, i)) * 120;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    rg.putImageData(img, 0, 0);

    return { map: toTexture(c), roughnessMap: toTexture(rc, { srgb: false }) };
  });
}

export function fabricMaps() {
  return memo("fabric", () => {
    const W = 512;
    const H = 512;
    const [c, g] = surface(W, H);
    g.fillStyle = "#8e8677";
    g.fillRect(0, 0, W, H);
    const step = 5;
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const on = ((x / step + y / step) | 0) % 2 === 0;
        g.fillStyle = on ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.075)";
        g.fillRect(x, y, step - 1, step - 1);
      }
    }
    for (let i = 0; i < 5000; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "0,0,0"},${(Math.random() * 0.07).toFixed(3)})`;
      g.fillRect(Math.random() * W, Math.random() * H, 2, 1);
    }
    grain(g, W, H, 12);

    const [rc, rg] = surface(W, H);
    rg.drawImage(c, 0, 0);
    const img = rg.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = 196 + (1 - lumaAt(d, i)) * 50;
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    rg.putImageData(img, 0, 0);

    return { map: toTexture(c, { repeat: [4, 4] }), roughnessMap: toTexture(rc, { srgb: false, repeat: [4, 4] }) };
  });
}

export function paperMap() {
  return memo("paper", () => {
    const W = 512;
    const H = 512;
    const [c, g] = surface(W, H);
    g.fillStyle = "#f4f1e8";
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.6 ? "120,116,104" : "255,255,255"},${(Math.random() * 0.12).toFixed(3)})`;
      g.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 2, 1);
    }
    grain(g, W, H, 9);
    return toTexture(c);
  });
}

export function ceramicMaps() {
  return memo("ceramic", () => {
    const W = 256;
    const H = 256;
    const [c, g] = surface(W, H);
    g.fillStyle = "#e8e4dc";
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "90,86,78" : "255,255,255"},${(Math.random() * 0.14).toFixed(3)})`;
      const r = Math.random() * 2.2;
      g.beginPath();
      g.arc(Math.random() * W, Math.random() * H, r, 0, 6.283);
      g.fill();
    }
    grain(g, W, H, 7);
    const [rc, rg] = surface(W, H);
    rg.fillStyle = "#3a3a3a";
    rg.fillRect(0, 0, W, H);
    return { map: toTexture(c), roughnessMap: toTexture(rc, { srgb: false }) };
  });
}

export function deskMatMap() {
  return memo("deskmat", () => {
    const W = 512;
    const H = 512;
    const [c, g] = surface(W, H);
    g.fillStyle = "#22262c";
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 24000; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "255,255,255" : "0,0,0"},${(Math.random() * 0.05).toFixed(3)})`;
      g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    const [rc, rg] = surface(W, H);
    rg.fillStyle = "#c8c8c8";
    rg.fillRect(0, 0, W, H);
    return { map: toTexture(c, { repeat: [3, 3] }), roughnessMap: toTexture(rc, { srgb: false, repeat: [3, 3] }) };
  });
}

export function contactShadowTexture() {
  return memo("contact", () => {
    const S = 256;
    const [c, g] = surface(S, S);
    const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grad.addColorStop(0, "rgba(0,0,0,0.9)");
    grad.addColorStop(0.4, "rgba(0,0,0,0.52)");
    grad.addColorStop(0.75, "rgba(0,0,0,0.15)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, S, S);
    const t = toTexture(c, { srgb: false, wrap: THREE.ClampToEdgeWrapping });
    return t;
  });
}

export function coffeeMap() {
  return memo("coffee", () => {
    const S = 256;
    const [c, g] = surface(S, S);
    g.fillStyle = "#1a0f08";
    g.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) {
      g.fillStyle = `rgba(${Math.random() < 0.5 ? "120,84,48" : "58,34,16"},${(Math.random() * 0.35).toFixed(3)})`;
      g.beginPath();
      g.arc(Math.random() * S, Math.random() * S, 4 + Math.random() * 22, 0, 6.283);
      g.fill();
    }
    return toTexture(c, { repeat: [1, 1] });
  });
}

export function disposeTextureCache() {
  for (const v of cache.values()) {
    if (v && v.isTexture) v.dispose();
    else if (v && typeof v === "object") {
      for (const k of Object.keys(v)) if (v[k] && v[k].isTexture) v[k].dispose();
    }
  }
  cache.clear();
}
