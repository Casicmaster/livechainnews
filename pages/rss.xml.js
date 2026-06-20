// pages/rss.xml.js
// Generates an RSS 2.0 feed of the latest published articles.
import { supabase } from '../lib/supabase';

const SITE = 'https://livechainnews.com';

function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRss(articles) {
  const items = articles.map((a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE}/news/${a.slug}</link>
      <guid isPermaLink="true">${SITE}/news/${a.slug}</guid>
      <description>${escapeXml(a.excerpt || a.title)}</description>
      ${a.category ? `<category>${escapeXml(a.category)}</category>` : ''}
      <pubDate>${new Date(a.created_at).toUTCString()}</pubDate>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LiveChainNews — Crypto News &amp; Market Insights</title>
    <link>${SITE}</link>
    <description>Real-time crypto news, trending tokens, and market analysis.</description>
    <language>en-us</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;
}

export async function getServerSideProps({ res }) {
  let articles = [];
  try {
    const { data } = await supabase
      .from('articles')
      .select('title, slug, excerpt, category, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(30);
    articles = data || [];
  } catch (e) {
    articles = [];
  }
  const rss = generateRss(articles);
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.write(rss);
  res.end();
  return { props: {} };
}

export default function Rss() {
  return null;
}