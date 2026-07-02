import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tqsftnicscnzvbmwbhhb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key_to_prevent_crash';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
