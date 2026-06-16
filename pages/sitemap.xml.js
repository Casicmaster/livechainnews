// pages/sitemap.xml.js
// Generates a sitemap including all published articles + static pages.

import { supabase } from '../lib/supabase';

const SITE = 'https://livechainnews.com';

function generateSiteMap(articles) {
  const staticPages = ['', '/news', '/prices', '/trending', '/advertise', '/about'];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (path) => `
  <url>
    <loc>${SITE}${path}</loc>
    <changefreq>${path === '' || path === '/news' ? 'hourly' : 'weekly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.7'}</priority>
  </url>`
    )
    .join('')}
  ${articles
    .map(
      (a) => `
  <url>
    <loc>${SITE}/news/${a.slug}</loc>
    <lastmod>${new Date(a.created_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  let articles = [];
  try {
    const { data } = await supabase
      .from('articles')
      .select('slug, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false });
    articles = data || [];
  } catch (e) {
    articles = [];
  }

  const sitemap = generateSiteMap(articles);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function SiteMap() {
  return null;
}
