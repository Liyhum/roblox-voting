"use client";

import React from "react";
import { Flame, Trophy, Plus, Gamepad2 } from "lucide-react";

interface NavbarProps {
  activeTab: "gallery" | "upload" | "leaderboard";
  setActiveTab: (tab: "gallery" | "upload" | "leaderboard") => void;
  submissionCount: number;
}

export function Navbar({ activeTab, setActiveTab, submissionCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#06070a]/85 border-b border-white/10 transition-all">
      {/* Top subtle neon line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] to-[#00f2fe]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand with TREC KL Icon */}
        <div
          onClick={() => setActiveTab("gallery")}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-white/20 p-0.5 group-hover:border-[#ff007f] transition-all duration-300 shadow-lg shadow-[#ff007f]/20">
              <img
                src="/trec-kl/icon.png"
                alt="TREC KL"
                className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#06070a] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-wider text-white uppercase italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-[#ff007f] group-hover:to-[#00f2fe] transition-all">
                TREC KL
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40">
                Nightlife Awards
              </span>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 tracking-wide">
              Roblox Hangout &bull; Kuala Lumpur
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 bg-zinc-900/90 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === "gallery"
                ? "bg-gradient-to-r from-zinc-800 to-zinc-800/90 text-white shadow-lg border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame className="w-4 h-4 text-[#ff007f]" />
            <span>Voting</span>
            {submissionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black bg-zinc-800 text-zinc-300 rounded-full border border-white/10">
                {submissionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === "leaderboard"
                ? "bg-gradient-to-r from-zinc-800 to-zinc-800/90 text-white shadow-lg border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Peringkat</span>
            <span className="sm:hidden">Top</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-[#ff007f] to-rose-600 text-white neon-glow-pink"
                : "bg-[#ff007f]/15 text-[#ff007f] hover:bg-[#ff007f]/25 border border-[#ff007f]/30"
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Kirim Foto</span>
          </button>
        </nav>

        {/* Play on Roblox Direct CTA */}
        <div className="hidden lg:flex items-center">
          <a
            href="https://www.roblox.com/games/127693451158806/TREC-KL"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-wider text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-cyan-400/50 transition-all group"
          >
            <Gamepad2 className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
            <span>PLAY TREC KL</span>
          </a>
        </div>
      </div>
    </header>
  );
}
