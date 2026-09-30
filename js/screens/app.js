import { UI, text, roundRect, easeOut, seg, PRODUCT } from "./ui.js";

const MODULES = [
  { name: "Vehicle catalog", detail: "Searchable records", tag: "VEHICLES", color: UI.sage },
  { name: "Parts inventory", detail: "Stock + spreadsheet import", tag: "INVENTORY", color: UI.clay },
  { name: "Appointments", detail: "Workshop schedule", tag: "SCHEDULE", color: UI.accent2 },
  { name: "Admin activity", detail: "Roles + audit history", tag: "ADMIN", color: UI.warn },
];

export function drawApp(g, W, H, time, q) {
  g.fillStyle = UI.pageAlt;
  g.fillRect(0, 0, W, H);

  const navH = Math.max(32, H * 0.065);
  g.fillStyle = UI.navy;
  g.fillRect(0, 0, W, navH);
  roundRect(g, 14, navH * 0.22, navH * 0.56, navH * 0.56, 4, UI.sage);
  text(g, "G", 14 + navH * 0.28, navH * 0.5, `700 ${Math.max(11, navH * 0.34)}px ${UI.head}`, UI.page, "center", "middle");
  text(g, PRODUCT.name, 22 + navH * 0.56, navH * 0.5, `700 ${Math.max(11, navH * 0.32)}px ${UI.head}`, UI.page, "left", "middle");

  const navX = W * 0.4;
  const navStep = Math.min(92, W * 0.115);
  PRODUCT.nav.forEach((label, i) => {
    text(g, label, navX + i * navStep, navH * 0.5, `500 ${Math.max(8, navH * 0.25)}px ${UI.head}`, i === 0 ? UI.page : "#b6b5aa", "left", "middle");
    if (i === 0) {
      g.fillStyle = UI.sage;
      g.fillRect(navX + i * navStep, navH * 0.79, Math.min(label.length * 5.2, navStep - 8), 2);
    }
  });
  roundRect(g, W - 82, navH * 0.2, 66, navH * 0.6, 5, "#34433b");
  text(g, "ADMIN", W - 49, navH * 0.5, `600 ${Math.max(8, navH * 0.23)}px ${UI.mono}`, "#d4dfce", "center", "middle");

  const pad = Math.max(14, W * 0.025);
  const heroY = navH + pad * 0.55;
  const heroH = H * 0.2;
  const heroA = easeOut(seg(q, 0.02, 0.22));
  g.save();
  g.globalAlpha = heroA;
  roundRect(g, pad, heroY, W - pad * 2, heroH, 8, UI.navy);
  const glow = g.createRadialGradient(W * 0.78, heroY + heroH * 0.2, 0, W * 0.78, heroY + heroH * 0.2, heroH * 1.5);
  glow.addColorStop(0, "rgba(135,169,127,0.24)");
  glow.addColorStop(1, "rgba(135,169,127,0)");
  g.fillStyle = glow;
  g.fillRect(pad, heroY, W - pad * 2, heroH);
  text(g, "WORKSHOP OVERVIEW", pad * 1.8, heroY + heroH * 0.31, `600 ${Math.max(9, H * 0.018)}px ${UI.mono}`, "#b8c9ae", "left", "middle");
  text(g, "The work, in one place.", pad * 1.8, heroY + heroH * 0.57, `700 ${Math.max(16, H * 0.045)}px ${UI.head}`, UI.page, "left", "middle");
  text(g, "Vehicles, parts and appointments — organized for the team.", pad * 1.8, heroY + heroH * 0.79, `400 ${Math.max(9, H * 0.019)}px ${UI.head}`, UI.muted, "left", "middle");
  g.restore();

  const sectionY = heroY + heroH + pad;
  text(g, "Operations", pad, sectionY, `700 ${Math.max(12, H * 0.026)}px ${UI.head}`, UI.ink, "left", "middle");
  text(g, "GARAGE MANAGEMENT", W - pad, sectionY, `500 ${Math.max(8, H * 0.016)}px ${UI.mono}`, UI.muted, "right", "middle");

  const cols = 2;
  const gap = Math.max(8, pad * 0.55);
  const cardW = (W - pad * 2 - gap) / cols;
  const cardH = Math.max(42, H * 0.14);
  const gridY = sectionY + pad * 0.65;
  MODULES.forEach((item, i) => {
    const appear = easeOut(seg(q, i * 0.12, i * 0.12 + 0.24));
    if (appear <= 0) return;
    const x = pad + (i % cols) * (cardW + gap);
    const y = gridY + Math.floor(i / cols) * (cardH + gap);
    g.save();
    g.globalAlpha = appear;
    roundRect(g, x, y, cardW, cardH, 7, UI.card, UI.border);
    roundRect(g, x + 12, y + 12, 6, cardH - 24, 3, item.color);
    text(g, item.tag, x + 28, y + cardH * 0.34, `600 ${Math.max(8, H * 0.016)}px ${UI.mono}`, UI.muted, "left", "middle");
    text(g, item.name, x + 28, y + cardH * 0.62, `700 ${Math.max(11, H * 0.024)}px ${UI.head}`, UI.ink, "left", "middle");
    text(g, item.detail, x + 28, y + cardH * 0.82, `400 ${Math.max(8, H * 0.017)}px ${UI.head}`, UI.inkSoft, "left", "middle");
    text(g, "↗", x + cardW - 16, y + cardH * 0.5, `600 ${Math.max(10, H * 0.024)}px ${UI.head}`, item.color, "center", "middle");
    g.restore();
  });

  const stackA = easeOut(seg(q, 0.42, 0.7));
  if (stackA > 0) {
    const y = gridY + cardH * 2 + gap + pad * 0.4;
    g.globalAlpha = stackA;
    roundRect(g, pad, y, W - pad * 2, Math.max(28, H * 0.075), 6, UI.page, UI.border);
    text(g, "BUILT WITH", pad * 1.8, y + H * 0.0375, `600 ${Math.max(8, H * 0.016)}px ${UI.mono}`, UI.muted, "left", "middle");
    text(g, "React  ·  Express  ·  PostgreSQL  ·  JWT", pad * 1.8 + W * 0.16, y + H * 0.0375, `600 ${Math.max(9, H * 0.019)}px ${UI.head}`, UI.ink, "left", "middle");
    g.globalAlpha = 1;
  }

  const pulse = 0.7 + 0.3 * Math.sin(time * 1.8);
  g.fillStyle = `rgba(111,138,114,${pulse.toFixed(2)})`;
  g.beginPath();
  g.arc(W - pad * 2.2, H - 12, 3, 0, Math.PI * 2);
  g.fill();
  text(g, "PRODUCTION", W - pad, H - 12, `600 ${Math.max(8, H * 0.016)}px ${UI.mono}`, UI.inkSoft, "right", "middle");
}
