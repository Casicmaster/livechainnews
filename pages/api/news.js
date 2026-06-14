// pages/api/news.js
// Tries CryptoCompare first, falls back to CoinGecko news, then to static fallback.

const CC_KEY = process.env.CRYPTOCOMPARE_KEY || '';
const CG_KEY = process.env.COINGECKO_KEY || '';

let cache = { data: null, ts: 0 };
const CACHE_MS = 180_000;

export default async function handler(req, res) {
  const { filter = 'all' } = req.query;

  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(filterNews(cache.data, filter));
  }

  let news = null;

  try {
    let url = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';
    if (CC_KEY) url += `&api_key=${CC_KEY}`;
    const r = await fetch(url);
    if (r.ok) {
      const d = await r.json();
      if (d.Data && d.Data.length) {
        news = d.Data.slice(0, 20).map((n) => ({
          id: n.id,
          title: n.title,
          url: n.url,
          source: n.source_info?.name || n.source || 'CryptoCompare',
          published_at: new Date(n.published_on * 1000).toISOString(),
          imageurl: n.imageurl || null,
          currencies: (n.categories || '').split('|').filter(Boolean).map((c) => ({ code: c })),
        }));
      }
    }
  } catch (e) {
    console.error('[news] CryptoCompare failed:', e.message);
  }

  if (!news) {
    try {
      let url = 'https://api.coingecko.com/api/v3/news';
      if (CG_KEY) url += `?x_cg_demo_api_key=${CG_KEY}`;
      const r = await fetch(url, { headers: { accept: 'application/json' } });
      if (r.ok) {
        const d = await r.json();
        const arr = d.data || [];
        if (arr.length) {
          news = arr.slice(0, 20).map((n, i) => ({
            id: n.id || i,
            title: n.title || n.description || 'Untitled',
            url: n.url || '#',
            source: n.news_site || n.author || 'CoinGecko',
            published_at: n.updated_at
              ? new Date(n.updated_at * 1000).toISOString()
              : new Date().toISOString(),
            imageurl: n.thumb_2x || null,
            currencies: [],
          }));
        }
      }
    } catch (e) {
      console.error('[news] CoinGecko failed:', e.message);
    }
  }

  if (news) {
    cache = { data: news, ts: Date.now() };
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=360');
    return res.status(200).json(filterNews(news, filter));
  }

  if (cache.data) return res.status(200).json(filterNews(cache.data, filter));
  return res.status(200).json([]);
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