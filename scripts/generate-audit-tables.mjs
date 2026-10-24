import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zlrtrydfvzlxodbbhslv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscnRyeWRmdnpseG9kYmJoc2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTE3MTYsImV4cCI6MjEwNzYyNzcxNn0.mr4b7qAGGiPTbLLc45dcOENGmUNFIQA9m2uRPiZfdpI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  const reportRaw = fs.readFileSync('audit_report.json', 'utf8');
  const report = JSON.parse(reportRaw);

  const invalidIdSet = new Set(report.invalidVoters.map(v => v.id));

  // Get all votes from DB
  const { data: allVotes, error } = await supabase
    .from('votes_log')
    .select('voter_roblox_id, voter_roblox_username, created_at, submission_id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const validMap = new Map();
  for (const v of allVotes) {
    const voterId = Number(v.voter_roblox_id);
    if (!invalidIdSet.has(voterId)) {
      if (!validMap.has(voterId)) {
        validMap.set(voterId, {
          id: voterId,
          username: v.voter_roblox_username,
          votes: 0
        });
      }
      validMap.get(voterId).votes += 1;
    }
  }

  const validVoters = Array.from(validMap.values());
  console.log(`Found ${validVoters.length} valid voters!`);

  // Update audit_report.json to include validVoters
  report.validVoters = validVoters;
  fs.writeFileSync('audit_report.json', JSON.stringify(report, null, 2));

  // 1. Generate CSV of Invalid Voters (all 1,331)
  const csvInvalidLines = ['No,Roblox ID,Username,Votes Cast,Community Status'];
  report.invalidVoters.forEach((voter, idx) => {
    csvInvalidLines.push(`${idx + 1},${voter.id},"${voter.username}",${voter.votes},BELUM JOIN FEMME'S STUDIO`);
  });
  fs.writeFileSync('audit_invalid_voters.csv', csvInvalidLines.join('\n'));

  // 2. Generate CSV of Valid Voters (68 accounts)
  const csvValidLines = ['No,Roblox ID,Username,Votes Cast,Community Status'];
  validVoters.forEach((voter, idx) => {
    csvValidLines.push(`${idx + 1},${voter.id},"${voter.username}",${voter.votes},SUDAH JOIN FEMME'S STUDIO (MEMBER)`);
  });
  fs.writeFileSync('audit_valid_voters.csv', csvValidLines.join('\n'));

  // 3. Generate Markdown Report Tables Document
  let md = `# 📊 LAPORAN AUDIT & DAFTAR VOTE ROBBLOX: FEMME'S STUDIO (GROUP ID: 740188661)

Audit dilakukan pada data aktual database Supabase \`votes_log\`.
Setiap akun pemilih diverifikasi langsung ke server Roblox API: \`https://groups.roblox.com/v1/users/{userId}/groups/roles\`.

### Ringkasan Hasil Audit:
- **Total Suara Masuk di Database:** **${report.totalVotes} votes**
- **Total Akun Unik:** **${report.totalUniqueVoters} akun**
- **✅ Akun VALID (Anggota Resmi FEMME'S STUDIO):** **${validVoters.length} akun** (${report.validVotes} votes)
- **❌ Akun TIDAK VALID (Belum/Tidak Pernah Join Group):** **${report.invalidCount} akun** (${report.invalidVotes} votes)

---

## 📋 1. DAFTAR LENGKAP AKUN VALID (Sudah Join Komunitas FEMME'S STUDIO)
*Total ${validVoters.length} akun terverifikasi asli dan suaranya sah dihitung.*

| No | Roblox User ID | Username Roblox | Suara Masuk | Status Komunitas | Profil Roblox |
| :---: | :--- | :--- | :---: | :---: | :---: |
`;

  validVoters.forEach((voter, idx) => {
    md += `| ${idx + 1} | \`${voter.id}\` | **${voter.username}** | ${voter.votes} | ✅ Member | [Buka Profil](https://www.roblox.com/users/${voter.id}/profile) |\n`;
  });

  md += `\n---\n\n## 🚨 2. DAFTAR AKUN TIDAK VALID (Belum Join Komunitas FEMME'S STUDIO)\n`;
  md += `*Total ${report.invalidCount} akun TIDAK lolos verifikasi komunitas. Data lengkap dalam bentuk file Excel/Spreadsheet dapat diunduh di file \`audit_invalid_voters.csv\`.*\n\n`;
  md += `| No | Roblox User ID | Username Roblox | Suara Masuk | Status Komunitas | Profil Roblox |\n`;
  md += `| :---: | :--- | :--- | :---: | :---: | :---: |\n`;

  report.invalidVoters.forEach((voter, idx) => {
    md += `| ${idx + 1} | \`${voter.id}\` | ${voter.username} | ${voter.votes} | ❌ Belum Join | [Buka Profil](https://www.roblox.com/users/${voter.id}/profile) |\n`;
  });

  fs.writeFileSync('AUDIT_REPORT_TABLES.md', md);
  console.log('Generated AUDIT_REPORT_TABLES.md, audit_invalid_voters.csv, audit_valid_voters.csv successfully!');
}

run();
