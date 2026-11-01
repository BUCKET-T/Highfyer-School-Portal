import { createClient } from '@supabase/supabase-js';

// Safe fallbacks to prevent the White Screen of Death if .env variables are missing
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ztlhydgbpzwbvxxatvvk.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'sb_publishable_Mg-39Zcjs6TMkC_D0gogGw_di90sYhc';

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_KEY) {
  console.warn('⚠️ Supabase environment variables are missing. Check your .env file.');
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;