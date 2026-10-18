import React from "react";
import Link from "next/link";
import { Flame, Trophy, Plus, Gamepad2, ShieldCheck, LogOut, Home as HomeIcon, Coins } from "lucide-react";
import { ConnectedRobloxUser } from "./RobloxConnectModal";

interface NavbarProps {
  activeTab: "gallery" | "upload" | "leaderboard";
  setActiveTab: (tab: "gallery" | "upload" | "leaderboard") => void;
  submissionCount: number;
  connectedUser: ConnectedRobloxUser | null;
  onOpenConnectModal: () => void;
  onDisconnect: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  submissionCount,
  connectedUser,
  onOpenConnectModal,
  onDisconnect,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#06070a]/90 border-b border-white/10 transition-all">
      {/* Top subtle neon line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] to-[#00f2fe]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand with TREC KL Icon */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="relative">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-white/20 p-0.5 group-hover:border-[#ff007f] transition-all duration-300 shadow-lg shadow-[#ff007f]/20">
              <img
                src="/trec-kl/icon.png"
                alt="TREC KL"
                className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ff007f] border-2 border-[#06070a] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-xl tracking-wider text-white uppercase italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-[#ff007f] group-hover:to-[#00f2fe] transition-all">
                TREC KL
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40">
                Fashion Show
              </span>
            </div>
            <p className="text-[11px] font-medium text-zinc-400 tracking-wide">
              Runway &amp; Avatar Awards
            </p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-zinc-900/90 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all text-zinc-400 hover:text-white hover:bg-white/5"
            title="Kembali ke Beranda"
          >
            <HomeIcon className="w-4 h-4 text-[#00f2fe]" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === "gallery"
                ? "bg-gradient-to-r from-zinc-800 to-zinc-800/90 text-white shadow-lg border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame className="w-4 h-4 text-[#ff007f]" />
            <span>Runway</span>
            {submissionCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black bg-zinc-800 text-zinc-300 rounded-full border border-white/10">
                {submissionCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === "leaderboard"
                ? "bg-gradient-to-r from-zinc-800 to-zinc-800/90 text-white shadow-lg border border-white/15"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-[#ff007f] to-rose-600 text-white shadow-lg shadow-[#ff007f]/30"
                : "bg-[#ff007f]/15 text-[#ff007f] hover:bg-[#ff007f]/25 border border-[#ff007f]/30"
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Submit Outfit</span>
            <span className="sm:hidden">Submit</span>
          </button>

          <Link
            href="/topup"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/30 group"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Top Up</span>
            <span className="px-1.5 py-0.2 text-[8px] font-black uppercase rounded bg-amber-500/30 text-amber-300 border border-amber-400/50">
              Maint
            </span>
          </Link>
        </nav>

        {/* User Roblox Connection Status & CTA */}
        <div className="flex items-center gap-2.5">
          {connectedUser ? (
            <div className="flex items-center gap-2 bg-zinc-900/90 border border-emerald-500/30 p-1.5 pr-3 rounded-2xl">
              <div className="relative">
                {connectedUser.avatarUrl ? (
                  <img
                    src={connectedUser.avatarUrl}
                    alt={connectedUser.username}
                    className="w-8 h-8 rounded-xl border border-emerald-500/50 bg-zinc-950 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                    {connectedUser.username[0]}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#06070a]" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-black text-white leading-tight">
                  {connectedUser.displayName}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">@{connectedUser.username}</p>
              </div>
              <button
                onClick={onDisconnect}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/5 transition-colors ml-1"
                title="Switch Roblox Account"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00f2fe] transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-[#00f2fe]" />
              <span className="hidden sm:inline">Connect Roblox</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}

          <a
            href="https://www.roblox.com/games/127693451158806/TREC-KL"
            target="_blank"
            rel="noreferrer"
            className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wider text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-[#ff007f]/50 transition-all group"
          >
            <Gamepad2 className="w-4 h-4 text-[#ff007f] group-hover:scale-110 transition-transform" />
            <span>PLAY GAME</span>
          </a>
        </div>
      </div>
    </header>
  );
}
