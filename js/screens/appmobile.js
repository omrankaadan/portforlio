import { UI, text, roundRect, easeOut, seg, PRODUCT } from "./ui.js";

const MODULES = [
  { title: "Vehicles", detail: "Find a record", tag: "CATALOG", color: UI.sage },
  { title: "Parts & stock", detail: "Review inventory", tag: "IMPORT / SEARCH", color: UI.clay },
  { title: "Appointments", detail: "Manage the schedule", tag: "WORKSHOP", color: UI.accent2 },
  { title: "Admin activity", detail: "Roles and history", tag: "AUDIT", color: UI.warn },
];

const STATUS_H = 20;
const NAV_H = 42;
const TAB_H = 48;

export function drawAppMobile(g, W, H, time, q) {
  g.fillStyle = UI.pageAlt;
  g.fillRect(0, 0, W, H);

  g.fillStyle = UI.navy;
  g.fillRect(0, 0, W, STATUS_H);
  text(g, "9:41", 12, STATUS_H / 2, `600 9px ${UI.mono}`, UI.page, "left", "middle");
  text(g, "•••", W - 26, STATUS_H / 2, `600 7px ${UI.mono}`, UI.page, "center", "middle");
  g.fillStyle = UI.page;
  g.fillRect(W - 18, STATUS_H / 2 - 3, 14, 6);
  g.fillStyle = UI.navy;
  g.fillRect(W - 16, STATUS_H / 2 - 1.6, 8 + Math.floor(time * 1.4) % 4, 3.2);

  const navA = easeOut(seg(q, 0.02, 0.2));
  g.save();
  g.globalAlpha = navA;
  g.fillStyle = UI.page;
  g.fillRect(0, STATUS_H, W, NAV_H);
  roundRect(g, 12, STATUS_H + 10, 20, 20, 5, UI.sageDeep);
  text(g, "G", 22, STATUS_H + 20, `700 12px ${UI.head}`, UI.page, "center", "middle");
  text(g, PRODUCT.name, 40, STATUS_H + 20, `700 12px ${UI.head}`, UI.ink, "left", "middle");
  roundRect(g, W - 74, STATUS_H + 11, 62, 18, 5, UI.pageAlt);
  text(g, "ADMIN", W - 43, STATUS_H + 20, `600 8px ${UI.mono}`, UI.sageDeep, "center", "middle");
  g.restore();

  const top = STATUS_H + NAV_H + 14;
  const heroH = H * 0.15;
  const heroA = easeOut(seg(q, 0.06, 0.25));
  g.save();
  g.globalAlpha = heroA;
  roundRect(g, 12, top, W - 24, heroH, 9, UI.navy);
  text(g, "WORKSHOP OVERVIEW", 24, top + heroH * 0.3, `600 9px ${UI.mono}`, "#b8c9ae", "left", "middle");
  text(g, "The work, in one place.", 24, top + heroH * 0.56, `700 ${Math.round(H * 0.027)}px ${UI.head}`, UI.page, "left", "middle");
  text(g, "A practical view of daily operations.", 24, top + heroH * 0.78, `400 9px ${UI.head}`, UI.muted, "left", "middle");
  g.restore();

  const sectionY = top + heroH + 24;
  text(g, "Operations", 16, sectionY, `700 14px ${UI.head}`, UI.ink, "left", "middle");
  text(g, "GARAGE PLATFORM", W - 16, sectionY, `500 8px ${UI.mono}`, UI.muted, "right", "middle");

  const cardH = Math.min(116, H * 0.105);
  const gap = 9;
  MODULES.forEach((item, i) => {
    const appear = easeOut(seg(q, i * 0.12, i * 0.12 + 0.24));
    if (appear <= 0) return;
    const y = sectionY + 15 + i * (cardH + gap);
    if (y + cardH > H - TAB_H - 8) return;
    g.save();
    g.globalAlpha = appear;
    g.translate(0, (1 - appear) * 10);
    roundRect(g, 12, y, W - 24, cardH, 8, UI.page, UI.border);
    roundRect(g, 24, y + 15, 4, cardH - 30, 2, item.color);
    text(g, item.tag, 38, y + cardH * 0.33, `600 8px ${UI.mono}`, UI.muted, "left", "middle");
    text(g, item.title, 38, y + cardH * 0.58, `700 12px ${UI.head}`, UI.ink, "left", "middle");
    text(g, item.detail, 38, y + cardH * 0.79, `400 9px ${UI.head}`, UI.inkSoft, "left", "middle");
    text(g, "›", W - 34, y + cardH * 0.56, `500 20px ${UI.head}`, item.color, "center", "middle");
    g.restore();
  });

  const tabA = easeOut(seg(q, 0.45, 0.72));
  g.globalAlpha = tabA;
  g.fillStyle = UI.page;
  g.fillRect(0, H - TAB_H, W, TAB_H);
  g.fillStyle = UI.border;
  g.fillRect(0, H - TAB_H, W, 1);
  ["Overview", "Vehicles", "Parts", "Admin"].forEach((label, i) => {
    const cx = (W / 4) * i + W / 8;
    const active = i === 0;
    g.strokeStyle = active ? UI.sageDeep : UI.muted;
    g.lineWidth = 1.5;
    g.strokeRect(cx - 5, H - TAB_H + 9, 10, 10);
    text(g, label, cx, H - TAB_H + 31, `${active ? "600" : "500"} 8px ${UI.mono}`, active ? UI.sageDeep : UI.muted, "center", "middle");
    if (active) {
      g.fillStyle = UI.sage;
      g.fillRect(cx - 8, H - 3, 16, 3);
    }
  });
  g.globalAlpha = 1;

  if (q > 0.93) {
    const a = easeOut(seg(q, 0.93, 1));
    g.globalAlpha = a;
    roundRect(g, W - 76, top + 9, 54, 20, 10, UI.navy);
    text(g, "LIVE", W - 49, top + 19, `600 8px ${UI.mono}`, "#c5d8ba", "center", "middle");
    g.globalAlpha = 1;
  }
}
