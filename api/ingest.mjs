// ============================================================
// VERCEL SERVERLESS — POST /api/ingest
// รับข้อมูลจาก Roblox script (paduk_bridge.luau)
// Deploy: เปลี่ยน CONFIG.URL_BASE ใน .luau ให้ชี้มาที่ URL นี้
// ============================================================

// ไฟล์เก็บข้อมูลชั่วคราวอิง Vercel (ปรับตาม provider ที่ใช้จริง)
const DATA_KEY = "paduk_latest";

export default async function handler(req, res) {
  // Vercel: function นี้จะถูกเรียกตอน deploy แบบ Node runtime
  // สำหรับตัวอย่างนี้ เก็บในหน่วยความจำ/ไฟล์ชั่วคราว
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method not allowed" });
  }

  try {
    const payload = req.body;
    if (!payload) return res.status(400).json({ ok: false, error: "empty body" });

    const packet = {
      ok: true,
      receivedAt: new Date().toISOString(),
      payload,
    };

    // NOTE: Vercel serverless functions ไม่มี persistent disk แบบถาวร
    // สำหรับ production ควรผูกกับ KV / Upstash / Firebase ฯลฯ
    // ตัวอย่างนี้ return + log อย่างเดียว
    console.log("[INGEST]", JSON.stringify(packet));

    return res.status(200).json(packet);
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
