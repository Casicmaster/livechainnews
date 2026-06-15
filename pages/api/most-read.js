// pages/api/most-read.js
// Returns the most-viewed published articles.

import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, category, views, created_at')
      .eq('published', true)
      .order('views', { ascending: false })
      .limit(5);
    if (error) throw error;

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(data || []);
  } catch (err) {
    console.error('[/api/most-read]', err.message);
    return res.status(200).json([]);
  }
}
