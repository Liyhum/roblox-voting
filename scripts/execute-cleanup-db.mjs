import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zlrtrydfvzlxodbbhslv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscnRyeWRmdnpseG9kYmJoc2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTE3MTYsImV4cCI6MjEwNzYyNzcxNn0.mr4b7qAGGiPTbLLc45dcOENGmUNFIQA9m2uRPiZfdpI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log("🚀 MEMULAI PEMBERSIHAN DATA VOTE DI SUPABASE...\n");

  const reportRaw = fs.readFileSync('audit_report.json', 'utf8');
  const report = JSON.parse(reportRaw);

  const invalidIds = report.invalidVoters.map(v => v.id);
  console.log(`📋 Total Akun Invalid yang akan dibersihkan: ${invalidIds.length} akun`);
  console.log(`🗑️ Total Suara yang akan dihapus: ${report.invalidVotes} votes\n`);

  // Delete in batches of 100 IDs to avoid query string length limits
  const BATCH_SIZE = 100;
  let totalDeletedVotes = 0;

  for (let i = 0; i < invalidIds.length; i += BATCH_SIZE) {
    const chunk = invalidIds.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase
      .from('votes_log')
      .delete()
      .in('voter_roblox_id', chunk)
      .select('id');

    if (error) {
      console.error(`❌ Gagal menghapus batch ${i + 1} - ${i + chunk.length}:`, error.message);
    } else {
      totalDeletedVotes += (data?.length || 0);
      process.stdout.write(`\r⏳ Menghapus votes_log: ${Math.min(i + BATCH_SIZE, invalidIds.length)} / ${invalidIds.length} akun (${totalDeletedVotes} votes terhapus)...`);
    }
  }

  console.log(`\n\n✅ SELESAI MENGHAPUS: ${totalDeletedVotes} vote log telah dibersihkan dari database!`);

  // Recalculate submissions votes
  console.log("\n🔄 Menghitung ulang total suara sah untuk setiap kontestan...");
  const { data: allVotesLeft, error: countErr } = await supabase
    .from('votes_log')
    .select('submission_id');

  if (countErr) {
    console.error("Gagal membaca sisa votes_log:", countErr.message);
    return;
  }

  const tallyMap = {};
  for (const v of (allVotesLeft || [])) {
    tallyMap[v.submission_id] = (tallyMap[v.submission_id] || 0) + 1;
  }

  const { data: submissions, error: subErr } = await supabase
    .from('submissions')
    .select('id, roblox_username, votes');

  if (subErr) {
    console.error("Gagal membaca submissions:", subErr.message);
    return;
  }

  for (const sub of (submissions || [])) {
    const actualCount = tallyMap[sub.id] || 0;
    if (sub.votes !== actualCount) {
      await supabase
        .from('submissions')
        .update({ votes: actualCount })
        .eq('id', sub.id);
      console.log(`  ⭐ Kontestan @${sub.roblox_username}: ${sub.votes} -> ${actualCount} suara sah`);
    }
  }

  console.log("\n🎉 SELURUH DATA VOTING DATABASE TELAH BERSIH & AKURAT 100%!");
}

main().catch(console.error);
