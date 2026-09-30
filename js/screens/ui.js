import { PRODUCT, REQUIREMENTS } from "./product.js";
import { S } from "../palette.js";

export const UI = {
  bg: S.dark,
  panel: S.panel,
  panel2: S.panel2,
  line: S.line2,
  text: S.text,
  dim: S.dim,
  faint: S.faint,
  accent: S.green,
  accent2: S.blue2,
  warn: "#d6b98c",
  ok: "#87a97f",
  bad: "#c08358",
  page: S.page,
  pageAlt: S.pageAlt,
  card: S.card,
  ink: S.ink,
  inkSoft: S.inkSoft,
  muted: S.muted,
  border: S.line,
  navy: S.navy,
  sage: S.sage,
  sageDeep: S.sageDeep,
  clay: S.clay,
  head: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

export function text(g, s, x, y, font, color, align = "left", baseline = "alphabetic") {
  g.font = font;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = baseline;
  g.fillText(s, x, y);
}

export function roundRect(g, x, y, w, h, r, fill, stroke) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.lineTo(x + w - rr, y);
  g.quadraticCurveTo(x + w, y, x + w, y + rr);
  g.lineTo(x + w, y + h - rr);
  g.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  g.lineTo(x + rr, y + h);
  g.quadraticCurveTo(x, y + h, x, y + h - rr);
  g.lineTo(x, y + rr);
  g.quadraticCurveTo(x, y, x + rr, y);
  g.closePath();
  if (fill) {
    g.fillStyle = fill;
    g.fill();
  }
  if (stroke) {
    g.strokeStyle = stroke;
    g.stroke();
  }
}

export function clampReveal(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function seg(q, a, b) {
  return clampReveal((q - a) / (b - a || 1));
}

export { PRODUCT, REQUIREMENTS };
