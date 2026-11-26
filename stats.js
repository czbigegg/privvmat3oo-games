// Vercel serverless function: live stats for the Roblox game.
const PLACE_ID = "80730765046985"; // Fly Dragon For Eggs (place id)
// Si roblox.com bloquea la IP del servidor, se prueba un espejo.
const HOSTS = ["roblox.com", "roproxy.com"];
let cachedUniverse = null;

async function rbx(sub, path) {
  let lastErr;
  for (const host of HOSTS) {
    try {
      const r = await fetch(`https://${sub}.${host}${path}`, {
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; PortfolioStats/1.0)" },
      });
      if (!r.ok) throw new Error("HTTP " + r.status + " " + sub + "." + host);
      return await r.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

module.exports = async (req, res) => {
  try {
    if (!cachedUniverse) {
      const u = await rbx("apis", `/universes/v1/places/${PLACE_ID}/universe`);
      cachedUniverse = u.universeId;
    }
    const id = cachedUniverse;
    const [g, v, t, ic] = await Promise.all([
      rbx("games", `/v1/games?universeIds=${id}`),
      rbx("games", `/v1/games/votes?universeIds=${id}`),
      rbx("thumbnails", `/v1/games/multiget/thumbnails?universeIds=${id}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`).catch(() => null),
      rbx("thumbnails", `/v1/games/icons?universeIds=${id}&size=512x512&format=Png&isCircular=false`).catch(() => null),
    ]);
    const game = (g.data && g.data[0]) || {};
    const votes = (v.data && v.data[0]) || {};
    const up = votes.upVotes || 0;
    const down = votes.downVotes || 0;
    const cover = t && t.data && t.data[0] && t.data[0].thumbnails && t.data[0].thumbnails[0] && t.data[0].thumbnails[0].imageUrl;
    const icon = ic && ic.data && ic.data[0] && ic.data[0].imageUrl;
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).json({
      name: game.name || "Fly Dragon For Eggs",
      playing: game.playing || 0,
      visits: game.visits || 0,
      favorites: game.favoritedCount || 0,
      likePercent: up + down > 0 ? Math.round((up / (up + down)) * 100) : null,
      thumbnail: cover || icon || null,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    cachedUniverse = null;
    res.status(502).json({ error: "roblox_unavailable", detail: String(e && e.message || e) });
  }
};
