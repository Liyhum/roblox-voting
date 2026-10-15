import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - TREC KL Fashion Show",
  description: "Privacy Policy for the TREC KL Roblox Fashion Show voting platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col font-sans selection:bg-[#ff007f] selection:text-white">
      {/* Top Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] to-[#00f2fe]" />
      <header className="border-b border-white/10 bg-[#06070a]/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Runway</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-black tracking-wider text-white uppercase italic">
            <span>TREC KL</span>
            <span className="text-[#ff007f]">&bull;</span>
            <span className="text-zinc-400 font-normal">Privacy Policy</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff007f]/15 text-[#ff007f] text-xs font-black uppercase tracking-wider border border-[#ff007f]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal &amp; Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase italic">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: October 2026 &bull; Effective Immediately
          </p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-sm text-zinc-300 leading-relaxed bg-[#0c0e14]/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              1. Overview
            </h2>
            <p>
              This Privacy Policy explains how <b>TREC KL Fashion Show</b> ("we", "our", or "the platform"), accessible via <code>https://roblox-voting-web.vercel.app</code>, collects, uses, and safeguards information when you participate in community fashion voting and outfit submissions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              2. Information Collected via Roblox OAuth 2.0
            </h2>
            <p>
              When you choose to authenticate using <b>Official Roblox OAuth 2.0</b>, we only request access to basic, public profile information through the standard <code>openid</code> and <code>profile</code> scopes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li><b>Roblox User ID:</b> Used solely as an immutable identifier to enforce one vote per outfit.</li>
              <li><b>Roblox Username &amp; Display Name:</b> Displayed publicly alongside your submitted entries or voter badge.</li>
              <li><b>Public Avatar Thumbnail:</b> Displayed in the user header and profile badge.</li>
            </ul>
            <p className="text-emerald-400 font-semibold text-xs mt-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
              ✓ We NEVER have access to your Roblox password, billing information, email, or private account details. Authentication is handled entirely by Roblox Corporation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              3. Contestant Image Submissions
            </h2>
            <p>
              When contestants submit screenshot images of their avatar or outfits, those images are uploaded to our secure cloud storage (Supabase Storage) and displayed publicly in the voting gallery for community judging. Users must ensure their screenshots comply with Roblox Community Standards.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              4. How We Use Information
            </h2>
            <p>Collected data is strictly used for:</p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Verifying voter legitimacy and preventing automated Sybil attacks / duplicate votes.</li>
              <li>Calculating real-time leaderboard rankings and awards.</li>
              <li>Displaying contestant credits and awards podiums.</li>
            </ul>
            <p>We do not sell, rent, or monetize user data with third-party advertising brokers.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              5. Cookies &amp; Local Storage
            </h2>
            <p>
              We use functional session cookies and local storage to remember your authentication state and local vote history. You can clear your session at any time by clicking the disconnect button in the navigation bar.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              6. Data Deletion &amp; Contact
            </h2>
            <p>
              To request removal of your submission or voter log, contact the community administrators or game developers through the official TREC KL Roblox group or community channels.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06070a] py-6 text-center text-xs text-zinc-500">
        <p>&copy; 2026 TREC KL Community Awards &bull; All Rights Reserved.</p>
      </footer>
    </div>
  );
}
