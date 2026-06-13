// pages/api/news.js
// Fetches crypto news from CryptoCompare (CoinDesk Data) News API.
// Get a FREE API key at https://min-api.cryptocompare.com
// Then set CRYPTOCOMPARE_KEY in your Vercel environment variables.
// Works without a key too (lower rate limit), so the site never breaks.

const KEY = process.env.CRYPTOCOMPARE_KEY || '';

let cache = { data: null, ts: 0 };
const CACHE_MS = 180_000; // 3 minutes

export default async function handler(req, res) {
  const { filter = 'all' } = req.query;

  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(filterNews(cache.data, filter));
  }

  try {
    let url = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
    if (KEY) url += `&api_key=${KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`CryptoCompare ${response.status}`);

    const data = await response.json();
    const news = (data.Data || []).slice(0, 20).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      source: n.source_info?.name || n.source || 'CryptoCompare',
      published_at: new Date(n.published_on * 1000).toISOString(),
      imageurl: n.imageurl || null,
      body: n.body || '',
      currencies: (n.categories || '')
        .split('|')
        .filter(Boolean)
        .map((c) => ({ code: c })),
    }));

    cache = { data: news, ts: Date.now() };

    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=360');
    return res.status(200).json(filterNews(news, filter));
  } catch (err) {
    console.error('[/api/news]', err.message);
    if (cache.data) return res.status(200).json(filterNews(cache.data, filter));
    return res.status(502).json({ error: 'News unavailable' });
  }
}

function filterNews(news, filter) {
  if (!filter || filter === 'all') return news;
  return news.filter((n) => {
    const t = n.title.toLowerCase();
    const cats = (n.currencies || []).map((c) => c.code.toUpperCase());
    switch (filter) {
      case 'bitcoin':    return t.includes('bitcoin') || t.includes('btc') || cats.includes('BTC');
      case 'ethereum':   return t.includes('ethereum') || t.includes('eth') || cats.includes('ETH');
      case 'defi':       return t.includes('defi') || t.includes('protocol') || t.includes('liquidity') || cats.includes('DEFI');
      case 'nft':        return t.includes('nft') || t.includes('collectible') || cats.includes('NFT');
      case 'regulation': return t.includes('sec') || t.includes('regulat') || t.includes('legal') || cats.includes('REGULATION');
      case 'altcoin':    return !t.includes('bitcoin') && !t.includes('ethereum');
      default:           return true;
    }
  });
}