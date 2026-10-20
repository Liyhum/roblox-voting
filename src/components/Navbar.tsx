"use client";

import React from "react";
import Link from "next/link";
import { Flame, Trophy, Plus, Gamepad2, ShieldCheck, LogOut, Home as HomeIcon, Coins, Heart } from "lucide-react";
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
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#06070a]/90 border-b border-white/10 transition-all">
        {/* Subtle top neon accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] via-50% to-[#00f2fe]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
            title="TREC KL - Roblox Fashion Show"
          >
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-white/20 p-0.5 group-hover:border-[#ff007f] transition-all duration-300 shadow-lg shadow-[#ff007f]/20 bg-zinc-950">
                <img
                  src="/trec-kl/icon.png"
                  alt="TREC KL"
                  className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#ff007f] border-2 border-[#06070a] shadow-md shadow-[#ff007f]/80 animate-pulse" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-wider text-white uppercase italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-[#ff007f] group-hover:to-[#00f2fe] transition-all">
                  TREC KL
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 shadow-sm shadow-[#ff007f]/20 whitespace-nowrap">
                  Runway
                </span>
              </div>
              <p className="text-[11px] font-semibold text-zinc-400 tracking-wide">
                Runway &amp; Avatar Awards
              </p>
            </div>
          </Link>

          {/* Center Navigation Capsule (Clean Tabs only, No wrapped CTAs) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl shrink-0">
            <Link
              href="/"
              className="h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-zinc-400 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              <HomeIcon className="w-4 h-4 text-[#00f2fe]" />
              <span>Home</span>
            </Link>

            <button
              type="button"
              onClick={() => setActiveTab("gallery")}
              className={`h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                activeTab === "gallery"
                  ? "bg-white/10 text-white shadow-sm border border-white/15"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Flame className="w-4 h-4 text-[#ff007f]" />
              <span>Runway</span>
              {submissionCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#ff007f] text-white rounded-full shadow-sm leading-none">
                  {submissionCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("leaderboard")}
              className={`h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap shrink-0 ${
                activeTab === "leaderboard"
                  ? "bg-white/10 text-white shadow-sm border border-white/15"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <Link
              href="/topup"
              className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 whitespace-nowrap shrink-0 group"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Top Up</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 leading-none">
                Maint
              </span>
            </Link>

            <a
              href="https://discord.gg/54GEpCZGz"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-[#5865F2] hover:text-white hover:bg-[#5865F2]/20 whitespace-nowrap shrink-0"
              title="Official Discord Server"
            >
              <span>Discord</span>
            </a>

            <a
              href="https://sociabuzz.com/treckl/donate"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-amber-300 hover:text-white hover:bg-amber-500/20 whitespace-nowrap shrink-0"
              title="Support & Donate via SociaBuzz"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Donate</span>
            </a>
          </nav>

          {/* Right Action Hub: Primary CTA + Profile + Game */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Primary Action Button: Submit Outfit (Desktop/Tablet; on mobile it's the center bottom bar button) */}
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`hidden sm:flex h-9 sm:h-10 px-3.5 sm:px-4 items-center gap-2 rounded-xl text-xs sm:text-sm font-black tracking-wide transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-[#ff007f] to-rose-600 text-white shadow-lg shadow-[#ff007f]/40 ring-2 ring-white/30"
                  : "bg-gradient-to-r from-[#ff007f] to-rose-600 hover:from-[#ff007f]/90 hover:to-rose-500 text-white shadow-md shadow-[#ff007f]/25 hover:shadow-lg hover:shadow-[#ff007f]/40"
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="whitespace-nowrap">Submit Outfit</span>
            </button>

            {/* User Profile Pill or Connect Button */}
            {connectedUser ? (
              <div className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 bg-zinc-950/90 border border-emerald-500/40 p-1 pr-2 sm:pr-3 rounded-xl sm:rounded-2xl shadow-sm shrink-0">
                <div className="relative">
                  {connectedUser.avatarUrl ? (
                    <img
                      src={connectedUser.avatarUrl}
                      alt={connectedUser.username}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl border border-emerald-500/50 bg-zinc-950 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                      {connectedUser.username[0]}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#06070a] shadow-sm shadow-emerald-500/60" />
                </div>
                <div className="hidden lg:block text-left max-w-[100px] truncate">
                  <p className="text-xs font-bold text-white leading-tight truncate">
                    {connectedUser.displayName}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">@{connectedUser.username}</p>
                </div>
                <button
                  type="button"
                  onClick={onDisconnect}
                  className="p-1 sm:p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                  title="Switch Roblox Account"
                  aria-label="Switch Roblox Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenConnectModal}
                className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#00f2fe] transition-all whitespace-nowrap shrink-0 shadow-sm active:scale-95 min-h-[38px]"
                aria-label="Set Username"
              >
                <ShieldCheck className="w-4 h-4 text-[#00f2fe]" />
                <span className="hidden sm:inline">Set Username</span>
                <span className="sm:hidden">Username</span>
              </button>
            )}

            {/* Roblox Game Play CTA */}
            <a
              href="https://www.roblox.com/games/127693451158806/TREC-KL"
              target="_blank"
              rel="noreferrer"
              className="h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 rounded-xl text-xs font-black tracking-wider text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 hover:border-[#00f2fe]/60 transition-all group whitespace-nowrap shrink-0 shadow-sm active:scale-95"
              title="Launch TREC KL on Roblox"
              aria-label="Launch TREC KL on Roblox"
            >
              <Gamepad2 className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline whitespace-nowrap">PLAY GAME</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Optimized for Touch, Safe-Areas & One-Handed Reach) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#06070a]/95 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl"
      >
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[10px] font-bold text-zinc-400 hover:text-white active:scale-95 transition-all"
        >
          <HomeIcon className="w-4 h-4 text-[#00f2fe]" />
          <span>Home</span>
        </Link>

        <button
          type="button"
          onClick={() => setActiveTab("gallery")}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[10px] font-bold active:scale-95 transition-all ${
            activeTab === "gallery" ? "text-[#ff007f]" : "text-zinc-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <Flame className="w-4 h-4" />
            {submissionCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 text-[8px] font-black bg-[#ff007f] text-white rounded-full shadow-sm">
                {submissionCount}
              </span>
            )}
          </div>
          <span>Runway</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`-mt-6 p-3 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 text-white shadow-xl shadow-[#ff007f]/40 border-2 border-[#06070a] transition-all active:scale-90 min-w-[48px] min-h-[48px] flex items-center justify-center ${
            activeTab === "upload" ? "ring-2 ring-[#00f2fe]" : ""
          }`}
          title="Submit Outfit"
          aria-label="Submit Runway Outfit"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("leaderboard")}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[10px] font-bold active:scale-95 transition-all ${
            activeTab === "leaderboard" ? "text-amber-400" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Ranks</span>
        </button>

        <Link
          href="/topup"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-[10px] font-bold text-amber-300 hover:text-amber-200 active:scale-95 transition-all"
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Store</span>
        </Link>
      </nav>
    </>
  );
}
