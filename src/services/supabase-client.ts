import { createClient } from '@supabase/supabase-js';

// Default to the project's public Supabase URL and public anon key
const DEFAULT_SUPABASE_URL = 'https://dmxkiysrchemveuducbq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteGtpeXNyY2hlbXZldWR1Y2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwOTU5NzcsImV4cCI6MjEwOTY3MTk3N30.pX_xFeMvXz3xIBn-AC_nQKpZZgw4tpB83srxjukK984';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 20
);

// Safe initialization that never crashes the app on missing/invalid keys
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : ({
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ error: null }),
        updateUser: async () => ({ data: { user: null }, error: null })
      }
    } as any);

