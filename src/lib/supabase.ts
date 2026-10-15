import { createClient } from "@supabase/supabase-js";

let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Bersihkan jika ada /rest/v1 atau slash di akhir
const cleanUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

export const isSupabaseConfigured = Boolean(
  cleanUrl &&
    supabaseAnonKey &&
    cleanUrl.startsWith("http") &&
    !cleanUrl.includes("your-project-id")
);

// Fallback dummy client jika belum diisi agar Next.js tidak crash
export const supabase = createClient(
  isSupabaseConfigured ? cleanUrl : "https://placeholder.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-key"
);

export interface Submission {
  id: string;
  roblox_username: string;
  roblox_avatar_url?: string | null;
  caption?: string | null;
  image_url: string;
  votes: number;
  created_at: string;
}
