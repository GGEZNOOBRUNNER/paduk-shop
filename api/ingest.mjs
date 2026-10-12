// ============================================================
// VERCEL SERVERLESS — POST /api/ingest
// รับข้อมูลจาก Roblox script (paduk_bridge.luau) → Supabase
// ตาราง: paduk_snapshots / paduk_runs / paduk_agents
// ============================================================
import { getSupabase } from "./_supabase.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const live = payload.live && typeof payload.live === "object" ? payload.live : {};

    // --- userId / username / sessionId ---
    // (bridge ปัจจุบันไม่ส่ง field บนสุด → ดึงจาก live.player แทน)
    const player = live.player && typeof live.player === "object" ? live.player : {};
    const userId = Number(
      payload.userId ?? player.userId ?? payload.player?.userId ?? 0
    );
    const username = String(
      payload.username ?? player.username ?? player.displayName ?? ""
    );
    const sessionId = String(
      payload.sessionId ?? live.sessionId ?? ""
    );

    if (!userId || Object.keys(live).length === 0) {
      return res
        .status(400)
        .json({ ok: false, error: "invalid payload: userId + live required" });
    }

    const supabase = getSupabase();

    // --- 1) upsert runHistory ทีละ entry (onConflict: run_id) ---
    if (Array.isArray(live.runHistory)) {
      for (const entry of live.runHistory) {
        if (!entry || entry.id == null) continue;
        await supabase.from("paduk_runs").upsert(
          {
            run_id: String(entry.id),
            user_id: userId,
            result: String(entry.result ?? ""),
            chapter: Number(entry.chapter) || 0,
            difficulty: String(entry.difficulty ?? ""),
            drops: Array.isArray(entry.drops) ? entry.drops : [],
            duration: Number(entry.duration) || 0,
          },
          { onConflict: "run_id" }
        );
      }
      delete live.runHistory; // เก็บใน paduk_runs แล้ว — ไม่ซ้ำใน snapshot
    }

    // --- 2) บันทึก snapshot (payload = live object) ---
    const { error: snapErr } = await supabase
      .from("paduk_snapshots")
      .insert({ user_id: userId, payload: live });
    if (snapErr) throw snapErr;

    // --- 3) upsert heartbeat ลง paduk_agents ---
    const { error: agentErr } = await supabase.from("paduk_agents").upsert(
      {
        user_id: userId,
        username,
        session_id: sessionId,
        last_seen: Math.floor(Date.now() / 1000),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (agentErr) throw agentErr;

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: err && err.message ? err.message : "internal error" });
  }
}
