import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zlrtrydfvzlxodbbhslv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscnRyeWRmdnpseG9kYmJoc2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTE3MTYsImV4cCI6MjEwNzYyNzcxNn0.mr4b7qAGGiPTbLLc45dcOENGmUNFIQA9m2uRPiZfdpI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking votes_log and submissions in Supabase...");
  
  const { data: submissions, error: subErr } = await supabase
    .from("submissions")
    .select("id, roblox_username, votes")
    .order("votes", { ascending: false });

  if (subErr) {
    console.error("Submissions Error:", subErr);
  } else {
    console.log(`Total Submissions: ${submissions.length}`);
    console.log("Top submissions:", submissions.slice(0, 5));
  }

  const { data: votes, error: voteErr } = await supabase
    .from("votes_log")
    .select("*");

  if (voteErr) {
    console.error("Votes_log Error:", voteErr);
  } else {
    console.log(`Total votes_log records: ${votes?.length || 0}`);
    if (votes && votes.length > 0) {
      console.log("Sample votes:", votes.slice(0, 5));
      const uniqueVoters = new Set(votes.map(v => v.voter_roblox_username));
      console.log(`Unique voters count: ${uniqueVoters.size}`);
      console.log("Unique usernames:", Array.from(uniqueVoters).slice(0, 10));
    }
  }
}

check();
