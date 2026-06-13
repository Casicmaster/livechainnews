// pages/api/prices.js
// Proxies CoinGecko so the API key stays server-side
// and we can add caching later (Redis, Vercel KV, etc.)

const COIN_IDS =
  'bitcoin,ethereum,binancecoin,solana,ripple,cardano,avalanche-2,dogecoin,' +
  'polkadot,chainlink,matic-network,uniswap,cosmos,litecoin,near';

const SYMBOL_MAP = {
  bitcoin: 'BTC', ethereum: 'ETH', binancecoin: 'BNB', solana: 'SOL',
  ripple: 'XRP', cardano: 'ADA', 'avalanche-2': 'AVAX', dogecoin: 'DOGE',
  polkadot: 'DOT', chainlink: 'LINK', 'matic-network': 'MATIC',
  uniswap: 'UNI', cosmos: 'ATOM', litecoin: 'LTC', near: 'NEAR',
};

let cache = { data: null, ts: 0 };
const CACHE_MS = 30_000; // 30 second cache

export default async function handler(req, res) {
  // Return cached data if fresh
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    const url =
      `https://api.coingecko.com/api/v3/simple/price` +
      `?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;

    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error(`CoinGecko ${response.status}`);

    const raw = await response.json();

    // Normalise to { BTC: { price, change24h, marketCap }, ... }
    const coins = Object.entries(raw).map(([id, v]) => ({
      id,
      symbol: SYMBOL_MAP[id] || id.toUpperCase(),
      price: v.usd,
      change24h: v.usd_24h_change ?? 0,
      marketCap: v.usd_market_cap ?? 0,
    }));

    cache = { data: coins, ts: Date.now() };

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(coins);
  } catch (err) {
    console.error('[/api/prices]', err.message);
    // Return stale cache if available
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Price data unavailable' });
  }
}
