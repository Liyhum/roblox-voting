"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Gamepad2,
  Trophy,
  Flame,
  ShieldCheck,
  Coins,
  ArrowRight,
  ExternalLink,
  Music,
  Users,
  Eye,
  CheckCircle2,
  Wrench,
  Heart,
  Share2,
  Video,
  Play,
  Layers,
  Sparkle,
} from "lucide-react";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col font-sans selection:bg-[#ff007f] selection:text-white relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#ff007f]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[600px] h-[600px] bg-[#00f2fe]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-10 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#06070a]/90 border-b border-white/10 transition-all">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] to-[#00f2fe]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
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
                  Official
                </span>
              </div>
              <p className="text-[11px] font-semibold text-zinc-400 tracking-wide">
                Roblox Nightlife &amp; Runway Club
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl shrink-0">
            <Link
              href="/"
              className="h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all bg-white/10 text-white shadow-sm border border-white/15 whitespace-nowrap shrink-0"
            >
              Home
            </Link>
            <Link
              href="/voting"
              className="h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-zinc-400 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              <Flame className="w-4 h-4 text-[#ff007f]" />
              <span>Fashion Runway</span>
            </Link>
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
            >
              <span>Discord</span>
            </a>
            <a
              href="https://sociabuzz.com/treckl/donate"
              target="_blank"
              rel="noreferrer"
              className="h-9 px-3 flex items-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-amber-300 hover:text-white hover:bg-amber-500/20 whitespace-nowrap shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Donate</span>
            </a>
            <a
              href="#socials"
              className="h-9 px-3.5 flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all text-zinc-400 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              Media
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link
              href="/voting"
              className="h-9 sm:h-10 flex items-center gap-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase text-white bg-gradient-to-r from-[#ff007f] to-rose-600 hover:from-[#ff007f]/90 hover:to-rose-500 shadow-md shadow-[#ff007f]/25 hover:shadow-lg hover:shadow-[#ff007f]/40 transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Fashion Voting</span>
              <span className="sm:hidden">Voting</span>
            </Link>

            <a
              href="https://www.roblox.com/games/127693451158806/TREC-KL"
              target="_blank"
              rel="noreferrer"
              className="h-9 sm:h-10 flex items-center gap-2 px-3 sm:px-3.5 rounded-xl text-xs font-black tracking-wider text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/15 hover:border-[#00f2fe]/60 transition-all group whitespace-nowrap shrink-0 shadow-sm"
            >
              <Gamepad2 className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline whitespace-nowrap">PLAY GAME</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff007f]/15 border border-[#ff007f]/40 text-[#ff007f] text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-lg shadow-[#ff007f]/10">
                <Sparkles className="w-3.5 h-3.5" />
                TREC KL • BY FEMME'S STUDIO • ROBLOX
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tight text-white leading-none">
                THE PREMIER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-fuchsia-400 to-[#00f2fe]">
                  ROBLOX NIGHTLIFE
                </span> <br />
                &amp; SOCIAL HANGOUT.
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Welcome to the official community and information portal for <b>[NEW LAYOUT] TREC KL</b> on Roblox, created by <b>FEMME&apos;S STUDIO</b>. 
                Modeled after the iconic entertainment and dining hub in Kuala Lumpur, Malaysia—experience a vibrant nightlife lounge, chill with friends, catch nightly live DJ sessions, flex custom streetwear, and take part in community events.
              </p>

              {/* Main Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <a
                  href="https://www.roblox.com/games/127693451158806/TREC-KL"
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-[#ff007f]/30 transition-all flex items-center gap-3 active:scale-95 group"
                >
                  <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Play TREC KL on Roblox</span>
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </a>

                <Link
                  href="/voting"
                  className="px-6 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/15 hover:border-[#00f2fe] font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-xl active:scale-95 group"
                >
                  <Flame className="w-4 h-4 text-[#ff007f] group-hover:scale-110 transition-transform" />
                  <span>Fashion Runway Event</span>
                  <ArrowRight className="w-4 h-4 text-[#00f2fe] group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://discord.gg/54GEpCZGz"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-4 rounded-2xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 text-white border border-[#5865F2]/50 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 group shadow-lg shadow-[#5865F2]/10"
                >
                  <svg className="w-4 h-4 fill-[#5865F2] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  <span>Discord</span>
                </a>

                <a
                  href="https://sociabuzz.com/treckl/donate"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-600/20 hover:from-amber-500/30 hover:to-yellow-600/30 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 group shadow-lg shadow-amber-500/10"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
                  <span>Donate</span>
                </a>

                <Link
                  href="/topup"
                  className="px-4 py-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 group"
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Top Up</span>
                  <span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded bg-amber-500/30 text-amber-300 border border-amber-400/50">
                    Maint
                  </span>
                </Link>
              </div>

              {/* Quick Game Information Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg sm:text-xl font-black text-white font-mono">10PM - 2AM</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Nightly Live DJ</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg sm:text-xl font-black text-[#ff007f] font-mono">17+ Social</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Hangout Club</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-lg sm:text-xl font-black text-[#00f2fe] font-mono">KL Theme</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Virtual Recreation</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden border-2 border-white/15 shadow-2xl bg-gradient-to-b from-[#121520] to-[#0a0c12] p-2 group">
                <div className="relative rounded-[26px] overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                  <img
                    src="/trec-kl/thumb1.png"
                    alt="TREC KL Roblox Experience"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/40 to-transparent" />

                  {/* Overlaid Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live on Roblox
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ff007f]/30 backdrop-blur-md border border-[#ff007f]/50 text-xs font-black uppercase tracking-wider text-white">
                      FEMME&apos;S STUDIO
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-[#00f2fe]">
                      Kuala Lumpur Nightlife Simulation
                    </p>
                    <h3 className="text-2xl font-black text-white uppercase italic leading-tight">
                      [NEW LAYOUT] TREC KL
                    </h3>
                    <p className="text-xs text-zinc-300 line-clamp-2">
                      Social club lounge, live DJ stage, dance floors, VIP sections, and avatar fashion spotlight.
                    </p>
                    <div className="pt-2">
                      <a
                        href="https://www.roblox.com/games/127693451158806/TREC-KL"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Gamepad2 className="w-4 h-4 text-[#ff007f]" />
                        <span>Launch Game on Roblox</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE HIGHLIGHT PILLARS */}
      <section className="py-16 relative z-10 border-t border-white/10 bg-[#090b10]/60 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400">
              Roblox Experience &amp; Community
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white">
              WHAT IS <span className="text-[#ff007f]">TREC KL</span> ON ROBLOX?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Created by <b>FEMME&apos;S STUDIO</b>, TREC KL is a premier virtual nightlife recreation of Kuala Lumpur&apos;s most famous clubbing and hangout district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Virtual Nightlife & Club Lounge */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-[#00f2fe]/30 hover:border-[#00f2fe] transition-all flex flex-col justify-between group shadow-xl shadow-[#00f2fe]/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00f2fe]/15 border border-[#00f2fe]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-7 h-7 text-[#00f2fe]" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30">
                    Social Map
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    Nightclub &amp; Lounge
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Explore custom club interiors inspired by Kuala Lumpur nightlife. Dance floors, plush VIP sofas, bar areas, outdoor chill zones, and photo spots.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <a
                  href="https://www.roblox.com/games/127693451158806/TREC-KL"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Map in Roblox</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 2: Live DJ Sessions */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-fuchsia-500/30 hover:border-fuchsia-500 transition-all flex flex-col justify-between group shadow-xl shadow-fuchsia-500/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 text-fuchsia-400" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    Nightly Live Music
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    Live DJ Sets (10PM–2AM)
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Join nightly DJ sessions running from 10:00 PM to 2:00 AM MYT (GMT+8). Enjoy live party tracks, dynamic strobe lasers, and synchronized club audio.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <a
                  href="https://www.roblox.com/games/127693451158806/TREC-KL"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-500/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Join Live Session</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 3: Fashion Runway Sub-Menu */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-[#ff007f]/30 hover:border-[#ff007f] transition-all flex flex-col justify-between group shadow-xl shadow-[#ff007f]/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-[#ff007f]" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/30">
                    Community Event
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    Fashion Runway &amp; Votes
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  An exclusive community feature! Contestants can showcase their avatar fashion, link their TikTok runway clips, and compete for community votes.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <Link
                  href="/voting"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff007f]/20"
                >
                  <span>Open Runway Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 4: Top Up Store & VIP Gamepasses */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-amber-500/30 hover:border-amber-500 transition-all flex flex-col justify-between group shadow-xl shadow-amber-500/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coins className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-max">
                    <Wrench className="w-3 h-3" />
                    Under Maintenance
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    Top Up &amp; VIP Store
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Official store for in-game VIP passes, Robux top-ups, and exclusive club perks. System is currently undergoing scheduled maintenance.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <Link
                  href="/topup"
                  className="w-full py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>View Store Status</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* DEDICATED GAME & MAP INFORMATION PANEL */}
          <div className="mt-12 rounded-3xl border border-white/15 bg-gradient-to-r from-[#0b0d14] via-[#101320] to-[#0b0d14] p-6 sm:p-10 shadow-2xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/10 text-zinc-300 border border-white/15">
                  Official Game Info
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase italic text-white mt-2">
                  [NEW LAYOUT] TREC KL • ROBLOX
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Developer: <span className="text-white font-bold">FEMME&apos;S STUDIO</span> • Genre: <span className="text-white font-bold">Social Hangout / Nightlife Simulation</span>
                </p>
              </div>

              <a
                href="https://www.roblox.com/games/127693451158806/TREC-KL"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2 shrink-0 shadow-lg"
              >
                <Gamepad2 className="w-4 h-4 text-[#ff007f]" />
                <span>Play on Roblox</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#00f2fe] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>The Setting &amp; Map</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Modeled after <b>TREC KL</b> along Jalan Tun Razak in Kuala Lumpur. Featuring neon-lit club avenues, outdoor social decks, private VIP lounges, and interactive dance floors.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#ff007f] flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>Nightly Live DJ Timetable</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Live resident DJs host community parties every evening from <b>10:00 PM to 2:00 AM MYT (GMT+8)</b>, featuring club music mixes, custom light synchronization, and group dancing.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Community Guidelines</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Designed as a <b>17+ mature social hangout experience</b>. Players are encouraged to respect community standards, dress to impress in custom UGC streetwear, and have fun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY, DISCORD & SOCIAL MEDIA HUB */}
      <section id="socials" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Social Hub Banner */}
          <div className="relative rounded-[36px] overflow-hidden border-2 border-white/15 bg-gradient-to-r from-[#0d0f17] via-[#120f1c] to-[#0a0d14] p-8 sm:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest">
                  <Video className="w-4 h-4 text-[#ff007f]" />
                  OFFICIAL COMMUNITY &amp; SOCIAL HUBS
                </div>

                <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-tight">
                  CONNECT WITH THE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-rose-400 to-[#00f2fe]">
                    TREC KL COMMUNITY
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Stay updated with nightly live DJ sessions, connect with fellow players on Discord, share your TikTok runway clips, and support the project via SociaBuzz!
                </p>

                {/* Primary Hub Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* TikTok Button */}
                  <a
                    href="https://www.tiktok.com/@roblox_treckl?lang=en"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:from-[#ff007f]/90 hover:to-rose-500 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-xl shadow-[#ff007f]/25 group"
                  >
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>TikTok @roblox_treckl</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {/* Discord Button */}
                  <a
                    href="https://discord.gg/54GEpCZGz"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-xl shadow-[#5865F2]/25 group"
                  >
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Join Discord</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {/* SociaBuzz Donate Button */}
                  <a
                    href="https://sociabuzz.com/treckl/donate"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-zinc-950 font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-xl shadow-amber-500/20 group"
                  >
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600 group-hover:scale-110 transition-transform" />
                    <span>Support / Donate</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </div>
              </div>

              {/* Right Column: Visual Mockup with Live Community Badges */}
              <div className="lg:col-span-5 relative space-y-3">
                <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-black/60 p-4 shadow-2xl backdrop-blur-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                      Official Links
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Verified Channels
                    </span>
                  </div>

                  {/* TikTok Link Card */}
                  <a
                    href="https://www.tiktok.com/@roblox_treckl?lang=en"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/tt"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#ff007f]/20 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f] font-black text-xs">
                        TT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover/tt:text-[#ff007f] transition-colors">
                          @roblox_treckl
                        </p>
                        <p className="text-[10px] text-zinc-400">Official TikTok Account</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover/tt:text-white" />
                  </a>

                  {/* Discord Link Card */}
                  <a
                    href="https://discord.gg/54GEpCZGz"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/dc"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] font-black text-xs">
                        DC
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover/dc:text-[#5865F2] transition-colors">
                          discord.gg/54GEpCZGz
                        </p>
                        <p className="text-[10px] text-zinc-400">Official Community Discord</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover/dc:text-white" />
                  </a>

                  {/* SociaBuzz Link Card */}
                  <a
                    href="https://sociabuzz.com/treckl/donate"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group/sb"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-xs">
                        SB
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover/sb:text-amber-400 transition-colors">
                          sociabuzz.com/treckl/donate
                        </p>
                        <p className="text-[10px] text-zinc-400">Official Donation &amp; Support</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover/sb:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO JOIN SECTION */}
      <section className="py-16 relative z-10 border-t border-white/10 bg-[#06070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400">
              Quick Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
              HOW TO JOIN TREC KL
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Follow 3 simple steps to step onto the catwalk and connect with our nightlife community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#0c0e14] border border-white/10 space-y-4 relative overflow-hidden">
              <div className="text-5xl font-black text-white/10 font-mono absolute top-4 right-6">
                01
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff007f]/10 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f] font-black text-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase italic">
                Connect Roblox Account
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect your Roblox account securely using official <b>Roblox OAuth 2.0</b> without ever sharing your password.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0c0e14] border border-white/10 space-y-4 relative overflow-hidden">
              <div className="text-5xl font-black text-white/10 font-mono absolute top-4 right-6">
                02
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 flex items-center justify-center text-[#00f2fe] font-black text-lg">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase italic">
                Vote &amp; Flaunt Outfits
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Open the <b>Fashion Runway Voting</b> sub-menu, cast your 2 votes for top models, or submit your own avatar outfit.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0c0e14] border border-white/10 space-y-4 relative overflow-hidden">
              <div className="text-5xl font-black text-white/10 font-mono absolute top-4 right-6">
                03
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-lg">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase italic">
                Hit the Club in Roblox
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hop into <b>TREC KL</b> on Roblox to strut down the catwalk under live spotlights and celebrate with the crowd!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[36px] overflow-hidden border-2 border-white/15 bg-gradient-to-r from-[#ff007f]/20 via-[#120e1a] to-[#00f2fe]/20 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-tight">
              STEP INTO KUALA LUMPUR&apos;S NIGHTLIFE ON ROBLOX
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
              Join thousands of players exploring the new layout of <b>TREC KL</b>. Catch live resident DJs nightly, hang out in the VIP lounge, rock custom streetwear, and take part in community runway events!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://www.roblox.com/games/127693451158806/TREC-KL"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center gap-2.5 active:scale-95"
              >
                <Gamepad2 className="w-5 h-5 text-[#ff007f]" />
                <span>Launch TREC KL on Roblox</span>
              </a>
              <Link
                href="/voting"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#ff007f]/30 transition-all flex items-center gap-2.5 active:scale-95"
              >
                <Flame className="w-5 h-5" />
                <span>Explore Runway Event</span>
              </Link>
              <a
                href="https://www.tiktok.com/@roblox_treckl?lang=en"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white border border-white/20 font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center gap-2.5"
              >
                <span>TikTok @roblox_treckl</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
              <a
                href="https://discord.gg/54GEpCZGz"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#5865F2]/20 transition-all flex items-center gap-2.5"
              >
                <span>Join Discord</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
              <a
                href="https://sociabuzz.com/treckl/donate"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2.5"
              >
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                <span>Donate (SociaBuzz)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#06070a] py-12 relative z-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 p-0.5">
                <img src="/trec-kl/icon.png" alt="TREC KL" className="w-full h-full object-cover rounded-[8px]" />
              </div>
              <span className="font-black text-lg text-white uppercase italic">TREC KL</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/voting" className="hover:text-[#ff007f] transition-colors">Fashion Runway Voting</Link>
              <Link href="/topup" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>Top Up Store</span>
                <span className="px-1.5 py-0.2 text-[8px] font-black uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  Maint
                </span>
              </Link>
              <a
                href="https://discord.gg/54GEpCZGz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#5865F2] transition-colors flex items-center gap-1"
              >
                <span>Discord</span>
              </a>
              <a
                href="https://sociabuzz.com/treckl/donate"
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <span>Donate (SociaBuzz)</span>
              </a>
              <a
                href="https://www.tiktok.com/@roblox_treckl?lang=en"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#00f2fe] transition-colors flex items-center gap-1"
              >
                <span>TikTok @roblox_treckl</span>
              </a>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 text-center sm:text-left">
            <p>
              TREC KL • Official Roblox Avatar &amp; Fashion Runway Awards. All rights reserved.
            </p>
            <p>
              Official Roblox Game:{" "}
              <a
                href="https://www.roblox.com/games/127693451158806/TREC-KL"
                target="_blank"
                rel="noreferrer"
                className="text-[#00f2fe] hover:underline"
              >
                roblox.com/games/127693451158806/TREC-KL
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
