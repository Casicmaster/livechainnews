// pages/api/news.js
// Reads public RSS feeds from major crypto outlets. No API key required.

const FEEDS = [
  { url: 'https://cointelegraph.com/rss',   source: 'Cointelegraph' },
  { url: 'https://decrypt.co/feed',         source: 'Decrypt' },
  { url: 'https://www.theblock.co/rss.xml', source: 'The Block' },
  { url: 'https://cryptoslate.com/feed/',   source: 'CryptoSlate' },
  { url: 'https://bitcoinmagazine.com/feed', source: 'Bitcoin Magazine' },
];

let cache = { data: null, ts: 0 };
const CACHE_MS = 300_000;

export default async function handler(req, res) {
  const { filter = 'all' } = req.query;

  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(filterNews(cache.data, filter));
  }

  try {
    const results = await Promise.allSettled(
      FEEDS.map((f) => fetchFeed(f.url, f.source))
    );

    let all = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value) all = all.concat(r.value);
    }

    all.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    all = all.slice(0, 24);

    if (all.length) {
      cache = { data: all, ts: Date.now() };
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return res.status(200).json(filterNews(all, filter));
    }

    if (cache.data) return res.status(200).json(filterNews(cache.data, filter));
    return res.status(200).json([]);
  } catch (err) {
    console.error('[/api/news]', err.message);
    if (cache.data) return res.status(200).json(filterNews(cache.data, filter));
    return res.status(200).json([]);
  }
}

async function fetchFeed(url, source) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (LiveChainNews RSS Reader)' },
    });
    if (!r.ok) return [];
    const xml = await r.text();
    return parseRss(xml, source);
  } catch (e) {
    console.error(`[news] feed failed ${source}:`, e.message);
    return [];
  }
}

function parseRss(xml, source) {
  const items = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const item of itemMatches.slice(0, 8)) {
    const title = extractTag(item, 'title');
    const link = extractTag(item, 'link');
    const pubDate = extractTag(item, 'pubDate');
    const desc = extractTag(item, 'description');

    let img = null;
    const mediaMatch = item.match(/<media:content[^>]*url="([^"]+)"/i)
      || item.match(/<enclosure[^>]*url="([^"]+)"/i)
      || item.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
    if (mediaMatch) img = mediaMatch[1];
    if (!img && desc) {
      const imgInDesc = desc.match(/<img[^>]*src="([^"]+)"/i);
      if (imgInDesc) img = imgInDesc[1];
    }

    if (title && link) {
      items.push({
        id: link,
        title: cleanText(title),
        url: cleanText(link),
        source,
        published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        imageurl: img,
        currencies: [],
      });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? m[1].trim() : '';
}

function cleanText(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function filterNews(news, filter) {
  if (!filter || filter === 'all') return news;
  return news.filter((n) => {
    const t = n.title.toLowerCase();
    switch (filter) {
      case 'bitcoin':    return t.includes('bitcoin') || t.includes('btc');
      case 'ethereum':   return t.includes('ethereum') || t.includes('eth');
      case 'defi':       return t.includes('defi') || t.includes('protocol') || t.includes('liquidity');
      case 'nft':        return t.includes('nft') || t.includes('collectible');
      case 'regulation': return t.includes('sec') || t.includes('regulat') || t.includes('legal') || t.includes('ban');
      case 'altcoin':    return !t.includes('bitcoin') && !t.includes('ethereum');
      default:           return true;
    }
  });
}