# PADUK SHOP — เอกสารวิเคราะห์โปรเจกต์ฉบับเต็ม (สำหรับให้ GPT วิเคราะห์ต่อ)

> เขียนโดย Cline หลังตรวจสอบโค้ดจริงทุกไฟล์ในโปรเจกต์ (วันที่ 2026-10-12)
> ตำแหน่งไฟล์และเลขบรรทัดทั้งหมดอ้างอิงจากโค้ดจริง ไม่มีการเดา
> โปรเจกต์อยู่ที่: `c:\Users\patta\Downloads\paduk-shop-vscode`
> ขณะวิเคราะห์: server กำลังรันอยู่ที่ http://127.0.0.1:3000 (ยืนยันจาก GET /api/data ได้ข้อมูลจริง)

---

## 1. โครงสร้างโปรเจกต์ (tree จริง)

```
paduk-shop-vscode/
├── index.html                  หน้าเว็บหลัก (template เดิม + id สำหรับ JS)
├── css/styles.css              ธีมทั้งหมด
├── js/app.js                   UI ทั้งหมด + mock data (บรรทัด 1-4) + render ทุก tab
├── js/live.js                  ชั้นดึงข้อมูลจริงจาก /api/data มาแทน mock (fallback ถ้า API ล่ม)
├── assets/anime-zero.png       ภาพการ์ดเกม
├── assets/icons/*.png          รูปไอคอนไอเทม 10 ไฟล์ (server เขียนจาก base64 ที่ bridge ส่งมา)
├── roblox_agent/
│   └── paduk_bridge.luau       ★ สคริปต์รันในเกม Roblox (executor) — โคเรของระบบ (786 บรรทัด)
├── server/
│   ├── server.ps1              ★ server จริงที่ใช้อยู่ตอนนี้ (PowerShell HttpListener, 326 บรรทัด)
│   ├── server.mjs              เวอร์ชัน Node.js ของ server เดียวกัน (merge logic เหมือนกัน) — ไม่ได้ใช้งานหลัก
│   ├── _server.log / _server.err.log   log ของ server
│   └── data/latest.json        ★ ฐานข้อมูลทั้งระบบ = ไฟล์ JSON ไฟล์เดียว
├── api/
│   ├── ingest.mjs              (โครงไว้สำหรับ Vercel — ตอนนี้เป็น demo ยังเก็บข้อมูลไม่ได้จริง)
│   └── data.mjs                (โครงไว้สำหรับ Vercel — คืน payload: null เสมอ)
├── start-server.bat            ★ จุดเริ่มระบบ (ดับเบิลคลิกไฟล์นี้)
├── vercel.json                 config Vercel (มีแค่ maxDuration ของ ingest)
├── README.md                   คู่มือภาษาไทย
├── assets/icons/*.png          ไอคอนไอเทมที่ server save จาก base64 ใน payload
└── _*.json, _*.js              ไฟล์ชั่วคราว/เครื่องมือ extract (ไม่เกี่ยวกับระบบหลัก)
```

## 2. ภาพรวม Data Flow (จากโค้ดจริง)

```
[เกม Roblox: Anime Zero] 
    │  ผู้เล่นรันสคริปต์ paduk_bridge.luau ผ่าน executor (ฝั่ง client)
    │  อ่านข้อมูลจาก ReplicatedStorage stores ของเกมโดยตรง
    ▼
POST /api/ingest  (JSON payload)  → CONFIG.URL_BASE = "http://127.0.0.1:3000" (บรรทัด 17)
    │
    ▼
[server.ps1 บนเครื่อง Windows]  พอร์ต 3000
    - ตรวจ JSON → merge ของเก่าที่พลาดมา (items/tier/rarityColors/runHistory)
    - แปลงรูปไอคอน base64 → เขียนเป็นไฟล์ assets/icons/<id>.png
    - เขียนทับ server/data/latest.json (ทั้ง packet)
    ▼
GET /api/data  ← หน้าเว็บ (js/live.js) ดึงทุก 5 วินาที (REFRESH_MS)
    │            + GET /api/thumb (proxy รูปจาก thumbnails.roblox.com กัน CORS)
    ▼
[เบราว์เซอร์: index.html + app.js + live.js]
    - ถ้าดึง /api/data ไม่ได้ → ใช้ mock data ใน app.js ต่อ (ไม่พัง)
```

## 3. ไฟล์สำคัญและตำแหน่งโค้ดที่เกี่ยวข้อง

### 3.1 start-server.bat (30 บรรทัด — จุดเริ่มระบบทั้งหมด)
- บรรทัด 13–20: เช็คว่าพอร์ต 3000 มีคนฟังอยู่ไหม (`netstat`) → ถ้ามีแล้ว แค่เปิด browser แล้วออก
- บรรทัด 23: เปิดเบราว์เซอร์อัตโนมัติหลัง 3 วิ (`start http://127.0.0.1:3000`)
- บรรทัด 26: รัน `powershell -ExecutionPolicy Bypass -File server\server.ps1` ← **ไม่ใช้ Node.js เลย**
- สรุป: ระบบเดิม = PowerShell เท่านั้น + ฐานข้อมูล JSON ไฟล์เดียว ไม่มี npm/node จำเป็น

### 3.2 roblox_agent/paduk_bridge.luau (786 บรรทัด) — สคริปต์ในเกม
CONFIG (บรรทัด 15–25): `URL_BASE="http://127.0.0.1:3000"`, `INGEST_PATH="/api/ingest"`,
`RUN_ONCE=true` (ส่งครั้งเดียวแล้วหยุด), `SEND_ICON_PIXELS=true` (export รูปไอคอนจากในเกม), `HISTORY_MAX=20`
**ไม่มี key ชื่อ `PUSH_INTERVAL`** (แต่ลูปหลักบรรทัด 785 อ้างถึง `CONFIG.PUSH_INTERVAL` → ถ้าตั้ง `RUN_ONCE=false` จะได้ nil แล้ว wait(nil) ทุกรอบ = push ถี่เกิน — เป็น latent bug)

หน้าที่หลักของ bridge (ไล่ตามลำดับโค้ด):
- 150–163: `levelFromXp()` — fallback คำนวณเลเวลถ้าเกมไม่มี progression module
- 168–185: `getProgression()` — require `ReplicatedStorage.global.utils.levelProgression` / `characterLevelProgression` (โมดูลของเกม)
- 203–242: `readRunState()` — อ่าน state รอบทำงานจาก `ReplicatedStorage.game.stores.runStore`: status/wave/waveCount/chapter/difficulty/area/areaCount/startedAt/finishedAt
- 247–314: `buildRunHistory()` — เมื่อ status ผู้เล่นใน runStore ≠ "active" (แปลว่าจบรอบแล้ว) จะสร้าง entry 1 รายการ: id = `os.date("!%Y%m%d%H%M%S")` (UTC timestamp เป็น id กันซ้ำ), drops (แยก "id:count" เอา 8 อันที่ได้เยอะสุด), result, duration, kills, damage, earned, gems, xp, unit ฯลฯ → คืน `{entry}` ตัวเดียว
- 319–677: `collectAccountData()` — ดึงของจริงจาก store ของเกม: leaderstats Level, currencies (money/gems/rolls/xp/traitRerolls), unlocked characters 8 ช่อง, equipped accessories (Neck/Face/Head/Back), playerStats, matchStats, characters (พร้อม skill/trait/evo), rarityColors, items ในกระเป๋า, gameConfig (traits/evo/skillTree/materialDefs)
- 649–677: return ของ collectAccountData — มี `player, account, character, characterStats, playerStats, matchStats, characters, rarityColors, items, itemsById, gameConfig` **(ไม่มี key `run`)**

**จุดตายของ flow รอบทำงาน (BUG):** `buildPayload()` บรรทัด 683–706:
- 701: `run = data.run` — แต่ `collectAccountData()` ไม่เคยคืน `run` → **`live.run` จะเป็น nil เสมอ** (ยืนยันด้วย GET /api/data จริง: `run: undefined`)
- 691–703: payload จริงที่ส่งไม่มี `character`, `characterStats`, `playerStats` ด้วย (เก็บใน data แต่ไม่ถูกใส่ใน live) — ทั้งที่ collectAccountData เตรียมไว้
- ส่งผล: ชิป "IN-RUN" ที่หน้าเว็บ (app.js:117 `renderLiveRunChip` ตรวจ `livePacket.run.status==="active"`) **ไม่มีวันทำงานเลย** ตั้งแต่แรก

ลูปหลักท้ายไฟล์ 779–786:
```
push()                          -- ส่งครั้งแรกทันที
if CONFIG.RUN_ONCE then         -- ตอนนี้ true → ส่งครั้งเดียวแล้วจบ
else
    while true do
        task.wait(CONFIG.PUSH_INTERVAL)   -- ค่านี้ไม่มีใน CONFIG (bug)
        push()
```
push() พยายามยิงผ่านหลายวิธีตามลำดับ (request/http_request/syn.request ฯลฯ) ถ้าไม่ได้เลย → `lastPushOk=false` + warn "[PADUK] send failed - all HTTP methods blocked" (บรรทัด 770–773)

### 3.3 server/server.ps1 (326 บรรทัด) — "backend + ฐานข้อมูล" ของระบบ
- 40–43: `HttpListener` ผูกที่ `http://127.0.0.1:3000` + `localhost:3000` เท่านั้น (ฟังเฉพาะเครื่องตัวเอง)
- 64–65: `$script:LiveData` (packet ล่าสุดใน RAM) + `$script:ThumbCache` (cache URL รูป)
- 68–101: `Save-RgbaPng` — รับ base64 RGBA 128×128 จาก bridge → สลับ R/B → เขียน `assets/icons/<id>.png`
- 103–111: `Save-DataFile` — เขียน packet ทับ `server/data/latest.json` และเก็บใน RAM; ถ้ามีไฟล์เก่าตอน start จะโหลดกลับมา (ข้อมูลไม่หายตอน restart server)
- 120–128: CORS `*` + OPTIONS 204
- 130–232: **POST /api/ingest** — merge logic สำคัญ (กันข้อมูลหายเมื่อ push ใหม่ไม่สมบูรณ์):
  - 146–152: ถ้า payload ใหม่ไม่มี items หรือมี 0 ชิ้น → คง items ของเก่าไว้
  - 154–164: ไอเทมใหม่ไม่มี tier → เติม tier จากของเก่าตาม id
  - 165–175: ถ้าไม่มี rarityColors หรือเป็น `{}` ว่าง → ใช้ของเกมเดิม
  - 177–196: **runHistory merge แบบ append-only**: รวมรอบใหม่เข้ากับของเก่าโดยใช้ `id` เป็นตัวกันซ้ำ (dedupe) → ใหม่มาก่อน แล้ว cap 20 รอบ
  - 199–218: ถ้าไอเทมมี field `png` (base64) → เซฟเป็น PNG แล้วลบ base64 ทิ้ง + ใส่ `image: "assets/icons/<id>.png"`
  - 219–224: ครอบ payload ด้วย `{ok, receivedAt, payload}` → เขียน latest.json ทั้งไฟล์
- 235–240: **GET /api/data** — คืน latest.json ตรง ๆ (404 ถ้ายังไม่มีข้อมูล)
- 245–289: **GET /api/thumb** — proxy ไป `thumbnails.roblox.com` (batch ≤50 id, cache ใน memory ตลอดอายุ server)
- 291–294: GET /api/health — return `{"ok":true,"port":3000}`
- 296–318: เสิร์ฟไฟล์ static จาก root โปรเจกต์ (มี guard กัน path traversal)

### 3.4 server/data/latest.json — ฐานข้อมูลจริงทั้งระบบ
- ทุกอย่างอยู่ใน **ไฟล์เดียว ทับซ้ำทุกครั้งที่ ingest** — ไม่มีตาราง ไม่มี log แยก
- โครงสร้าง: `{ ok, receivedAt, payload: { source, game, placeId, collectedAt, live: {...} } }`
- ข้อมูลจริง ณ ตอนตรวจ (receivedAt 2026-10-12T19:43+07:00): live มี keys = `characters, itemsById, items, player, gameConfig, rarityColors, matchStats, account` — **ไม่มี `run`, ไม่มี `runHistory` ใน snapshot นี้** (เพราะ RUN_ONCE=true และ bug data.run)

### 3.5 js/app.js + js/live.js — หน้าเว็บ
- app.js บรรทัด 1–4: **mock data** (`accounts` array บรรทัด 2–4) ใช้เป็น fallback
- app.js บรรทัด 223: แท็บในหน้า detail: history/characters/drops/economy/raid (ป้าย "Run History 40" ยังเป็นข้อความ mock แข็ง)
- app.js บรรทัด 225 `renderDetail()`: ข้อความ "ยังไม่มีความคืบหน้ามา 12 ชั่วโมง 54 นาที", "IN-GAME", Lv 61→74 เป็น **mock แข็งใน template string** ทั้งหมด
- app.js 116 `normaliseRunEntry()`: แปลง entry ของ runHistory (มี `time` เป็น unix วินาที) เป็น row ที่แสดงได้ — เวลาแสดงใช้เวลาท้องถิ่นเครื่องผู้ดู
- app.js 117 `renderLiveRunChip()`: แสดงชิป "IN-RUN" เมื่อ `livePacket.run.status==="active"` — ปัจจุบันไม่มีวันทำงาน (ดู bug ข้างบน)
- app.js 391: `setInterval(tickLive,5000)` + `setInterval(tickCountdowns,1000)`
- live.js 10–12: `API_BASE=""` (relative — ใช้ได้ทั้ง localhost และ Vercel), `REFRESH_MS=5000`
- live.js 20–48: รวม request รูปเป็น batch ทุก 30ms → ยิง `/api/thumb` ครั้งเดียว
- live.js 188–202 `fetchLive()`: GET /api/data → applyLive() → ถ้า error เงียบ ๆ แล้วคง mock
- live.js 157: สร้าง `window.livePacket` รวมทุกอย่างให้ app.js (มี run/runHistory ด้วยถ้ามี)

### 3.6 api/ingest.mjs + api/data.mjs + vercel.json — โครง Vercel ที่ยังไม่สมบูรณ์
- ingest.mjs: รับ POST แล้ว **แค่ console.log แล้ว echo กลับ** (คอมเมนต์ในไฟล์เองบอกว่า serverless ไม่มี persistent disk — ควรผูก KV/Upstash/Firebase) → ถ้า deploy ตอนนี้ ข้อมูลจะหายทันที
- data.mjs: คืน `{ok:true, note:"...", payload:null}` เสมอ → หน้าเว็บบน Vercel จะโหลดข้อมูลจริงไม่ได้
- ไม่มี `/api/thumb` ฝั่ง serverless (หน้าเว็บจะโหลดรูปไม่ได้ ต้องเพิ่ม endpoint นี้)
- vercel.json: มีแค่ `functions: { "api/ingest.mjs": { maxDuration: 10 } }`
- **สรุป: โครง Vercel เขียนไว้ครึ่งทาง — ยังไม่มี storage จริง**

## 4. ปัญหาและข้อจำกัดที่พบจากโค้ดจริง (ไม่มีการเดา)

| # | ปัญหา | ตำแหน่ง | ผลกระทบ |
|---|---|---|---|
| B1 | `live.run` ไม่มีทางมีค่า — collectAccountData ไม่คืน `run` แต่ buildPayload อ้าง `data.run` | bridge 691–703 + 649–677 | ชิป IN-RUN ไม่ทำงาน, เว็บไม่รู้ว่ารอบกำลังเล่นอยู่ |
| B2 | `CONFIG.PUSH_INTERVAL` ไม่มีใน CONFIG แต่ถูกอ้างที่บรรทัด 785 | bridge 15–25 vs 785 | เปิดโหมด push ซ้ำแล้วจะพัง (push ถี่มากหรือ error) |
| B3 | RUN_ONCE=true → ส่งครั้งเดียวแล้วหยุด | bridge 20, 781 | เว็บโชว์ข้อมูลค้างจากครั้งเดียว ไม่มี heartbeat แยกแยะ "ข้อมูลเก่า" ออกจาก "ยังทำงานอยู่" |
| B4 | ไม่มี field ระบุ "งาน/บัญชี" (job id) ใน payload เลย | bridge 686–704 | ถ้ามีหลายงาน/หลายบัญชี ข้อมูลจะทับกันหมด (latest.json มีแค่ snapshot เดียว) |
| B5 | runCaptured ถูก set บรรทัด 267 แต่ไม่เคยถูกอ่าน | bridge 204/267 | dedupe จริงอยู่ที่ server (id-based) จึงยังไม่พัง แต่โค้ดหลอกตัวเอง |
| B6 | สถานะหน้าเว็บส่วนใหญ่เป็น mock แข็ง (Lv 61→74, IN-GAME, "ไม่คืบหน้า 12 ชม.") | app.js 223/225 | หน้าเว็บอาจโกหกสถานะจริง — ตรงกับที่เจ้าของกลัว |
| B7 | ฐานข้อมูล = latest.json ทับซ้ำ ไม่มีประวัติจริง | server.ps1 103–111 | runHistory เก่ากว่า 20 รอบหาย, log ไม่มี timestamp รายเหตุการณ์ |
| B8 | /api/thumb ใช้ thumbnails.roblox.com ตรง ๆ ใน ps1 | server.ps1 272 | บน Vercel ควรใช้ roproxy (server.mjs:111 ใช้ roproxy แล้ว) |
| B9 | icon 128×128 base64 ใน payload (~64KB+/รูป) + PowerShell loop สลับ R/B | bridge 22–23, server 68–101 | payload ใหญ่, server slow (แต่ทำงานได้), Vercel body limit 4.5MB ต้องระวัง |
| B10 | api/*.mjs เป็น demo ครึ่งทาง | api/*.mjs | ตอนนี้ deploy Vercel ได้แต่ /api/data คืน null เสมอ |

## 5. เปรียบเทียบ 3 ทางเลือกการ Deploy (อ้างอิงโค้ดที่พบจริง)

### ทางเลือก A: ใช้ระบบเดิมทั้งหมดในเครื่อง (ทำต่อจาก start-server.bat)
- ✅ ไม่ต้องแก้อะไรเลย ระบบพิสูจน์แล้วว่าทำงานได้ (มีข้อมูลจริงใน latest.json)
- ✅ แก้บั๊ก B1/B2 แล้วใช้ต่อได้ทันที
- ❌ เว็บเห็นเฉพาะในเครื่อง/วงแลน (HttpListener ผูก 127.0.0.1)
- ❌ เครื่องต้องเปิดค้าง, ไม่มี HTTPS, แชร์ให้ลูกค้า/เพื่อนดูไม่ได้
- ความซับซ้อน: ต่ำสุด

### ทางเลือก B: เว็บขึ้น Vercel + Backend เดิมอยู่ในเครื่อง
- วิธี: deploy static (index/css/js) ขึ้น Vercel แล้วตั้ง `API_BASE` ใน live.js (บรรทัด 10) ชี้กลับมาที่เครื่องเรา
- ❌ **ไม่ทำงานจริง** เพราะ: (1) server.ps1 ฟังเฉพาะ 127.0.0.1 (บรรทัด 41–42) เว็บภายนอกยิงถึงเครื่องไม่ได้ (2) browser เรียก http://127.0.0.1 จากเว็บอื่น = ยิงกลับเครื่องผู้ชมเอง (3) จำเป็นต้องเปิดพอร์ต + Public IP + HTTPS — โดเมนฟรี Vercel ใช้ HTTPS แต่เครื่องเราไม่มี cert
- ข้อยกเว้น: ถ้า backend รันบนเครื่องที่มี public IP/DDNS + TLS จึงจะได้ แต่ PowerShell HttpListener ต้องผูก prefix ใหม่ + เปิด firewall — ไม่แนะนำ
- สรุป: ทางนี้ทำได้ยากและเปราะกว่าที่คิด

### ทางเลือก C: เว็บขึ้น Vercel + ย้าย ingest/data ไป storage จริง (แนะนำ)
- แก้ api/ingest.mjs ให้เขียนลง storage (Upstash Redis / Vercel KV / Supabase — ฟรีพอสำหรับขนาดนี้)
- แก้ api/data.mjs ให้อ่านจาก storage เดียวกัน
- เพิ่ม api/thumb.mjs (proxy รูป — คัดจาก server.mjs:100–120 ซึ่งเขียนไว้แล้ว)
- แก้ bridge แค่ 1 บรรทัด: `URL_BASE = "https://<โปรเจกต์>.vercel.app"` (bridge 17)
- localhost เดิม (start-server.bat + server.ps1) **คงไว้ได้ 100%** สำหรับ dev/ทดสอบ — bridge จะเลือก URL_BASE ตอนรัน
- ความซับซ้อน: กลาง (ต้องสมัคร storage 1 ตัว + ตั้ง env var 1 ตัว)
- ข้อดี: เว็บออนไลน์จริง, ระบบเดิมไม่ต้องรื้อ, ทดสอบในเครื่องด้วย .bat เหมือนเดิม

### การตัดสินใจที่ GPT ควรช่วยชี้นำ
- จะเลือก Upstash Redis, Vercel KV, หรือ Supabase? (โปรเจกต์นี้ต้องแค่ key-value JSON ไฟล์เดียว + list รอบ 20–50 รอบ — ไม่ต้องใช้ SQL ก็ได้)
- จะจัดการ multi-job อย่างไร (B4) — ใส่ `jobId` ใน payload แล้วแยก key ต่องานหรือไม่

## 6. แยกชนิดข้อมูลสถานะ — หัวใจของประเด็น 4

ตามโค้ดจริง ปัจจุบันมีข้อมูล 3 ชนิดที่ต้องแยกกันให้ชัด:

1. **สถานะรอบทำงาน (run state)** — แหล่งที่มา: `readRunState()` bridge 214–242 อ่านจาก runStore ของเกม (status/wave/area ฯลฯ) — ควรแสดงเป็น "IN-RUN Ch.X Area Y Wave Z" แต่ตอนนี้ flow ขาด (bug B1)
2. **สถานะออนไลน์ของระบบ** — ปัจจุบัน **ไม่มีอยู่จริงในข้อมูลเลย** มีแค่ `receivedAt` (server.ps1:221) กับ `collectedAt` (bridge:690) เว็บต่อ 5 วิไม่ได้บอกว่า bridge ตายไปแล้ว — ต้องมี "อายุข้อมูล" (now - receivedAt) มาตัดสิน
3. **ประวัติ Log (runHistory)** — มาจาก buildRunHistory() (บรรทัดจบรอบเท่านั้น, id = UTC timestamp) + merge append-only ฝั่ง server (ps1:177–196, cap 20)

## 7. ข้อเสนอแบบแผนสถานะ/Log (แบบที่เข้ากับระบบปัจจุบัน)

ระบบปัจจุบันเป็น **push-only ทั้งหมด** (bridge ยิงเอง, server ไม่มีทางรู้ถ้า bridge ตาย) ดังนั้น:
- **Event** = runHistory (มีอยู่แล้ว — เก็บตอนจบรอบ, มี id กันซ้ำ, server merge กันหาย) → คงรูปแบบนี้ไว้
- **Heartbeat** = เพิ่มเฉพาะ push ซ้ำเป็นระยะ (RUN_ONCE=false + เพิ่ม PUSH_INTERVAL=60–120 วิ) — โครง push loop เขียนไว้แล้วที่ bridge 784–786 แค่แก้ B2
- **Staleness (สำคัญที่สุด)**: เว็บคำนวณ `อายุ = now - receivedAt` แล้วแสดง:
  - < 3×interval → "ออนไลน์ / กำลังทำงาน"
  - > 3×interval → "ไม่แน่ใจ (Unknown)" สีเหลือง
  - > 10 นาที → "ขาดการติดต่อ / ข้อมูลค้าง" (แสดงเวลาที่เห็นล่าสุด)
- **ไม่แนะนำ Polling แบบ server เรียกเกม** — เกม Roblox ฝั่ง client ไม่มี server ให้ยิงเข้าไปได้ (executor ทำ HTTP ออกเท่านั้น)
- กัน Log ซ้ำ: dedupe ตาม `id` ของ entry (มีกลไกครบแล้วทั้ง bridge และ server) + ไม่ push ซ้ำเมื่อ run state ไม่เปลี่ยน
- กันสถานะงาน A ไปโชว์เป็นงาน B → ต้องมี `jobId` (B4) และเว็บแสดงสถานะต่อ jobId
- กรณี API/storage ล่ม: ingest คืน 5xx → bridge ควร warn แล้วรอรอบหน้า (ไม่ crash) — ตอนนี้ push ล้มเหลวเงียบ ๆ มี warn อยู่แล้ว (770–773)
- สถานะ Unknown: ถ้า latest.json ไม่มีข้อมูลงานนั้นเลย → แสดง "Unknown" ไม่ใช่ "ออนไลน์"

## 8. Workflow พัฒนาต่อด้วย VS Code + Cline (+ GitHub + Vercel)

- โปรเจกต์นี้ยัง **ไม่มี git** (ตรวจแล้ว: `git status` ไม่ผ่าน) → ขั้นแรกควร `git init` + push ขึ้น GitHub ก่อนแตะโค้ด
- หลัง deploy แล้วแก้โค้ดได้ตามปกติทุกอย่าง: แก้ใน VS Code → commit → push → Vercel build อัตโนมัติ
- การทดสอบในเครื่อง: ใช้ start-server.bat เดิม (คงไว้) — หน้าเว็บ + API ทำงานเหมือน production เพราะ live.js ใช้ relative path (`API_BASE=""`)
- Deploy = `git push` เท่านั้น (Vercel ต่อ GitHub ให้เอง) — ไม่ต้องเริ่มโปรเจกต์ใหม่
- Branch model ที่เหมาะ: `main` = production, branch อื่น = Vercel Preview URL อัตโนมัติ (ทดสอบก่อน merge)
- Build Logs ดูใน Vercel Dashboard → Deployments; Runtime Logs ดูที่แท็บ Logs (console.log ของ api/*.mjs จะโผล่ตรงนั้น)
- Environment Variables: ตั้งใน Vercel Dashboard → Settings → Environment Variables แยก 3 environment (Development/Preview/Production) — ตัวแปรที่คาดว่าจะมี: `STORAGE_URL`/`STORAGE_TOKEN` (ถ้าใช้ Upstash) — ปัจจุบันโปรเจกต์ **ไม่มี secret ใด ๆ ทั้งโค้ด** (ตรวจแล้ว)
- สิ่งที่ Cline แก้ได้ปลอดภัย: css/js หน้าเว็บ, api/*.mjs, เพิ่มหน้าใหม่, เพิ่ม endpoint
- ส่วนที่ต้องระวัง: การแก้ merge logic ใน ingest (ผิดแล้วข้อมูลเก่าหาย), การเปลี่ยนรูปแบบ id ของ runHistory (ทำ dedupe พัง), แก้ bridge แล้วลืมบอกให้อัปเดตสคริปต์ฝั่งเกม

## 9. ไฟล์ที่ต้องแก้ / เพิ่ม / คงไว้ (ถ้าเลือกทาง C)

**แก้ไข (เล็กน้อย):**
| ไฟล์ | จุดที่แก้ | เหตุผล |
|---|---|---|
| roblox_agent/paduk_bridge.luau | บรรทัด 17 (URL_BASE), 20 (RUN_ONCE), เพิ่ม `PUSH_INTERVAL = 60` ใน CONFIG, แก้ buildPayload 691–703 ให้ใส่ run/character/characterStats/playerStats | แก้ B1/B2/B3 และชี้ไป Vercel |
| api/ingest.mjs | เขียนลง storage แทน console.log + ย้าย merge logic จาก server.ps1:130–232 เป็น JS | หัวใจของการขึ้นออนไลน์ |
| api/data.mjs | อ่านจาก storage แทนคืน null | ให้เว็บอ่านได้จริง |
| js/app.js | ทำสถานะจาก receivedAt + ตัด mock แข็งบางส่วน (B6) | สถานะไม่โกหก |

**เพิ่มใหม่:**
| ไฟล์ | หน้าที่ |
|---|---|
| api/thumb.mjs | proxy รูป Roblox (copy จาก server.mjs:100–120 ที่เขียนไว้แล้ว) |
| (ถ้าต้องการ) api/status.mjs หรือใส่รวมใน data.mjs | สถานะ heartbeat ต่อ jobId |

**คงไว้ไม่แตะ:** start-server.bat, server/server.ps1 (dev เท่านั้น), js/app.js โครงหลัก, css, index.html, assets/*
**ลบ/เก็บข้างได้ภายหลัง:** _*.json, _*.js (ไฟล์ชั่วคราว)

## 10. ขั้นตอนพัฒนาที่แนะนำ (เรียงตามลำดับ)

1. `git init` + commit ทั้งโปรเจกต์ + push GitHub (จุด rollback สำคัญที่สุด)
2. แก้ B2 (เพิ่ม PUSH_INTERVAL ใน CONFIG) + ตัดสินใจเรื่อง B1 (แก้ bridge ให้ส่ง run) — ทดสอบบน localhost ก่อน
3. แก้ app.js mock แข็ง (B6) ให้อ่านจาก livePacket + คำนวณ staleness จาก receivedAt
4. สมัคร storage (Upstash แนะนำ — REST API, ฟรี) → ตั้ง env var ใน Vercel
5. เขียน api/ingest.mjs + api/data.mjs + api/thumb.mjs ให้เทียบเท่า server.ps1 (merge logic เดิมทุกอย่าง)
6. Deploy Vercel → ทดสอบ /api/ingest ด้วย curl → เปลี่ยน URL_BASE ใน bridge → ทดสอบจากเกมจริง
7. คง start-server.bat + server.ps1 ไว้เป็น dev environment ตลอดไป

## 11. ความเสี่ยง + วิธีกันระบบเดิมพัง

- อย่าลบ server.ps1 / start-server.bat / latest.json — มันคือระบบ dev และฐานข้อมูลจริง
- อย่าแก้ merge logic ใน ingest ทีเดียวทั้งก้อน — ทดสอบด้วย POST จำลอง (curl/PowerShell Invoke-RestMethod) กับข้อมูลเก่าก่อน
- ระวัง RUN_ONCE=false โดยยังไม่แก้ B2 — จะยิงถี่มาก
- อย่าลบ /api/thumb ใน ps1 ถ้ายังใช้ localhost
- ทุกครั้งแก้ bridge: ทดสอบในโหมด RUN_ONCE=true ก่อนเสมอ (โหมดทดสอบของระบบเดิม)
- backup latest.json ก่อนทดลองอะไร (มันคือข้อมูลจริงทั้งหมด)

## 12. สิ่งที่ต้องถามเจ้าของโปรเจกต์ก่อนลงมือ

1. จะใช้ storage ตัวไหน (Upstash / Vercel KV / Supabase)? มีบัญชีอยู่แล้วไหม?
2. ต้องการรองรับหลายงาน/หลายบัญชีพร้อมกันไหม (B4: jobId)? ถ้าใช่ มีกี่งาน?
3. จะให้ push ซ้ำเป็นระยะกี่วินาที (heartbeat) — 60 หรือ 120 วิ?
4. หน้าเว็บใช้แสดงกี่บัญชี? mock ใน app.js จะคงไว้เป็น fallback หรือไม่?
5. โดเมนเองหรือใช้ *.vercel.app?
6. ใครมีสิทธิ์ดูข้อมูล (payload มีชื่อผู้ใช้ Roblox) — ต้องหน้าล็อกอินไหม?

## 13. สรุปคำตอบคำถามสำคัญที่เจ้าของถามไว้

- **.bat ยังใช้ได้ไหม?** → ได้ 100% สำหรับ dev/localhost (มันรัน server.ps1 ไม่ใช่ Node) และหลังไป Vercel ก็ยังใช้ dev เหมือนเดิม แต่ "เว็บออนไลน์" จะไม่ผูกกับ .bat แล้ว — เป็น 2 โลกที่ใช้ /api เดียวกัน
- **เว็บขึ้น Vercel แล้ว .bat ยังเปิด server เดิมได้ไหม?** → ได้ แต่เป็นการทำงานคู่ขนาน (local mode) ไม่ใช่ backend ให้เว็บออนไลน์อีกต่อไป
- **ตอนนี้ backend ต้องทำงานตลอดเวลาไหม?** → ใช่ server.ps1 ต้องเปิดค้างเพื่อรับ ingest + เสิร์ฟเว็บ แต่งานของมันเบามาก (เขียน JSON ไฟล์เดียว)
- **localhost ถูกอ้างที่ไหน?** → bridge:17 (URL_BASE), bat:17/23, ps1:41–42, live.js:10 ใช้ relative จึงไม่มีปัญหา
- **ต้องมี DB เพิ่มไหม?** → ถ้า deploy ออนไลน์: จำเป็น (serverless ไม่มี disk ถาวร) แต่ขนาดเล็กมาก — KV ฟรีพอ
- **มี secret ไหม?** → ไม่มี API key ใด ๆ ในโค้ดทั้งโปรเจกต์ (ตรวจแล้ว) — เพิ่มเติมในอนาคตคือ storage token เก็บเป็น Vercel Env Var

---
*จบเอกสาร — สร้างโดย Cline จากการอ่านโค้ดจริงทุกไฟล์, ไม่มีการแก้ไขโค้ดใด ๆ ในโปรเจกต์*
