import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const REQUIRED_GROUP_ID = 740188661; // FEMME'S STUDIO
const REQUIRED_GROUP_NAME = "FEMME'S STUDIO";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zlrtrydfvzlxodbbhslv.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscnRyeWRmdnpseG9kYmJoc2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTE3MTYsImV4cCI6MjEwNzYyNzcxNn0.mr4b7qAGGiPTbLLc45dcOENGmUNFIQA9m2uRPiZfdpI";

const supabase = createClient(supabaseUrl, supabaseKey);

// Sleep helper to avoid hitting Roblox rate limits (429)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAllVotes() {
  let allVotes = [];
  let from = 0;
  const batchSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const to = from + batchSize - 1;
    const { data, error } = await supabase
      .from("votes_log")
      .select("*")
      .range(from, to);

    if (error) {
      console.error("Error fetching votes_log:", error);
      break;
    }

    if (!data || data.length === 0) {
      hasMore = false;
    } else {
      allVotes = allVotes.concat(data);
      if (data.length < batchSize) {
        hasMore = false;
      } else {
        from += batchSize;
      }
    }
  }

  return allVotes;
}

async function checkRobloxUserInGroup(userId) {
  try {
    const res = await fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles`);
    if (res.status === 429) {
      // Rate limited, wait 2 seconds and retry once
      await sleep(2000);
      const retryRes = await fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles`);
      if (!retryRes.ok) return false;
      const data = await retryRes.json();
      return data.data?.some((g) => g.group?.id === REQUIRED_GROUP_ID) || false;
    }
    if (!res.ok) return false;
    const data = await res.json();
    return data.data?.some((g) => g.group?.id === REQUIRED_GROUP_ID) || false;
  } catch (err) {
    console.error(`Error checking user ${userId}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("=========================================================");
  console.log("🔍 TREC KL VOTING AUDIT - FEMME'S STUDIO GROUP VERIFICATION");
  console.log("=========================================================\n");

  console.log("📥 Mengambil seluruh data votes_log dari Supabase...");
  const allVotes = await fetchAllVotes();
  console.log(`✅ Berhasil mengambil total ${allVotes.length} baris vote.\n`);

  if (allVotes.length === 0) {
    console.log("Tidak ada vote yang perlu diperiksa.");
    return;
  }

  // Group by unique voter ID
  const voterMap = new Map();
  for (const vote of allVotes) {
    const uid = vote.voter_roblox_id;
    if (!voterMap.has(uid)) {
      voterMap.set(uid, {
        id: uid,
        username: vote.voter_roblox_username,
        voteCount: 0,
        voteIds: [],
        submissionIds: [],
      });
    }
    const record = voterMap.get(uid);
    record.voteCount++;
    record.voteIds.push(vote.id);
    record.submissionIds.push(vote.submission_id);
  }

  const uniqueVoterList = Array.from(voterMap.values());
  console.log(`👥 Terdapat ${uniqueVoterList.length} akun Roblox unik yang sudah voting.\n`);

  console.log("🔎 Memeriksa keanggotaan group FEMME'S STUDIO (ID: 740188661) di API Roblox...");
  console.log("-----------------------------------------------------------------------------");

  const validVoters = [];
  const invalidVoters = [];

  // Check in chunks of 10 concurrent requests for fast execution
  const CHUNK_SIZE = 10;
  for (let i = 0; i < uniqueVoterList.length; i += CHUNK_SIZE) {
    const chunk = uniqueVoterList.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map(async (voter, idx) => {
        const inGroup = await checkRobloxUserInGroup(voter.id);
        const currentNum = i + idx + 1;
        if (inGroup) {
          validVoters.push(voter);
          console.log(`[${currentNum}/${uniqueVoterList.length}] ✅ @${voter.username} (ID: ${voter.id}) -> MEMBER`);
        } else {
          invalidVoters.push(voter);
          console.log(`[${currentNum}/${uniqueVoterList.length}] ❌ @${voter.username} (ID: ${voter.id}) -> BUKAN MEMBER`);
        }
      })
    );
    await sleep(250);
  }

  console.log("\n=========================================================");
  console.log("📊 HASIL AUDIT VOTING:");
  console.log("=========================================================");
  console.log(`Total Vote di Database   : ${allVotes.length} votes`);
  console.log(`Total Akun Pemilih Unik  : ${uniqueVoterList.length} akun`);
  console.log(`✅ Akun Valid (Member)   : ${validVoters.length} akun (${validVoters.reduce((acc, v) => acc + v.voteCount, 0)} votes)`);
  console.log(`❌ Akun Invalid (Bukan)  : ${invalidVoters.length} akun (${invalidVoters.reduce((acc, v) => acc + v.voteCount, 0)} votes)`);
  console.log("=========================================================\n");

  // Generate SQL Script
  const invalidIds = invalidVoters.map((v) => v.id);
  const invalidUsernames = invalidVoters.map((v) => v.username);

  let sqlContent = `-- ==============================================================================
-- SQL CLEANUP: HAPUS VOTE DARI AKUN YANG BELUM JOIN GRUP FEMME'S STUDIO
-- Total akun invalid: ${invalidVoters.length} akun
-- Total vote yang akan dihapus: ${invalidVoters.reduce((acc, v) => acc + v.voteCount, 0)} votes
-- Dibuat otomatis pada: ${new Date().toISOString()}
-- ==============================================================================

-- 1. Hapus vote log dari voter_roblox_id yang terbukti bukan anggota grup FEMME'S STUDIO
DELETE FROM public.votes_log
WHERE voter_roblox_id IN (
  ${invalidIds.join(",\n  ")}
);

-- 2. Sinkronkan ulang perolehan suara di tabel submissions agar sesuai dengan suara valid yang tersisa
UPDATE public.submissions s
SET votes = COALESCE((
  SELECT COUNT(*) FROM public.votes_log vl
  WHERE vl.submission_id = s.id
), 0);

-- 3. Cek hasil perolehan suara terbaru setelah dibersihkan
SELECT roblox_username, votes FROM public.submissions ORDER BY votes DESC;
`;

  const outputPath = path.join(process.cwd(), "CLEANUP_INVALID_VOTES.sql");
  fs.writeFileSync(outputPath, sqlContent, "utf-8");
  console.log(`📄 Script SQL Pembersihan telah dibuat di: CLEANUP_INVALID_VOTES.sql`);

  // Save JSON report
  const reportPath = path.join(process.cwd(), "audit_report.json");
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        totalVotes: allVotes.length,
        totalUniqueVoters: uniqueVoterList.length,
        validCount: validVoters.length,
        invalidCount: invalidVoters.length,
        validVotes: validVoters.reduce((acc, v) => acc + v.voteCount, 0),
        invalidVotes: invalidVoters.reduce((acc, v) => acc + v.voteCount, 0),
        invalidVoters: invalidVoters.map((v) => ({ id: v.id, username: v.username, votes: v.voteCount })),
      },
      null,
      2
    ),
    "utf-8"
  );
  console.log(`📄 Laporan detail JSON telah disimpan di: audit_report.json\n`);
}

main().catch((err) => {
  console.error("Audit error:", err);
});
