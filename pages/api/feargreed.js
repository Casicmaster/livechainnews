// pages/api/feargreed.js

let cache = { data: null, ts: 0 };
const CACHE_MS = 3_600_000; // 1 hour (index updates once daily)

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < CACHE_MS) {
    return res.status(200).json(cache.data);
  }

  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    if (!response.ok) throw new Error(`FNG ${response.status}`);
    const raw = await response.json();

    const result = {
      value: parseInt(raw.data[0].value),
      classification: raw.data[0].value_classification,
      timestamp: raw.data[0].timestamp,
    };

    cache = { data: result, ts: Date.now() };

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');
    return res.status(200).json(result);
  } catch (err) {
    console.error('[/api/feargreed]', err.message);
    if (cache.data) return res.status(200).json(cache.data);
    return res.status(502).json({ error: 'Fear & Greed data unavailable' });
  }
}
