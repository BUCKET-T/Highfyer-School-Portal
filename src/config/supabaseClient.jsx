import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Dynamic storage: Uses sessionStorage by default (cleared on tab close),
// or localStorage if "Remember me on this workstation" is checked.
const customStorage = {
  getItem: (key) => {
    const remember = window.localStorage.getItem('remember_me') === 'true';
    if (remember) {
      return window.localStorage.getItem(key);
    }
    return window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    const remember = window.localStorage.getItem('remember_me') === 'true';
    if (remember) {
      window.localStorage.setItem(key, value);
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabaseClient;