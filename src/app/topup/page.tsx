"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  Sparkles,
  ShieldAlert,
  Coins,
  Crown,
  Zap,
  CheckCircle2,
  Clock,
  Bell,
  Gamepad2,
  Lock,
  ChevronRight,
  Heart,
  ExternalLink,
} from "lucide-react";

interface RobuxPackage {
  id: string;
  name: string;
  amount: string;
  price: string;
  bonus?: string;
  badge?: string;
  popular?: boolean;
}

const ROBUX_PACKAGES: RobuxPackage[] = [
  { id: "rbx-80", name: "Starter Drip", amount: "80 Robux", price: "$0.99", badge: "Starter" },
  { id: "rbx-400", name: "Runway Basic", amount: "400 Robux", price: "$4.99", bonus: "+20 Bonus" },
  { id: "rbx-800", name: "Fashion Icon", amount: "800 Robux", price: "$9.99", popular: true, bonus: "+50 Bonus", badge: "Most Popular" },
  { id: "rbx-1700", name: "TREC VIP Elite", amount: "1,700 Robux", price: "$19.99", bonus: "+150 Bonus", badge: "Best Value" },
  { id: "rbx-4500", name: "Runway Royalty", amount: "4,500 Robux", price: "$49.99", bonus: "+500 Bonus" },
  { id: "rbx-10000", name: "Celebrity Mega", amount: "10,000 Robux", price: "$99.99", bonus: "+1,200 Bonus", badge: "Whale Tier" },
];

const GAMEPASSES = [
  { id: "vip-lounge", title: "TREC KL VIP Lounge Access", price: "$2.99", desc: "Exclusive access to private plush sofas, VIP bar service, bottle popper effects, and in-game VIP overhead tag." },
  { id: "runway-spotlight", title: "Supermodel Catwalk Spotlight", price: "$4.49", desc: "Automated dynamic stage follow-spotlight that tracks your avatar + custom runway audio walk cue." },
  { id: "dj-booth", title: "Guest DJ Mixer Pass", price: "$5.99", desc: "Queue party music tracks, toggle club laser effects, trigger strobe lights, and unleash the floor smoke cannon." },
];

export default function TopUpPage() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<"robux" | "gamepass">("robux");

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col font-sans selection:bg-[#ff007f] selection:text-white relative">
      {/* Background ambient neon glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#ff007f]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00f2fe]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#06070a]/90 border-b border-white/10">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] to-[#00f2fe]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-white/20 p-0.5 group-hover:border-[#ff007f] transition-all duration-300 shadow-lg shadow-[#ff007f]/20 bg-zinc-950">
                <img
                  src="/trec-kl/icon.png"
                  alt="TREC KL"
                  className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-[#06070a] shadow-md shadow-amber-500/80 animate-pulse" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-wider text-white uppercase italic group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-amber-300 group-hover:to-yellow-400 transition-all">
                  TREC KL
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm whitespace-nowrap">
                  Store
                </span>
              </div>
              <p className="text-[11px] font-semibold text-zinc-400 tracking-wide">
                Robux &amp; VIP Gamepasses
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <a
              href="https://discord.gg/54GEpCZGz"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex h-9 sm:h-10 items-center gap-2 px-3.5 rounded-xl text-xs font-bold text-white bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 transition-all whitespace-nowrap shadow-sm"
            >
              <span>Discord</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href="https://sociabuzz.com/treckl/donate"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex h-9 sm:h-10 items-center gap-2 px-3.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition-all whitespace-nowrap shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Donate</span>
            </a>

            <Link
              href="/voting"
              className="h-9 sm:h-10 flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase text-white bg-gradient-to-r from-[#ff007f] to-rose-600 hover:from-[#ff007f]/90 hover:to-rose-500 shadow-md shadow-[#ff007f]/25 hover:shadow-lg hover:shadow-[#ff007f]/40 transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Fashion Runway</span>
              <span className="sm:hidden">Runway</span>
            </Link>
            <Link
              href="/"
              className="h-9 sm:h-10 flex items-center gap-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10 space-y-8 sm:space-y-12">
        {/* Notice Banner: Under Maintenance */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-[#0e111a] to-[#0c0e14] p-4 sm:p-10 shadow-2xl shadow-amber-500/10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wrench className="w-48 h-48 text-amber-400 rotate-12" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-widest animate-pulse">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              TOP UP STORE CURRENTLY UNDER MAINTENANCE
            </div>

            <h1 className="text-2xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-tight sm:leading-none">
              TREC KL TOP UP STORE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-[#ff007f]">
                IS CURRENTLY BEING UPGRADED
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Hello TREC KL community! We are currently integrating an automated, secure checkout gateway to ensure all your Robux packages and VIP Gamepass purchases are <b>100% instant, official, secure, and require zero password sharing</b>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Estimated Launch: <b>Coming Soon</b></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Methods: <b>Instant Digital Gateways</b></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300">
                <Lock className="w-4 h-4 text-[#00f2fe] shrink-0" />
                <span>Security: <b>Official &amp; Verified</b></span>
              </div>
            </div>

            {/* Email Notification Form */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-amber-400" /> Get Notified When Store Reopens:
              </p>
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Thank you! We'll notify you as soon as the store payment system goes live!</span>
                </div>
              ) : (
                <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2.5 max-w-lg">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950/90 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Active Support & Community Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SociaBuzz Donation Card */}
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-[#0e111a] to-[#0c0e14] p-6 sm:p-8 space-y-4 shadow-xl shadow-amber-500/5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Active Alternative
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic">
                Support &amp; Donate via SociaBuzz
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-1">
                Want to support TREC KL developments while our automated shop is being upgraded? You can donate directly through SociaBuzz to help fund game updates, DJ stage lights, and prizes!
              </p>
            </div>
            <a
              href="https://sociabuzz.com/treckl/donate"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
              <span>Donate on SociaBuzz (sociabuzz.com/treckl/donate)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Discord Community Card */}
          <div className="relative rounded-3xl overflow-hidden border border-[#5865F2]/40 bg-gradient-to-br from-[#5865F2]/15 via-[#0e111a] to-[#0c0e14] p-6 sm:p-8 space-y-4 shadow-xl shadow-[#5865F2]/5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#5865F2]/20 text-[#5865F2] border border-[#5865F2]/40">
                Official Server
              </span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic">
                Join Community Discord
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-1">
                Get first-hand news, sneak peeks at upcoming game updates, report issues, chat with club regulars, and get notified immediately when top-ups resume!
              </p>
            </div>
            <a
              href="https://discord.gg/54GEpCZGz"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/25 active:scale-95"
            >
              <span>Join Discord (discord.gg/54GEpCZGz)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Catalog Preview with Maintenance Badges */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400" />
                Package Catalog (Preview Pricing)
              </h2>
              <p className="text-xs text-zinc-400">
                Packages below will activate automatically once maintenance is completed.
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900 border border-white/10">
              <button
                onClick={() => setActiveTab("robux")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === "robux"
                    ? "bg-[#ff007f] text-white shadow-md shadow-[#ff007f]/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Robux Instant
              </button>
              <button
                onClick={() => setActiveTab("gamepass")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === "gamepass"
                    ? "bg-[#00f2fe] text-black shadow-md shadow-[#00f2fe]/30 font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                VIP Gamepasses
              </button>
            </div>
          </div>

          {activeTab === "robux" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ROBUX_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-6 border transition-all flex flex-col justify-between overflow-hidden bg-[#0c0e14]/90 ${
                    pkg.popular
                      ? "border-[#ff007f]/50 shadow-xl shadow-[#ff007f]/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f]">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase italic">{pkg.amount}</h3>
                      <p className="text-xs font-medium text-zinc-400">{pkg.name}</p>
                    </div>
                    {pkg.bonus && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                        {pkg.bonus}
                      </span>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-400 uppercase font-bold">Price</span>
                      <span className="text-lg font-black text-white">{pkg.price}</span>
                    </div>

                    <button
                      disabled
                      className="w-full py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-zinc-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Under Maintenance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {GAMEPASSES.map((gp) => (
                <div
                  key={gp.id}
                  className="relative rounded-3xl p-6 border border-white/10 bg-[#0c0e14]/90 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-[#00f2fe]" />
                    </div>
                    <h3 className="text-lg font-black text-white">{gp.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{gp.desc}</p>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-zinc-400 uppercase font-bold">Pass Price</span>
                      <span className="text-lg font-black text-white">{gp.price}</span>
                    </div>

                    <button
                      disabled
                      className="w-full py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-zinc-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Under Maintenance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-bold text-white">Need assistance or interested in community partnerships?</p>
            <p>Connect with the TREC KL community team via Discord or our social channels.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://discord.gg/54GEpCZGz"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold tracking-wide flex items-center gap-2 transition-all shadow-md"
            >
              <span>Join Discord</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            <a
              href="https://sociabuzz.com/treckl/donate"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-black tracking-wide flex items-center gap-1.5 transition-all shadow-md"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              <span>Donate</span>
            </a>
            <a
              href="https://www.roblox.com/games/127693451158806/TREC-KL"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold tracking-wide flex items-center gap-2 transition-all"
            >
              <Gamepad2 className="w-4 h-4 text-[#ff007f]" />
              <span>Play Game</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06070a] py-8 mt-16 text-center text-xs text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-bold text-zinc-400 uppercase tracking-widest">
            TREC KL • Official Roblox Nightlife &amp; Fashion Runway
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-zinc-600">&bull;</span>
            <Link href="/voting" className="hover:text-[#ff007f] transition-colors">Fashion Runway</Link>
            <span className="text-zinc-600">&bull;</span>
            <a href="https://discord.gg/54GEpCZGz" target="_blank" rel="noreferrer" className="hover:text-[#5865F2] transition-colors">
              Discord Community
            </a>
            <span className="text-zinc-600">&bull;</span>
            <a href="https://sociabuzz.com/treckl/donate" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">
              Donate (SociaBuzz)
            </a>
            <span className="text-zinc-600">&bull;</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-zinc-600">&bull;</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-[11px] text-zinc-600">
            TREC KL is not affiliated with or endorsed by Roblox Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
