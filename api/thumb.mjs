const cache = new Map();

export default async function handler(req, res) {
  try {
    const idsParam = String(req.query.ids || "").trim();
    const size = String(req.query.size || "150x150").match(/^\d+x\d+$/)
      ? String(req.query.size) : "150x150";

    const ids = idsParam
      .split(",")
      .map((s) => s.replace(/\D/g, ""))
      .filter((s) => s.length >= 4)
      .slice(0, 60);

    if (!ids.length) return res.status(200).json({ ok: false, data: {} });

    const data = {};
    const need = [];

    for (const id of ids) {
      const key = id + "@" + size;
      const hit = cache.get(key);
      if (hit) data[id] = hit;
      else need.push(id);
    }

    if (need.length) {
      const url = `https://thumbnails.roproxy.com/v1/assets?assetIds=${need.join(",")}&size=${size}&format=Png&isCircular=false`;
      const r = await fetch(url, { headers: { accept: "application/json" } });
      if (r.ok) {
        const j = await r.json();
        for (const d of j.data || []) {
          const u = (d.state === "Completed" && d.imageUrl) ? d.imageUrl : "";
          data[d.targetId] = u;
          if (u) cache.set(d.targetId + "@" + size, u);
        }
      }
      for (const id of need) if (!(id in data)) data[id] = "";
    }

    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json({ ok: true, data });
  } catch (e) {
    console.error("[THUMB]", e);
    return res.status(200).json({ ok: false, error: String(e), data: {} });
  }
}