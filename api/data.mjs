// ============================================================
// VERCEL SERVERLESS — GET /api/data
// อ่าน snapshot ล่าสุด + agent + runHistory จาก Supabase
// ตอบ { ok, receivedAt, payload: { ...snap.payload, runHistory, agent } }
// ============================================================
import { getSupabase } from "./_supabase.mjs";

const ONLINE_WINDOW_SEC = 240; // 4 นาที

export default async function handler(_req, res) {
  try {
    const supabase = getSupabase();

    // --- 1) snapshot ล่าสุด ---
    const { data: snap, error: snapErr } = await supabase
      .from("paduk_snapshots")
      .select("payload, received_at")
      .order("received_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (snapErr) throw snapErr;
    if (!snap) {
      return res.status(200).json({ ok: false, error: "no data yet" });
    }

    const payload = snap.payload || {};
    const userId = Number(
      payload.userId ?? payload.live?.player?.userId ?? 0
    );

    // --- 2) agent ของ user นี้ ---
    const { data: agent, error: agentErr } = await supabase
      .from("paduk_agents")
      .select("user_id, username, session_id, last_seen")
      .eq("user_id", userId)
      .maybeSingle();

    if (agentErr) throw agentErr;

    const now = Math.floor(Date.now() / 1000);
    const agentOut = agent
      ? {
          userId: Number(agent.user_id),
          username: agent.username || "",
          sessionId: agent.session_id || "",
          lastSeen: Number(agent.last_seen) || 0,
          online: now - Number(agent.last_seen || 0) < ONLINE_WINDOW_SEC,
        }
      : { userId, username: "", sessionId: "", lastSeen: 0, online: false };

    // --- 3) runHistory 20 รายการล่าสุด ---
    const { data: runs, error: runsErr } = await supabase
      .from("paduk_runs")
      .select("run_id, result, chapter, difficulty, drops, duration, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (runsErr) throw runsErr;

    // แปลงกลับเป็นรูปแบบ entry เดิมที่ frontend (normaliseRunEntry) ใช้
    const runHistory = (runs || []).map((r) => ({
      id: r.run_id,
      time: Math.floor(new Date(r.created_at).getTime() / 1000),
      result: r.result,
      chapter: r.chapter,
      difficulty: r.difficulty,
      drops: Array.isArray(r.drops) ? r.drops : [],
      duration: r.duration,
    }));

    return res.status(200).json({
      ok: true,
      receivedAt: snap.received_at,
      payload: { ...payload, runHistory, agent: agentOut },
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err && err.message ? err.message : "internal error",
    });
  }
}
