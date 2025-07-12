import { createClient } from '@supabase/supabase-js'

// Project URL and anon key
const SUPABASE_URL = 'https://jmmoykgvijqygzqhnzid.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbW95a2d2aWpxeWd6cWhuemlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDg1NTMsImV4cCI6MjA2NDA4NDU1M30.Be5sPINHJfl5RZyKyqCWMV5Ug9NOLuASU_m1gvLQTp4'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})