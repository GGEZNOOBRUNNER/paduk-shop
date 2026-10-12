# PADUK SHOP — Farming Log + Live Bridge (Anime Zero)

โปรเจกต์หน้าเว็บติดตามงานฟาร์มเกม Anime Zero **พร้อมสคริปต์ Roblox ที่ดึงข้อมูลจริงจากเกมมาอัปเดตหน้าเว็บแบบเรียลไทม์**

## โครงสร้าง
```
paduk-shop-vscode/
├── index.html            โครงสร้างหน้าเว็บ (template เดิม)
├── css/styles.css        ธีม + รองรับภาพจากเกม
├── js/app.js             UI + mock data + tabs (template เดิม)
├── js/live.js            ★ ชั้นเชื่อม API: ดึงข้อมูลจริงมาแทน mock
├── assets/anime-zero.png ภาพการ์ดเกม
├── roblox_agent/
│   └── paduk_bridge.luau ★★ สคริปต์เดียว "โหลดจบ" ฝั่ง Roblox
├── server/
│   ├── server.ps1        ★ localhost server (PowerShell zero-install)
│   ├── server.mjs        Node/Express (สำหรับเครื่องที่มี Node)
│   └── data/latest.json  ข้อมูลล่าสุดที่รับจากเกม (auto-create)
├── api/
│   ├── ingest.mjs        Vercel serverless (POST /api/ingest)
│   └── data.mjs          Vercel serverless (GET /api/data)
└── vercel.json           config Vercel
```

## วิธีรันทั้งหมด (Localhost)
### 1) เริ่ม server
เปิด PowerShell แล้วรัน (ไม่ต้องติดตั้งอะไรเพิ่ม — ใช้ .NET ใน Windows):
```
powershell -ExecutionPolicy Bypass -File server\server.ps1
```
หรือถ้ามี Node: `cd server; npm i express; node server.mjs`

### 2) เปิดเว็บ
เปิด `http://127.0.0.1:3000` ในเบราว์เซอร์
- ถ้ายังไม่มี server เปิด → หน้าเว็บแสดง mock data ตามเดิม (fallback ไม่พัง)

### 3) โหลดสคริปต์ Roblox (อันเดียวจบ)
เปิดเกม **Anime Zero [Void Arbiter]** แล้วรันไฟล์เดียว:
```
roblox_agent/paduk_bridge.luau
```
สคริปต์จะ:
- อ่านข้อมูลบัญชีจริง (currencies, ตัวละครที่ปลดล็อก, level/XP, match stats, ตัวที่เลือก)
- รวบรวมรูปภาพ skill icon ของตัวละคร (assetId ของเกมจริง)
- POST ไป `http://127.0.0.1:3000/api/ingest` ทุก 15 วิ

หน้าเว็บจะโหลดข้อมูลจริงจาก `GET /api/data` ทุก 5 วิ แล้วอัปเดตการ์ดตัวละคร/สถิติ

## วิธีย้ายไป Vercel (อนาคต)
1. เปลี่ยน `URL_BASE` ใน `roblox_agent/paduk_bridge.luau` เป็น URL ของ Vercel
   (เช่น `https://paduk-api.vercel.app`)
2. Deploy โฟลเดอร์นี้ผ่าน Vercel CLI / dashboard (ใช้ `api/*.mjs`)
3. หมายเหตุ: Vercel serverless ไม่มี disk แบบถาวร — ควรต่อ KV/Upstash/Firebase
   (ใน `api/ingest.mjs` มีจุด `NOTE` ไว้)

## API ชุดเดียว (ทั้ง localhost และ Vercel)
| Method | Path          | คำอธิบาย                              |
|--------|---------------|---------------------------------------|
| POST   | /api/ingest   | รับข้อมูลจากสคริปต์ Roblox             |
| GET    | /api/data     | ให้หน้าเว็บอ่านข้อมูลล่าสุด             |
| GET    | /api/health   | เช็ค server ทำงาน                      |

## ข้อมูลในเกมที่ script อ่าน (Anime Zero)
- `ReplicatedStorage.global.stores.accountNamespace` → currencies / ตัวละคร / unlocked
- `CharactersData[ตัวละคร].Progression.Xp` + `IsUltimateUnlocked` → level / ult
- `matchStats` → kills / wins / deaths / damage
- `ReplicatedStorage.global.constants.characters` → displayName + skill icon assetIds
- `leaderstats.Level`

รูปภาพตัวละครในเว็บใช้ Roblox thumbnail API:
`https://www.roblox.com/thumbs/asset.ashx?width=420&height=420&assetId=<ID>`
