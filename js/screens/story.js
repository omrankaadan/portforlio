import { UI, text, roundRect, easeOut, seg, PRODUCT, REQUIREMENTS } from "./ui.js";

const BRIEF_POINTS = [
  "Keep vehicle and parts records searchable.",
  "Make stock updates practical, including spreadsheet imports.",
  "Bring appointments and admin work into the same platform.",
  "Protect workflows with roles and a clear audit trail.",
];

export function drawProjectBrief(g, W, H, q) {
  g.fillStyle = UI.bg;
  g.fillRect(0, 0, W, H);

  g.fillStyle = UI.panel;
  g.fillRect(0, 0, W, 42);
  g.strokeStyle = UI.line;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(0, 41.5);
  g.lineTo(W, 41.5);
  g.stroke();
  text(g, "PROJECT BRIEF", 14, 15, `700 11px ${UI.mono}`, UI.accent, "left", "middle");
  text(g, PRODUCT.name, 14, 31, `500 9px ${UI.mono}`, UI.dim, "left", "middle");
  text(g, "FROM CATALOG TO WORKSHOP OPERATIONS", W - 14, 22, `500 9px ${UI.mono}`, UI.faint, "right", "middle");

  text(g, "A clearer way to run the day.", 18, H * 0.18, `700 ${Math.round(H * 0.052)}px ${UI.head}`, UI.text, "left", "middle");
  text(g, "A full-stack platform for the details behind a garage.", 18, H * 0.235, `400 ${Math.round(H * 0.024)}px ${UI.head}`, UI.muted, "left", "middle");

  const rowH = Math.min(58, H * 0.115);
  const rowGap = 8;
  const startY = H * 0.31;
  BRIEF_POINTS.forEach((point, i) => {
    const a = easeOut(seg(q, i * 0.16, i * 0.16 + 0.3));
    if (a <= 0) return;
    const y = startY + i * (rowH + rowGap);
    g.save();
    g.globalAlpha = a;
    roundRect(g, 18, y, W - 36, rowH, 6, UI.panel, UI.line);
    roundRect(g, 30, y + rowH / 2 - 9, 18, 18, 5, UI.panel2);
    text(g, String(i + 1).padStart(2, "0"), 39, y + rowH / 2, `600 8px ${UI.mono}`, UI.warn, "center", "middle");
    text(g, point, 58, y + rowH / 2, `500 ${Math.round(H * 0.023)}px ${UI.head}`, UI.text, "left", "middle");
    g.restore();
  });

  const footerA = easeOut(seg(q, 0.68, 0.92));
  if (footerA > 0) {
    g.globalAlpha = footerA;
    roundRect(g, 18, H - 48, W - 36, 28, 5, "#29382f", "#536b55");
    text(g, "GOAL  /  Less admin friction. Better day-to-day visibility.", 30, H - 34, `600 9px ${UI.mono}`, "#bed2b3", "left", "middle");
    g.globalAlpha = 1;
  }
}

export function drawBrief(g, W, H, time, q) {
  g.fillStyle = UI.bg;
  g.fillRect(0, 0, W, H);

  text(g, "SCOPE / GARAGE PLATFORM", 14, 22, `700 12px ${UI.head}`, UI.text, "left", "middle");
  text(g, "FEATURES THAT MAKE THE WORKFLOW USEFUL", 14, 38, `500 9px ${UI.mono}`, UI.faint, "left", "middle");

  const list = REQUIREMENTS;
  let y = 60;
  for (let i = 0; i < list.length; i++) {
    const r = list[i];
    const a = easeOut(seg(q, i / list.length, i / list.length + 0.3));
    if (a <= 0) break;
    g.globalAlpha = a;
    const x = 14 + (1 - a) * 12;

    const check = a > 0.75;
    roundRect(g, x, y, W - 28, 30, 5, UI.panel, UI.line);
    roundRect(g, x + 9, y + 10, 11, 11, 3, check ? "#29382f" : UI.panel2, check ? "#536b55" : UI.line);
    if (check) {
      g.strokeStyle = UI.accent;
      g.lineWidth = 1.6;
      g.beginPath();
      g.moveTo(x + 11.5, y + 15.5);
      g.lineTo(x + 13.6, y + 17.8);
      g.lineTo(x + 17.4, y + 13.2);
      g.stroke();
    }
    text(g, r.id, x + 28, y + 15, `600 9px ${UI.mono}`, UI.faint, "left", "middle");
    text(g, r.title, x + 50, y + 15, `600 11px ${UI.head}`, UI.text, "left", "middle");
    text(g, r.detail, x + 28, y + 25, `400 9px ${UI.mono}`, UI.dim, "left", "middle");
    g.globalAlpha = 1;
    y += 34;
  }

  if (q > 0.75) {
    const a = easeOut(seg(q, 0.75, 1));
    g.globalAlpha = a;
    roundRect(g, 14, H - 42, W - 28, 26, 5, "#29382f", "#536b55");
    text(g, "Scope aligned — ready to design", 26, H - 29, `600 10px ${UI.mono}`, UI.accent, "left", "middle");
    g.globalAlpha = 1;
  }
}

export function drawDesign(g, W, H, time, q) {
  g.fillStyle = UI.bg;
  g.fillRect(0, 0, W, H);

  text(g, "DESIGN THE SYSTEM", 14, 20, `700 12px ${UI.head}`, UI.text, "left", "middle");
  text(g, "React client · Express API · PostgreSQL", 14, 34, `500 9px ${UI.mono}`, UI.faint, "left", "middle");

  const half = (W - 34) / 2;

  const a1 = easeOut(seg(q, 0, 0.35));
  if (a1 > 0) {
    g.globalAlpha = a1;
    text(g, "OPERATIONS UI", 14, 54, `600 9px ${UI.mono}`, UI.sage, "left", "middle");
    const wx = 14;
    const wy = 64;
    const wh = H - 150;
    roundRect(g, wx, wy, half, wh, 4, UI.panel, UI.line);
    roundRect(g, wx + 8, wy + 8, half - 16, 14, 3, UI.panel2);
    roundRect(g, wx + 8, wy + 28, (half - 20) * easeOut(seg(q, 0.05, 0.3)), 7, 2, UI.sageDeep);
    roundRect(g, wx + 8, wy + 40, (half - 24) * easeOut(seg(q, 0.12, 0.4)), 5, 2, UI.line);
    const cards = 4;
    for (let i = 0; i < cards; i++) {
      const cw = (half - 24) / 2 - 4;
      const cx = wx + 8 + (i % 2) * (cw + 8);
      const cy = wy + 54 + Math.floor(i / 2) * 40;
      const a = easeOut(seg(q, 0.18 + i * 0.05, 0.34 + i * 0.05));
      if (a <= 0) break;
      roundRect(g, cx, cy, cw * a, 32, 3, UI.panel2, UI.line);
      roundRect(g, cx + 5, cy + 6, cw * a - 10, 6, 2, UI.sageDeep);
      roundRect(g, cx + 5, cy + 16, (cw - 14) * a, 4, 2, UI.line);
      roundRect(g, cx + 5, cy + 23, (cw - 18) * a, 4, 2, UI.line);
    }
    roundRect(g, wx + 8, wy + wh - 34, (half - 16) * easeOut(seg(q, 0.4, 0.6)), 18, 4, "#29382f", "#536b55");
    g.globalAlpha = 1;
  }

  const a2 = easeOut(seg(q, 0.3, 0.65));
  if (a2 > 0) {
    g.globalAlpha = a2;
    const ax = 20 + half;
    text(g, "SYSTEM LAYERS", ax, 54, `600 9px ${UI.mono}`, UI.accent2, "left", "middle");
    const nodes = [
      { l: "React", x: 0.5, y: 0.06, c: "#394236" },
      { l: "REST API", x: 0.5, y: 0.36, c: "#3f5344" },
      { l: "Postgres", x: 0.22, y: 0.68, c: "#394236" },
      { l: "JWT / RBAC", x: 0.78, y: 0.68, c: "#594335" },
    ];
    const bx = ax;
    const bw = half;
    const bh = H - 150;
    roundRect(g, bx, 64, bw, bh, 4, UI.panel, UI.line);
    for (const n of nodes) {
      const appear = easeOut(seg(q, 0.34 + n.y, 0.5 + n.y));
      if (appear <= 0) continue;
      const nodeW = Math.max(48, n.l.length * 5.8 + 12);
      const nx = bx + bw * n.x - nodeW / 2;
      const ny = 64 + bh * n.y;
      roundRect(g, nx, ny, nodeW, 20, 4, n.c, UI.line);
      text(g, n.l, nx + nodeW / 2, ny + 10, `600 9px ${UI.mono}`, UI.text, "center", "middle");
    }
    g.strokeStyle = UI.faint;
    g.lineWidth = 1;
    const link = (i, j, at) => {
      const a = easeOut(seg(q, at, at + 0.14));
      if (a <= 0) return;
      g.globalAlpha = a2 * a;
      const A = nodes[i];
      const B = nodes[j];
      g.beginPath();
      g.moveTo(bx + bw * A.x, 64 + bh * A.y + 20);
      g.lineTo(bx + bw * B.x, 64 + bh * B.y);
      g.stroke();
      g.globalAlpha = a2;
    };
    link(0, 1, 0.42);
    link(1, 2, 0.5);
    link(1, 3, 0.56);
    g.globalAlpha = a2;
  }

  if (q > 0.7) {
    const a = easeOut(seg(q, 0.7, 0.9));
    g.globalAlpha = a;
    text(g, "CLIENT  →  API  →  POSTGRES   ·   AUTHZ  ·  VALIDATION  ·  AUDIT", 14, H - 22, `500 9px ${UI.mono}`, UI.dim, "left", "middle");
    g.globalAlpha = 1;
  }
}
