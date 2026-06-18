import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(200).json([]);
  }

  const search = q.trim();

  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, category, author, created_at, image_url')
    .eq('published', true)
    .or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,body.ilike.%${search}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data || []);
}