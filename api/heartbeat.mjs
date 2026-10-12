import { getSupabase } from "./_supabase.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  try {
    const { userId, username, sessionId } = req.body || {};
    if (!userId) return res.status(400).json({ ok: false });

    const supabase = getSupabase();
    await supabase.from("paduk_agents").upsert({
      user_id: userId,
      username: username || null,
      session_id: sessionId || null,
      last_seen: Math.floor(Date.now() / 1000),
    }, { onConflict: "user_id" });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}