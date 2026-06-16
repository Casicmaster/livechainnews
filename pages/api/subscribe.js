// pages/api/subscribe.js
// Saves an email to the subscribers table.

import { getAdminClient } from '../../lib/supabase';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source } = req.body || {};

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email: email.toLowerCase().trim(), source: source || 'website' }]);

    if (error) {
      if (error.code === '23505') {
        return res.status(200).json({ ok: true, message: "You're already subscribed!" });
      }
      throw error;
    }

    return res.status(200).json({ ok: true, message: 'Subscribed! Check your inbox soon.' });
  } catch (err) {
    console.error('[/api/subscribe]', err.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
