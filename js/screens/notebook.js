import { UI, text, roundRect, easeOut, seg, PRODUCT } from "./ui.js";

const TABS = ["sketch", "schema", "tasks"];
let activeTab = 0;

export function drawNotebook(g, W, H, time, q) {
  g.fillStyle = "#f7f4ec";
  g.fillRect(0, 0, W, H);

  g.strokeStyle = "#e3ddcd";
  g.lineWidth = 1;
  for (let y = 26; y < H; y += 22) {
    g.beginPath();
    g.moveTo(0, y + 0.5);
    g.lineTo(W, y + 0.5);
    g.stroke();
  }
  g.strokeStyle = "#ef9a9a";
  g.beginPath();
  g.moveTo(34.5, 0);
  g.lineTo(34.5, H);
  g.stroke();

  g.fillStyle = "rgba(247,244,236,0.94)";
  g.fillRect(0, 0, W, 22);
  g.fillStyle = "#e3ddcd";
  g.fillRect(0, 21, W, 1);

  const tabW = 58;
  TABS.forEach((t, i) => {
    const tx = 6 + i * (tabW + 4);
    const on = i === activeTab;
    roundRect(g, tx, 3, tabW, 16, 3, on ? "#ffffff" : "rgba(0,0,0,0.04)", on ? "#cfc8b6" : "transparent");
    text(g, t, tx + tabW / 2, 11, `${on ? "600" : "500"} 9px ${UI.mono}`, on ? "#1f2937" : "#9ca3af", "center", "middle");
  });

  g.save();
  g.beginPath();
  g.rect(0, 22, W, H - 22);
  g.clip();

  if (activeTab === 0) drawSketch(g, W, H, q);
  else if (activeTab === 1) drawSchema(g, W, H, q);
  else drawTasks(g, W, H, q);

  g.restore();
}

function drawSketch(g, W, H, q) {
  text(g, "operations flow", 42, 36, `600 11px ${UI.head}`, UI.ink, "left", "middle");
  g.strokeStyle = "#9ca3af";
  g.lineWidth = 1.4;
  roundRect(g, 42, 48, 62, 34, 4, "transparent", "#6b7280");
  text(g, "admin", 73, 65, `500 9px ${UI.mono}`, UI.inkSoft, "center", "middle");

  const boxes = [
    { l: "vehicles", x: 132, y: 48 },
    { l: "parts", x: 222, y: 48 },
    { l: "stock", x: 222, y: 116 },
    { l: "schedule", x: 132, y: 116 },
  ];
  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    const a = easeOut(seg(q, 0.1 + i * 0.12, 0.34 + i * 0.12));
    if (a <= 0) break;
    g.globalAlpha = a;
    roundRect(g, b.x, b.y, 62, 34, 4, "transparent", "#6b7280");
    text(g, b.l, b.x + 31, b.y + 17, `500 9px ${UI.mono}`, UI.inkSoft, "center", "middle");
    g.globalAlpha = 1;
  }

  g.strokeStyle = "#4b5563";
  g.lineWidth = 1.2;
  const link = (x1, y1, x2, y2, at) => {
    const a = easeOut(seg(q, at, at + 0.18));
    if (a <= 0) return;
    g.globalAlpha = a;
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x1 + (x2 - x1) * a, y1 + (y2 - y1) * a);
    g.stroke();
    g.globalAlpha = 1;
  };
  link(104, 65, 132, 65, 0.2);
  link(194, 65, 222, 65, 0.3);
  link(253, 82, 253, 116, 0.42);
  link(222, 133, 194, 133, 0.54);

  text(g, "→", 112, 65, `600 10px ${UI.mono}`, "#4b5563", "center", "middle");

  const cy = 178;
  text(g, "layout — 390px", 42, cy, `600 10px ${UI.head}`, "#1f2937", "left", "middle");
  g.strokeStyle = "#6b7280";
  roundRect(g, 42, cy + 12, 66, 118, 5, "transparent", "#6b7280");
  const rowAppear = easeOut(seg(q, 0.5, 0.8));
  if (rowAppear > 0) {
    g.globalAlpha = rowAppear;
    g.fillStyle = "rgba(111,138,114,0.18)";
    g.fillRect(47, cy + 18, 56, 16);
    for (let i = 0; i < 4; i++) {
      g.fillStyle = "rgba(84,80,74,0.12)";
      g.fillRect(47, cy + 40 + i * 21, 56, 15);
    }
    g.globalAlpha = 1;
  }
}

function drawSchema(g, W, H, q) {
  const tables = [
    { l: "users", cols: ["id", "email", "role"], x: 16, y: 34 },
    { l: "vehicles", cols: ["id", "make", "model"], x: 132, y: 34 },
    { l: "appointments", cols: ["id", "vehicle_id", "date"], x: 16, y: 116 },
    { l: "parts", cols: ["id", "sku", "stock"], x: 132, y: 116 },
  ];
  g.strokeStyle = "#6b7280";
  g.lineWidth = 1.2;
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    const a = easeOut(seg(q, i * 0.14, 0.3 + i * 0.14));
    if (a <= 0) break;
    g.globalAlpha = a;
    const w = 100;
    const h = 22 + t.cols.length * 15;
    roundRect(g, t.x, t.y, w, h, 3, "transparent", "#6b7280");
    g.fillStyle = "rgba(111,138,114,0.16)";
    g.fillRect(t.x + 1, t.y + 1, w - 2, 20);
    text(g, t.l, t.x + w / 2, t.y + 11, `600 9.5px ${UI.mono}`, "#1f2937", "center", "middle");
    t.cols.forEach((c, k) => {
      text(g, c, t.x + 8, t.y + 30 + k * 15, `500 8.5px ${UI.mono}`, "#4b5563", "left", "middle");
    });
    g.globalAlpha = 1;
  }
  const rel = (ax, ay, bx, by, at) => {
    const a = easeOut(seg(q, at, at + 0.16));
    if (a <= 0) return;
    g.globalAlpha = a;
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(ax + (bx - ax) * a, ay + (by - ay) * a);
    g.stroke();
    g.globalAlpha = 1;
  };
  rel(66, 78, 66, 116, 0.55);
  rel(182, 78, 182, 116, 0.65);
}

function drawTasks(g, W, H, q) {
  const tasks = [
    "React admin workspace",
    "Express REST API",
    "Vehicle + parts catalog",
    "Inventory + Excel import",
    "Appointments",
    "JWT roles + validation",
    "Audit log + image uploads",
    "Production deployment",
  ];
  text(g, "sprint 04", 16, 34, `600 11px ${UI.head}`, "#1f2937", "left", "middle");
  for (let i = 0; i < tasks.length; i++) {
    const a = easeOut(seg(q, i * 0.07, 0.2 + i * 0.07));
    if (a <= 0) break;
    g.globalAlpha = a;
    const y = 54 + i * 19;
    const done = q > (i + 1) / (tasks.length + 1);
    g.strokeStyle = "#6b7280";
    g.lineWidth = 1.3;
    g.strokeRect(18, y - 6, 11, 11);
    if (done) {
      g.strokeStyle = UI.sageDeep;
      g.lineWidth = 1.8;
      g.beginPath();
      g.moveTo(20.5, y - 0.5);
      g.lineTo(23, y + 2.5);
      g.lineTo(27.5, y - 4);
      g.stroke();
    }
    text(g, tasks[i], 36, y, `500 10px ${UI.mono}`, done ? UI.muted : UI.inkSoft, "left", "middle");
    if (done) {
      g.strokeStyle = UI.muted;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(36, y);
      g.lineTo(36 + g.measureText(tasks[i]).width * 1.0, y);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  text(g, `${Math.round(q * tasks.length)}/${tasks.length}`, W - 16, 34, `600 10px ${UI.mono}`, UI.sageDeep, "right", "middle");
}
