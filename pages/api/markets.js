// pages/api/markets.js
// Top 100 coins with price, market cap, volume, % changes, and 7d sparkline.

let cache = { data: null, ts: 0 };
const CACHE_MS = 60_000;

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets' +
      '?vs_currency=usd&order=market_cap_desc&per_page=100&page=1' +
      '&sparkline=true&price_change_percentage=1h,24h,7d';

    const r = await fetch(url, { headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '' } });
    if (!r.ok) throw new Error(`CoinGecko markets ${r.status}`);
    const raw = await r.json();

    const coins = raw.map((c) => ({
      id: c.id,
      rank: c.market_cap_rank,
      symbol: (c.symbol || '').toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      change1h: c.price_change_percentage_1h_in_currency ?? null,
      change24h: c.price_change_percentage_24h_in_currency ?? null,
      change7d: c.price_change_percentage_7d_in_currency ?? null,
      marketCap: c.market_cap,
      volume: c.total_volume,
      sparkline: c.sparkline_in_7d?.price || [],
    }));

    cache = { data: coins, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(coins);
  } catch (err) {
    console.error('[/api/markets]', err.message);
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Market data unavailable' });
  }
}
