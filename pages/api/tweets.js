import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  // GET - list all tweets
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('tweets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }

  // POST - add tweet (admin only)
  if (req.method === 'POST') {
    const { password, url, note } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { data, error } = await supabase
      .from('tweets')
      .insert([{ url, note }])
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // DELETE - remove tweet (admin only)
  if (req.method === 'DELETE') {
    const { password, id } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { error } = await supabase
      .from('tweets')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}