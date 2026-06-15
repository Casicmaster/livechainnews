// pages/api/global.js
// Total market cap, BTC dominance, 24h volume, and total cap change.

let cache = { data: null, ts: 0 };
const CACHE_MS = 60_000;

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    const r = await fetch('https://api.coingecko.com/api/v3/global', {
      headers: { accept: 'application/json' },
    });
    if (!r.ok) throw new Error(`CoinGecko global ${r.status}`);
    const json = await r.json();
    const d = json.data;

    const result = {
      totalMarketCap: d.total_market_cap?.usd ?? null,
      totalVolume: d.total_volume?.usd ?? null,
      marketCapChange24h: d.market_cap_change_percentage_24h_usd ?? null,
      btcDominance: d.market_cap_percentage?.btc ?? null,
      ethDominance: d.market_cap_percentage?.eth ?? null,
      activeCryptos: d.active_cryptocurrencies ?? null,
    };

    cache = { data: result, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/api/global]', err.message);
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Global data unavailable' });
  }
}
