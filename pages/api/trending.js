// pages/api/trending.js

let cache = { data: null, ts: 0 };
const CACHE_MS = 120_000; // 2 minutes

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    const trendRes = await fetch(
      'https://api.coingecko.com/api/v3/search/trending',
      { headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '' } }
    );
    if (!trendRes.ok) throw new Error(`CoinGecko trending ${trendRes.status}`);
    const trendData = await trendRes.json();

    const coins = trendData.coins.slice(0, 8).map((c) => ({
      id: c.item.id,
      name: c.item.name,
      symbol: c.item.symbol.toUpperCase(),
      rank: c.item.market_cap_rank,
      thumb: c.item.large || c.item.thumb || null,
    }));

    const ids = coins.map((c) => c.id).join(',');
    let priceMap = {};
    try {
      const prRes = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '' } }
      );
      priceMap = await prRes.json();
    } catch (_) {}

    const result = coins.map((c) => ({
      ...c,
      price: priceMap[c.id]?.usd ?? null,
      change24h: priceMap[c.id]?.usd_24h_change ?? null,
    }));

    cache = { data: result, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=240');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/api/trending]', err.message);
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Trending data unavailable' });
  }
}