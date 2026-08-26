import { createClient } from "@supabase/supabase-js";

let supabaseBrowserClient = null;
let supabaseServerClient = null;

export function supabaseBrowser() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  return supabaseBrowserClient;
}

export function supabaseServer() {
  if (!supabaseServerClient) {
    supabaseServerClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return supabaseServerClient;
}
