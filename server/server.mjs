// ============================================================
// PADUK SHOP — Node/Express local server (สำหรับค่อยย้ายไป Vercel)
// รันบนเครื่องที่มี Node:  npm install express  แล้ว  node server.mjs
// หรือใช้กับ vercel dev ได้โดยไม่ต้องใช้ไฟล์นี้ (ดู api/*.mjs)
// ============================================================
import express from "express";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(__dirname, "..");
const DATA_DIR = join(__dirname, "data");
const DATA_FILE = join(DATA_DIR, "latest.json");

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: "12mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

let liveData = null;
if (existsSync(DATA_FILE)) {
  try { liveData = JSON.parse(readFileSync(DATA_FILE, "utf8")); } catch { liveData = null; }
}

const HISTORY_MAX = 20; // เก็บประวัติรันสูงสุด (append-only: ต่อท้ายของเดิม)

/* ---- runHistory: append-only merge (รอบใหม่ต่อท้าย/ขึ้นหัวของเดิม ไม่ลบของเก่า) ---- */
function mergeRunHistory(prev, next) {
  const a = (Array.isArray(prev) ? prev : []).filter((e) => e && e.id);
  const b = (Array.isArray(next) ? next : []).filter((e) => e && e.id);
  if (!b.length) return a; // ไม่มีรอบใหม่ → คงของเดิมทั้งหมด
  const seen = new Set(a.map((e) => e.id));
  const fresh = [];
  for (const entry of b) {
    if (seen.has(entry.id)) continue; // เคยบันทึกแล้ว → ข้าม
    seen.add(entry.id);
    fresh.push(entry);
  }
  return [...fresh, ...a].slice(0, HISTORY_MAX); // ใหม่สุดขึ้นหัว ต่อท้ายด้วยของเดิม
}

app.post("/api/ingest", (req, res) => {
  try {
    const payload = req.body;
    if (!payload) return res.status(400).json({ ok: false, error: "empty body" });
    // merge: ถ้า payload ใหม่ไม่มี items/rarityColors แต่ข้อมูลเดิมมี → คงไว้
    // (กันสคริปต์เวอร์ชันเก่าในเกมยังรันอยู่แล้วเขียนทับทิ้ง)
    try {
      const prevLive = liveData && liveData.payload && liveData.payload.live;
      const newLive = payload.live || (payload.live = {});
      if ((!Array.isArray(newLive.items) || !newLive.items.length) && prevLive && Array.isArray(prevLive.items) && prevLive.items.length) {
        newLive.items = prevLive.items;
      }
      if (!newLive.rarityColors && prevLive && prevLive.rarityColors) {
        newLive.rarityColors = prevLive.rarityColors;
      }
      if (!newLive.itemsById && prevLive && prevLive.itemsById) {
        newLive.itemsById = prevLive.itemsById;
      }
      if (!newLive.gameConfig && prevLive && prevLive.gameConfig) {
        newLive.gameConfig = prevLive.gameConfig;
      }
      // runHistory: append-only — รวมรอบใหม่เข้ากับของเดิม (cap HISTORY_MAX)
      if (prevLive && Array.isArray(prevLive.runHistory)) {
        newLive.runHistory = mergeRunHistory(prevLive.runHistory, newLive.runHistory);
      } else if (!Array.isArray(newLive.runHistory)) {
        newLive.runHistory = [];
      }
    } catch { /* merge fail ก็ส่งของใหม่ตามปกติ */ }
    const packet = { ok: true, receivedAt: new Date().toISOString(), payload };
    liveData = packet;
    writeFileSync(DATA_FILE, JSON.stringify(packet, null, 2), "utf8");
    console.log("[INGEST]", new Date().toLocaleTimeString(), "received");
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
});

app.get("/api/data", (req, res) => {
  if (liveData) return res.json(liveData);
  res.status(404).json({ ok: false, error: "no data yet" });
});

/* ---- /api/thumb: proxy รูป asset จาก Roblox (กัน CORS) ---- */
const thumbMemCache = new Map(); // key "id:size" → { url, ts }
const THUMB_TTL = 6 * 60 * 60 * 1000; // 6 ชม.
app.get("/api/thumb", async (req, res) => {
  try {
    const ids = String(req.query.ids || "").split(",").map((s) => s.replace(/\D/g, "")).filter((s) => s.length >= 4).slice(0, 60);
    const size = String(req.query.size || "150x150").match(/^\d+x\d+$/) ? String(req.query.size) : "150x150";
    if (!ids.length) return res.json({ data: {} });
    const data = {};
    const need = [];
    for (const id of ids) {
      const key = id + "@" + size;
      const hit = thumbMemCache.get(key);
      if (hit && Date.now() - hit.ts < THUMB_TTL) { data[id] = hit.url; }
      else need.push(id);
    }
    if (need.length) {
      const url = `https://thumbnails.roproxy.com/v1/assets?assetIds=${need.join(",")}&size=${size}&format=Png&isCircular=false`;
      const r = await fetch(url, { headers: { accept: "application/json" } });
      if (!r.ok) throw new Error("roproxy HTTP " + r.status);
      const j = await r.json();
      for (const d of j.data || []) {
        if (d.state === "Completed" && d.imageUrl) {
          data[d.targetId] = d.imageUrl;
          thumbMemCache.set(d.targetId + "@" + size, { url: d.imageUrl, ts: Date.now() });
        } else {
          data[d.targetId] = "";
        }
      }
      for (const id of need) if (!(id in data)) data[id] = "";
    }
    res.set("Cache-Control", "public, max-age=300");
    res.json({ ok: true, data });
  } catch (e) {
    res.status(502).json({ ok: false, error: String(e), data: {} });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, service: "paduk-shop" }));

// static web
app.use(express.static(WEB_ROOT, { extensions: ["html"] }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PADUK SHOP server -> http://127.0.0.1:${PORT}`);
});
