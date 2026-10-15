import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - TREC KL Fashion Show",
  description: "Terms of Service for the TREC KL Roblox Fashion Show voting platform.",
};

export default function TermsPage() {
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
            <span className="text-zinc-400 font-normal">Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f2fe]/15 text-[#00f2fe] text-xs font-black uppercase tracking-wider border border-[#00f2fe]/30">
            <Scale className="w-3.5 h-3.5" />
            Community Rules &amp; Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase italic">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: October 2026 &bull; Effective Immediately
          </p>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-sm text-zinc-300 leading-relaxed bg-[#0c0e14]/80 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, voting, or submitting media to <b>TREC KL Fashion Show</b> (<code>https://roblox-voting-web.vercel.app</code>), you confirm that you have read, understood, and agreed to be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              2. Roblox Community Standards
            </h2>
            <p>
              All submissions and user conduct must fully comply with the official <b>Roblox Terms of Use</b> and <b>Roblox Community Standards</b>.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>No NSFW, sexually suggestive, or offensive avatar outfits.</li>
              <li>No hate speech, harassment, impersonation, or discriminatory behavior.</li>
              <li>Any entry violating these standards will be immediately removed and banned from competition.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              3. Fair Play &amp; Voting Integrity
            </h2>
            <p>
              To maintain fair competition in the TREC KL Fashion Show:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-2">
              <li>Each verified Roblox account is entitled to one vote per contestant entry.</li>
              <li>Using automated bots, proxy scripts, exploit scripts, or fraudulent Sybil accounts to manipulate vote tallies is strictly prohibited.</li>
              <li>Submissions caught vote-farming or exploiting will have their votes reset or disqualified.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              4. Intellectual Property &amp; Disclaimer
            </h2>
            <p>
              TREC KL Fashion Show is an independent, community-driven event platform for players of the Roblox experience <b>TREC KL</b> (Place ID: <code>127693451158806</code>).
            </p>
            <p className="text-zinc-400 text-xs bg-zinc-950/80 p-3.5 rounded-xl border border-white/10">
              ROBLOX is a registered trademark of Roblox Corporation. This website is not endorsed by, sponsored by, or directly affiliated with Roblox Corporation. All Roblox assets, avatars, and character designs are the property of their respective creators and Roblox Corporation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              5. Modifications to Service
            </h2>
            <p>
              We reserve the right to modify, suspend, or conclude the voting event or update these terms as needed to maintain community safety and event fairness.
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
