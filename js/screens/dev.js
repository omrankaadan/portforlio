import { UI, text, roundRect, easeOut, seg } from "./ui.js";
import { codeLines, terminalLines } from "./product.js";

const NAV_Y = 26;

export function drawEditor(g, W, H, time, q) {
  g.fillStyle = UI.bg;
  g.fillRect(0, 0, W, H);

  g.fillStyle = "#12161c";
  g.fillRect(0, 0, W, NAV_Y);
  g.strokeStyle = UI.line;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(0, NAV_Y + 0.5);
  g.lineTo(W, NAV_Y + 0.5);
  g.stroke();

  const dots = ["#f87171", "#f0b429", "#4ade80"];
  dots.forEach((c, i) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(14 + i * 12, NAV_Y / 2, 3.4, 0, 6.283);
    g.fill();
  });
  text(g, "garage-platform — client + API", W / 2, NAV_Y / 2, `500 10px ${UI.mono}`, UI.dim, "center", "middle");

  const TREE_W = Math.min(122, W * 0.28);
  g.fillStyle = "#12161c";
  g.fillRect(0, NAV_Y, TREE_W, H - NAV_Y);
  g.fillStyle = UI.line;
  g.fillRect(TREE_W - 1, NAV_Y, 1, H - NAV_Y);

  const files = [
    { n: "src", d: 1, open: true },
    { n: "components", d: 2, open: true },
    { n: "VehicleCatalog.jsx", d: 3, a: true },
    { n: "PartsInventory.jsx", d: 3, a: q > 0.3 },
    { n: "AppointmentList.jsx", d: 3, a: q > 0.5 },
    { n: "AdminPanel.jsx", d: 3, a: q > 0.7 },
    { n: "api.js", d: 2 },
    { n: "auth.js", d: 2 },
    { n: "server/", d: 1 },
    { n: "routes/", d: 2 },
    { n: "App.jsx", d: 1 },
    { n: "package.json", d: 1 },
  ];
  let fy = NAV_Y + 12;
  for (const f of files) {
    if (!f.a) continue;
    const a = easeOut(seg(q, (f.d - 1) * 0.06, (f.d - 1) * 0.06 + 0.3));
    if (a <= 0.01) continue;
    g.globalAlpha = a;
    const x = 8 + f.d * 8;
    const isDir = !/\.(jsx?|json|css)$/.test(f.n);
    text(g, f.n, x, fy, `500 9.5px ${UI.mono}`, isDir ? UI.text : UI.dim, "left", "middle");
    if (isDir) text(g, f.open ? "▾" : "▸", x - 6, fy, `500 8px ${UI.mono}`, UI.faint, "left", "middle");
    fy += 14;
    g.globalAlpha = 1;
  }

  const GX = TREE_W;
  const code = codeLines(q);
  const lh = 12.5;
  const visible = Math.floor((H - NAV_Y - 16) / lh);

  g.fillStyle = "#0d1015";
  g.fillRect(GX + 34, NAV_Y, 32, H - NAV_Y);
  for (let i = 0; i < visible; i++) {
    text(g, String(i + 1), GX + 28, NAV_Y + 14 + i * lh, `500 9px ${UI.mono}`, UI.faint, "right", "middle");
  }

  g.fillStyle = UI.panel;
  g.fillRect(GX, 0, 34, H);
  g.fillStyle = UI.line;
  g.fillRect(GX + 33, 0, 1, H);

  g.save();
  g.beginPath();
  g.rect(GX + 34, NAV_Y, W - GX - 34, H - NAV_Y);
  g.clip();

  const typePos = Math.floor(q * code.length * 3) % (code.length + 1);
  let typedChars = 0;
  for (let i = 0; i < Math.min(code.length, visible); i++) {
    const l = code[i];
    const y = NAV_Y + 14 + i * lh;
    if (i === typePos && q < 0.99) {
      const partial = codeLines(q + 0.02)[i];
      if (partial) drawTokenLine(g, partial.t, GX + 42, y, l.k, codeLines(Math.min(1, q + 0.06)).length > i + 1);
      const caretOn = Math.floor(time * 2.2) % 2 === 0;
      if (caretOn) {
        g.font = `500 9.5px ${UI.mono}`;
        const w = g.measureText(l.t.slice(0, Math.min(l.t.length, typedChars + 8))).width;
        g.fillStyle = UI.accent;
        g.fillRect(GX + 42 + w, y - 6, 1.4, 9);
      }
      break;
    }
    drawTokenLine(g, l.t, GX + 42, y, l.k, true);
  }
  g.restore();

  g.fillStyle = "#12161c";
  g.fillRect(0, H - 20, W, 20);
  g.fillStyle = UI.line;
  g.fillRect(0, H - 20, W, 1);
  text(g, "main", 10, H - 10, `500 9px ${UI.mono}`, UI.faint, "left", "middle");
  text(g, q > 0.85 ? "features connected" : "working tree", W - 10, H - 10, `500 9px ${UI.mono}`, q > 0.85 ? UI.ok : UI.dim, "right", "middle");
}

function drawTokenLine(g, src, x, y, kind, full) {
  const KEYWORDS = ["import", "from", "export", "default", "function", "const", "let", "return", "async", "await", "class", "new", "catch", "useState", "useEffect"];
  g.font = `500 9.5px ${UI.mono}`;
  g.textAlign = "left";
  g.textBaseline = "middle";
  const parts = src.split(/([A-Za-z_$][\w$]*|'[^']*'|"[^"]*")/g).filter((s) => s !== undefined && s !== "");
  let cx = x;
  for (const p of parts) {
    g.fillStyle = UI.text;
    if (KEYWORDS.includes(p)) g.fillStyle = UI.accent2;
    else if (/^'[^']*'$/.test(p)) g.fillStyle = UI.ok;
    else if (/^\d/.test(p)) g.fillStyle = UI.warn;
    else if (p === "'react'" || p === "'./api'") g.fillStyle = UI.ok;
    g.fillText(p, cx, y);
    cx += g.measureText(p).width;
  }
}

export function drawTerminal(g, W, H, time, q, shipped) {
  g.fillStyle = "#0b0d11";
  g.fillRect(0, 0, W, H);

  g.fillStyle = "#12161c";
  g.fillRect(0, 0, W, 22);
  g.fillStyle = UI.line;
  g.fillRect(0, 22, W, 1);
  text(g, "zsh — garage-platform", 10, 11, `500 9.5px ${UI.mono}`, UI.dim, "left", "middle");

  const all = terminalLines(q, shipped);
  const lh = 13;
  const maxRows = Math.floor((H - 40) / lh);
  const lines = all.slice(Math.max(0, all.length - maxRows));

  g.font = `500 10px ${UI.mono}`;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const y = 40 + i * lh;
    let color = "#c8d3e0";
    if (l.startsWith("$")) color = UI.accent;
    else if (l.includes("✓")) color = UI.ok;
    else if (l.includes("➜") || l.includes("deployed") || l.includes("deploying")) color = UI.accent2;
    else if (l.startsWith("  ")) color = UI.dim;
    text(g, l, 10, y, `500 10px ${UI.mono}`, color, "left", "middle");
  }

  const cursorOn = Math.floor(time * 2.4) % 2 === 0;
  if (cursorOn) {
    const last = lines[lines.length - 1] || "";
    g.font = `500 10px ${UI.mono}`;
    const w = g.measureText(last).width;
    g.fillStyle = UI.accent;
    g.fillRect(12 + w, 40 + (lines.length - 1) * lh - 5, 6, 9);
  }
}

export function drawIdle(g, W, H, time) {
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#f5dfbd");
  sky.addColorStop(0.62, "#f3e6d0");
  sky.addColorStop(1, "#d9d2b8");
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  const sunX = W * (0.73 + Math.sin(time * 0.12) * 0.012);
  const sunY = H * 0.34;
  const sunR = Math.min(W, H) * 0.16;
  const halo = g.createRadialGradient(sunX, sunY, sunR * 0.35, sunX, sunY, sunR * 2.3);
  halo.addColorStop(0, "rgba(246, 190, 126, 0.34)");
  halo.addColorStop(1, "rgba(246, 190, 126, 0)");
  g.fillStyle = halo;
  g.fillRect(0, 0, W, H);

  g.fillStyle = "#e9b987";
  g.beginPath();
  g.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = "#bdc39b";
  g.beginPath();
  g.moveTo(0, H * 0.7);
  g.bezierCurveTo(W * 0.24, H * 0.57, W * 0.39, H * 0.75, W * 0.62, H * 0.65);
  g.bezierCurveTo(W * 0.8, H * 0.58, W * 0.9, H * 0.66, W, H * 0.61);
  g.lineTo(W, H);
  g.lineTo(0, H);
  g.closePath();
  g.fill();

  g.fillStyle = "#849579";
  g.beginPath();
  g.moveTo(0, H * 0.83);
  g.bezierCurveTo(W * 0.21, H * 0.72, W * 0.41, H * 0.9, W * 0.67, H * 0.78);
  g.bezierCurveTo(W * 0.83, H * 0.7, W * 0.92, H * 0.77, W, H * 0.73);
  g.lineTo(W, H);
  g.lineTo(0, H);
  g.closePath();
  g.fill();
}
