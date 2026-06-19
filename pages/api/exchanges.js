// pages/api/exchanges.js
// Real exchange data from CoinGecko: name, logo, trust score, 24h volume (BTC).
let cache = { data: null, ts: 0 };
const CACHE_MS = 300_000; // 5 minutes

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }
  try {
    // Get top exchanges by trust score
    const exUrl = 'https://api.coingecko.com/api/v3/exchanges?per_page=20&page=1';
    const exRes = await fetch(exUrl, {
      headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '' },
    });
    if (!exRes.ok) throw new Error(`CoinGecko exchanges ${exRes.status}`);
    const exchanges = await exRes.json();

    // Get current BTC price to convert volume from BTC to USD
    const btcUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
    const btcRes = await fetch(btcUrl, {
      headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '' },
    });
    const btcData = await btcRes.json();
    const btcPrice = btcData?.bitcoin?.usd || 0;

    const result = exchanges.map((e, i) => ({
      rank: i + 1,
      id: e.id,
      name: e.name,
      logo: e.image,
      url: e.url,
      trustScore: e.trust_score ?? null,
      trustRank: e.trust_score_rank ?? null,
      volumeBtc: e.trade_volume_24h_btc ?? 0,
      volumeUsd: btcPrice ? (e.trade_volume_24h_btc || 0) * btcPrice : null,
      year: e.year_established ?? null,
      country: e.country ?? null,
    }));

    cache = { data: result, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/api/exchanges]', err.message);
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Exchange data unavailable' });
  }
}