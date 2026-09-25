import { createClient } from "@supabase/supabase-js";

let supabaseBrowserClient = null;
let supabaseServerClient = null;

export function supabaseBrowser() {
  if (!supabaseBrowserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    supabaseBrowserClient = createClient(url, key);
  }
  return supabaseBrowserClient;
}

export function supabaseServer() {
  if (!supabaseServerClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    supabaseServerClient = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return supabaseServerClient;
}
