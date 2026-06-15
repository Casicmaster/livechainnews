// pages/api/view.js
// Increments the view counter for an article.

import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  const { slug } = req.body || {};
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  try {
    const supabase = getAdminClient();
    const { error } = await supabase.rpc('increment_views', { article_slug: slug });
    if (error) throw error;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[/api/view]', err.message);
    return res.status(200).json({ ok: false });
  }
}
