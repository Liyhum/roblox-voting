"use client";

import React from "react";
import { Flame, Trophy, PlusCircle, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "gallery" | "upload" | "leaderboard";
  setActiveTab: (tab: "gallery" | "upload" | "leaderboard") => void;
  submissionCount: number;
}

export function Navbar({ activeTab, setActiveTab, submissionCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setActiveTab("gallery")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                ROBLOX VOTE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Community
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Pilih Avatar & Karya Terbaik</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "gallery"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Voting</span>
            {submissionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-zinc-700 text-zinc-300 rounded-full">
                {submissionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "leaderboard"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Peringkat</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "upload"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Kirim Karya</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
