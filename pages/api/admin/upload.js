// pages/api/admin/upload.js
// Receives a base64 image from the admin panel and uploads it to Supabase Storage.

import { getAdminClient } from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: { sizeLimit: '8mb' },
  },
};

export default async function handler(req, res) {
  const pw = req.headers['x-admin-password'];
  if (!pw || pw !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileName, fileData } = req.body || {};
  if (!fileData || !fileName) {
    return res.status(400).json({ error: 'Missing file' });
  }

  try {
    const match = fileData.match(/^data:(.+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: 'Invalid file format' });

    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');

    const ext = (fileName.split('.').pop() || 'jpg').toLowerCase();
    const baseName = fileName
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'image';
    const safeName = `${baseName}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

    const supabase = getAdminClient();
    const { error } = await supabase.storage
      .from('article-images')
      .upload(safeName, buffer, { contentType, upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from('article-images').getPublicUrl(safeName);

    return res.status(200).json({ url: data.publicUrl });
  } catch (err) {
    console.error('[/api/admin/upload]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
