import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Public client (browser-safe, respects Row Level Security)
export const supabase = createClient(url, anonKey);

// Server-only admin client (full access — never import in client components)
export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
