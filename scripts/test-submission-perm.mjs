import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zlrtrydfvzlxodbbhslv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscnRyeWRmdnpseG9kYmJoc2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTE3MTYsImV4cCI6MjEwNzYyNzcxNn0.mr4b7qAGGiPTbLLc45dcOENGmUNFIQA9m2uRPiZfdpI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase
    .from('submissions')
    .select('id, roblox_username, votes')
    .limit(1);

  console.log('Submission select:', { error, data });
}

check();
