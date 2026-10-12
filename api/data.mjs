// ============================================================
// VERCEL SERVERLESS — GET /api/data
// ให้หน้าเว็บอ่านข้อมูลล่าสุด  (ตัวอย่าง serverless demo)
// ============================================================
export default async function handler(_req, res) {
  return res.status(200).json({
    ok: true,
    note: "Vercel demo — จริงแล้วควรอ่านจาก KV storage",
    payload: null,
  });
}
