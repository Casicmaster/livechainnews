// pages/api/prices.js
// Uses CoinGecko /coins/markets which returns price, 24h change AND logo image.

const COIN_IDS =
  'bitcoin,ethereum,binancecoin,solana,ripple,cardano,avalanche-2,dogecoin,' +
  'polkadot,chainlink,matic-network,uniswap,cosmos,litecoin,near';

let cache = { data: null, ts: 0 };
const CACHE_MS = 30_000;

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    const url =
      `https://api.coingecko.com/api/v3/coins/markets` +
      `?vs_currency=usd&ids=${COIN_IDS}&order=market_cap_desc` +
      `&per_page=50&page=1&price_change_percentage=24h`;

    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`CoinGecko ${response.status}`);

    const raw = await response.json();

    const coins = raw.map((c) => ({
      id: c.id,
      symbol: (c.symbol || '').toUpperCase(),
      name: c.name,
      price: c.current_price,
      change24h: c.price_change_percentage_24h ?? 0,
      marketCap: c.market_cap ?? 0,
      image: c.image || null,
    }));

    cache = { data: coins, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(coins);
  } catch (err) {
    console.error('[/api/prices]', err.message);
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Price data unavailable' });
  }
}