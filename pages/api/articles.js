// pages/api/articles.js
// Public endpoint: returns published articles for the homepage and /news.

import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { slug, filter = 'all', limit = 30, tag, author } = req.query;

  try {
    // Single article by slug
    if (slug) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    // List of articles
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (filter && filter !== 'all') {
      query = query.ilike('category', filter);
    }
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    if (author) {
      query = query.ilike('author', author);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(data || []);
  } catch (err) {
    console.error('[/api/articles]', err.message);
    return res.status(200).json(slug ? null : []);
  }
}
