import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseRole = process.env.NEXT_PUBLIC_SUPABASE_ROLE_KEY!;

export const db = createClient(supabaseUrl, supabaseRole,
     { auth: { persistSession: false } }
);
