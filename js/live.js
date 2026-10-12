/* ============================================================
   PADUK SHOP — live layer
   ดึงข้อมูลจริงจาก API (localhost:3000/api/data หรือ Vercel)
   แล้วอัปเดตข้อมูลใน app.js (accounts / characters / drops)
   ถ้าเชื่อม API ไม่ได้ → ใช้ mock data เดิมต่อไป (fallback)
   ============================================================ */
(function () {
  "use strict";

  const API_BASE = ""; // relative → /api/... บน origin เดียวกัน (localhost หรือ Vercel)
  const DATA_ENDPOINT = API_BASE + "/api/data";
  const REFRESH_MS = 5000;
  let lastPacket = null;

  /* ---- Roblox thumbnails: ขอผ่าน /api/thumb ของ server เราเอง (กัน CORS) ---- */
  /* server จะยิงไป thumbnails.roblox.com แล้วคืน { assetId: cdnUrl } กลับมา */
  const thumbCache = new Map();
  const thumbWaiters = new Map(); /* assetId → [cb] รอ batch */
  let thumbTimer = null;
  function thumbUrl(assetId, w, h, cb) {
    const id = String(assetId || "").replace(/\D/g, "");
    if (!id || id.length < 4) { cb(""); return; }
    if (thumbCache.has(id)) { cb(thumbCache.get(id)); return; }
    if (!thumbWaiters.has(id)) thumbWaiters.set(id, []);
    thumbWaiters.get(id).push(cb);
    /* รวม request ที่ขอในช่วงเวลาใกล้กันเป็น batch เดียว */
    if (thumbTimer) return;
    thumbTimer = setTimeout(function () {
      thumbTimer = null;
      const batch = [...thumbWaiters.keys()];
      const waiters = new Map(thumbWaiters);
      thumbWaiters.clear();
      if (!batch.length) return;
      fetch("/api/thumb?ids=" + batch.join(",") + "&size=420x420")
        .then(r => r.json())
        .then(j => {
          const data = (j && j.data) || {};
          batch.forEach(function (id2) {
            const url = data[id2] || "";
            thumbCache.set(id2, url);
            (waiters.get(id2) || []).forEach(function (cb2) { cb2(url); });
          });
        })
        .catch(() => {
          batch.forEach(function (id2) { thumbCache.set(id2, ""); (waiters.get(id2) || []).forEach(cb2 => cb2("")); });
        });
    }, 30);
  }
  function rbxThumb(assetId, w, h) { return ""; } /* sync เดิมไม่ใช้แล้ว — ใช้ thumbUrl แทน */

  function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
  function str(v) { return v == null ? "" : String(v); }

  /* ---- Tier ของเกม → ระดับความหายาก (ตาม RarityBox ของเกมจริง) ---- */
  const TIER_RARITY = { 1: "Common", 2: "Epic", 3: "Legendary", 4: "Mythic", 5: "Arcane", 6: "Zenless" };
  function rarityFromTier(t) { return TIER_RARITY[num(t)] || "Common"; }

  /* ---- โหลดรูปเสร็จแล้ววาดใหม่แบบไม่ถี่เกิน (throttle) ---- */
  let uiPending = false;
  function scheduleUI() {
    if (uiPending) return;
    uiPending = true;
    setTimeout(function () { uiPending = false; refreshUI(); }, 120);
  }

  /* ---- map ข้อมูล live -> หน้าเว็บ ---- */
  function applyLive(live) {
    if (!live) return;
    const gc = live.gameConfig || null;
    /* เก็บ config จากเกม (trait/evo/skilltree/rarity) ไว้ให้ app.js ใช้ */
    if (gc) {
      window.GAME_CONFIG = gc;
      window.TRAIT_MAP = {};
      (gc.traits || []).forEach(function (t) { window.TRAIT_MAP[String(t.id)] = t; });
      window.MATERIAL_DEFS = gc.materialDefs || {};
      window.EVO_CONFIG = gc.evolution || {};
      window.CHAR_RARITY = gc.characterRarity || {};
      window.SKILLTREE_CONFIG = gc.skillTree || null;
    }
    if (!live) return;
    const acc = live.account || {};
    const chars = live.characters || [];
    const ms = live.matchStats || {};
    const cur = acc.currencies || {};
    const lvItems = live.items || [];

    // อัปเดตบัญชี (บัญชีเดียวที่สร้างไว้ หรือสร้างใหม่)
    const first = window.accounts && window.accounts[0];
    if (first) {
      first.username = (live.player && live.player.username) || first.username;
      first.level = (live.player && (live.player.level || live.player.leaderstatsLevel)) || (chars.find(c=>c.active)||{}).level || first.level;
      first.characters = chars.filter(c=>!c.locked).length || first.characters;
      first.kills = num(ms.kills) || first.kills;
      first.wave = Math.min(99, num(ms.wins) * 2) || first.wave;
      first.items = chars.length && first.items ? Math.max(first.items, chars.length) : first.items;
      first.lastUpdate = Date.now();
      first.progress = Math.min(99, first.progress || 0);
    }

    // แทน characters ด้วยของจริง (มีรูป)
    if (chars.length) {
      // เติม CHAR_IMAGES (rawName → assetId) สำหรับ renderCharCard
      chars.forEach(function (c) {
        if (c.assetId) window.CHAR_IMAGES[c.name] = c.assetId;
      });
      window.characters = chars.map(function (c) {
        const raw = c.name || "";
        const display = c.displayName || (raw ? raw[0].toUpperCase() + raw.slice(1) : "?");
        const tag = (raw === (live.account && live.account.selectedCharacter));
        const aid = c.assetId || (window.CHAR_IMAGES && window.CHAR_IMAGES[raw]) || "";
        const traitDef = (window.TRAIT_MAP && window.TRAIT_MAP[String(c.traitId || "")]) || null;
        return {
          name: display,
          rawName: raw,
          element: "—",
          rarity: (window.CHAR_RARITY && window.CHAR_RARITY[raw]) || (tag ? "MYTHIC" : "LEGENDARY"),
          level: c.level || 1,
          stage: tag ? "Stage ∞" : ((c.xp || 0) > 0 ? "Unlocked" : "Locked"),
          xp: Math.min(100, (num(c.xp) / 100000) * 100) || 0,
          ult: !!c.ultimate,
          active: !!c.active,
          locked: !c.active && !(num(c.xp) > 0),
          trait: c.trait || "—",
          traitId: num(c.traitId),
          traitInfo: traitDef ? { name: traitDef.name, rarity: traitDef.rarity, icon: traitDef.icon, buffType: traitDef.buffType, buffPercent: traitDef.buffPercent } : null,
          skills: c.skills || {},
          evo: !!c.ultimate,
          image: "",
          assetId: aid
        };
      });
      // โหลดรูปตัวละครแบบ async (thumbnails API) แล้ววาดใหม่เมื่อได้ URL
      window.characters.forEach(function (c) {
        thumbUrl(c.assetId, 420, 420, function (url) { if (url) { c.image = url; scheduleUI(); } });
      });
    }

    // อัปเดต currencies/สถิติยังถูก render ใน renderEconomy (คงไว้ mock UI)
    // เก็บไอเทมกระเป๋าจริง (มีรูป) ไว้ใน window.inventoryItems สำหรับ renderDrops
    window.liveInventory = lvItems.map(function(it){
      return {
        name: it.name || ("Material " + it.id),
        amount: num(it.count),
        rarity: rarityFromTier(it.tier),
        map: "Anime Zero กระเป๋า",
        image: (it.image && it.image.indexOf("http") !== 0) ? it.image : "",
        assetId: it.icon || "",
        matId: String(it.id || "")
      };
    });
    // รูป local (assets/icons/<id>.png) มาพร้อม payload → ใช้เลย
    // ถ้าไม่มี ค่อยลอง thumbnails API (เผื่อ asset public)
    window.liveInventory.forEach(function (it) {
      if (it.image) return;
      thumbUrl(it.assetId, 420, 420, function (url) { if (url) { it.image = url; scheduleUI(); } });
    });
    window.livePacket = { account: acc, characters: chars, matchStats: ms, currencies: cur, player: live.player, items: lvItems, rarityColors: live.rarityColors || null, gameConfig: gc, itemsById: live.itemsById || null, run: live.run || null, runHistory: live.runHistory || null, character: live.character || null, equippedAccessories: (acc && acc.equippedAccessories) || null };
    // อัปเดตสีระดับความหายากจากเกมจริง (object เดียวกับที่ app.js ใช้ render)
    if (live.rarityColors && window.RARITY_COLORS) {
      for (const k in live.rarityColors) window.RARITY_COLORS[k] = live.rarityColors[k];
    }
  }

  /* ---- เรียกใช้เฟรมเวิร์กของ app --- */
  function refreshUI() {
    try {
      var st = window.state;
      if (!st) return; /* app.js ยังโหลดไม่เสร็จ */
      var ae = document.activeElement;
      var typing = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA");
      if (typing) return; /* กำลังพิมพ์ → รอรอบหน้า กันโฟกัสหาย */
      if (st.page === "detail") {
        /* วาดเฉพาะ tab ที่เปิดอยู่ กันโฟกัส/สกอลล์หายตอน live data มาอัปเดต */
        if (typeof window.showTab === "function") window.showTab(st.detailTab);
        else if (typeof window.renderDetail === "function") window.renderDetail();
      } else if (st.page === "public") {
        if (typeof window.renderPublic === "function") window.renderPublic();
      } else if (st.dashboardMode === "workspace") {
        if (typeof window.renderStats === "function") window.renderStats();
        if (typeof window.renderAccounts === "function") window.renderAccounts();
      }
    } catch (e) { console.warn("[live.js]", e); }
  }

  /* ---- fetch API ---- */
  async function fetchLive() {
    try {
      const res = await fetch(DATA_ENDPOINT, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const live = data && (data.payload ? data.payload.live : data.live);
      if (!live) throw new Error("bad payload");
      applyLive(live);
      lastPacket = data;
      refreshUI();
      document.body.classList.add("has-live");
      const dot = document.querySelector(".live-indicator");
      if (dot) dot.innerHTML = '<span class="dot pulse"></span> LIVE · REAL DATA';
    } catch (e) {
      document.body.classList.remove("has-live");
      // fallback: ใช้ mock data ต่อไป (ไม่รบกวน)
    }
  }

  /* ---- เริ่มต้น ---- */
  window.CHAR_IMAGES = {}; // จะเติมจาก live.js ด้วยชื่อ→assetId mapping
  window.PADUK = {
    fetch: fetchLive,
    rbxThumb: rbxThumb
  };

  // รอให้ app.js โหลดเสร็จก่อนยิง fetch ครั้งแรก
  window.addEventListener("load", function () {
    fetchLive();
    setInterval(fetchLive, REFRESH_MS);
  });
})();
