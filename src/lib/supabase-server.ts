import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

// Prefer service role key on server-side if provided, fallback to anon key
const serverKey = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
).trim();

export const isServerSupabaseConfigured = Boolean(
  cleanUrl &&
    serverKey &&
    cleanUrl.startsWith("http") &&
    !cleanUrl.includes("your-project-id")
);

export const supabaseServer = createClient(
  isServerSupabaseConfigured ? cleanUrl : "https://placeholder.supabase.co",
  isServerSupabaseConfigured ? serverKey : "placeholder-key",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
