import { createClient } from '@supabase/supabase-js';

// Safe fallbacks to prevent the White Screen of Death if .env variables are missing
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL 
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY 

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_KEY) {
  console.warn('⚠️ Supabase environment variables are missing. Check your .env file.');
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;