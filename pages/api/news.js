// pages/api/news.js
// Fetches from CryptoPanic public API.
// For production: add your free API key at https://cryptopanic.com/developers/api/
// and set CRYPTOPANIC_KEY in your Vercel environment variables.

const KEY = process.env.CRYPTOPANIC_KEY || 'demo';

let cache = { data: null, ts: 0 };
const CACHE_MS = 180_000; // 3 minutes

export default async function handler(req, res) {
  const { filter = 'all' } = req.query;

  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(filterNews(cache.data, filter));
  }

  try {
    const url =
      `https://cryptopanic.com/api/v1/posts/?auth_token=${KEY}` +
      `&public=true&kind=news&metadata=true`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`CryptoPanic ${response.status}`);

    const data = await response.json();
    const news = (data.results || []).slice(0, 20).map((n) => ({
      id: n.id,
      title: n.title,
      url: n.url,
      source: n.source?.title || 'CryptoPanic',
      published_at: n.published_at,
      currencies: n.currencies || [],
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
    switch (filter) {
      case 'bitcoin':    return t.includes('bitcoin') || t.includes('btc') || n.currencies?.some(c => c.code === 'BTC');
      case 'ethereum':   return t.includes('ethereum') || t.includes('eth') || n.currencies?.some(c => c.code === 'ETH');
      case 'defi':       return t.includes('defi') || t.includes('protocol') || t.includes('liquidity');
      case 'nft':        return t.includes('nft') || t.includes('collectible');
      case 'regulation': return t.includes('sec') || t.includes('regulat') || t.includes('legal');
      case 'altcoin':    return !t.includes('bitcoin') && !t.includes('ethereum');
      default:           return true;
    }
  });
}
