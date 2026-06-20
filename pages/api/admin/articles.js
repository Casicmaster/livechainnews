// pages/api/admin/articles.js
// Protected endpoint for the /admin panel.
// Requires the x-admin-password header to match ADMIN_PASSWORD.

import { getAdminClient } from '../../../lib/supabase';

function parseFaq(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.includes('|'))
    .map((line) => {
      const [q, ...a] = line.split('|');
      return { question: q.trim(), answer: a.join('|').trim() };
    })
    .filter((item) => item.question && item.answer);
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default async function handler(req, res) {
  // Auth check
  const pw = req.headers['x-admin-password'];
  if (!pw || pw !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = getAdminClient();

  try {
    // LIST all (including drafts) for the admin dashboard
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    // CREATE
    if (req.method === 'POST') {
      const b = req.body;
      const slug = b.slug?.trim() || slugify(b.title || 'untitled') + '-' + Date.now().toString().slice(-5);
      const { data, error } = await supabase
        .from('articles')
        .insert([{
          title: b.title,
          slug,
          excerpt: b.excerpt || '',
          body: b.body || '',
          image_url: b.image_url || '',
          image_alt: b.image_alt || '',
          author: b.author || 'LiveChainNews',
          category: b.category || 'News',
          published: !!b.published,
        featured: !!b.featured,
          tags: Array.isArray(b.tags) ? b.tags : [],
          faq: parseFaq(b.faq),
        }])
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    // UPDATE
    if (req.method === 'PUT') {
      const b = req.body;
      const { data, error } = await supabase
        .from('articles')
        .update({
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          body: b.body,
          image_url: b.image_url,
          image_alt: b.image_alt,
          author: b.author,
          category: b.category,
          published: !!b.published,
          featured: !!b.featured,
          tags: Array.isArray(b.tags) ? b.tags : [],
          faq: parseFaq(b.faq),
        })
        .eq('id', b.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    // DELETE
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[/api/admin/articles]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
