// ============================================================
// VERCEL SERVERLESS — POST /api/heartbeat
// รับ heartbeat จาก bridge → upsert ลง paduk_agents
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

    if (!userId) {
      return res
        .status(400)
        .json({ ok: false, error: "invalid payload: userId required" });
    }

    const supabase = getSupabase();

    const { error } = await supabase.from("paduk_agents").upsert(
      {
        user_id: userId,
        username,
        session_id: sessionId,
        last_seen: Math.floor(Date.now() / 1000),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res
      .status(500)
      .json({ ok: false, error: err && err.message ? err.message : "internal error" });
  }
}