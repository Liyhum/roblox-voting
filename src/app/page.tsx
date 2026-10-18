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
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#06070a]/85 border-b border-white/10 transition-all">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ff007f] to-[#00f2fe]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
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
                  Official
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 tracking-wide">
                Roblox Nightlife &amp; Runway Club
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all bg-gradient-to-r from-zinc-800 to-zinc-800/90 text-white shadow-md border border-white/15"
            >
              Beranda
            </Link>
            <Link
              href="/voting"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <Flame className="w-4 h-4 text-[#ff007f]" />
              <span>Fashion Voting</span>
            </Link>
            <Link
              href="/topup"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Top Up</span>
              <span className="px-1.5 py-0.2 text-[8px] font-black uppercase rounded bg-amber-500/30 text-amber-300 border border-amber-400/50">
                Maint
              </span>
            </Link>
            <a
              href="#socials"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all text-zinc-400 hover:text-white hover:bg-white/5"
            >
              TikTok &amp; Media
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/voting"
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase text-white bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 shadow-lg shadow-[#ff007f]/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Fashion Voting</span>
              <span className="sm:hidden">Voting</span>
            </Link>

            <a
              href="https://www.roblox.com/games/127693451158806/TREC-KL"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black tracking-wider text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-[#00f2fe] transition-all group"
            >
              <Gamepad2 className="w-4 h-4 text-[#00f2fe] group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline">PLAY GAME</span>
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
                TREC KL • THE PREMIER ROBLOX NIGHTLIFE &amp; RUNWAY
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tight text-white leading-none">
                VIBE. DANCE. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-fuchsia-400 to-[#00f2fe]">
                  RULE THE RUNWAY.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Selamat datang di platform resmi <b>TREC KL</b>! Destinasi club malam paling hype di Roblox.
                Tempat nongkrong bareng circle kamu, nikmati alunan live DJ beats, pamerkan avatar outfit terbaik,
                dan ikuti ajang voting bergengsi untuk meraih predikat <b>Best Dressed</b>!
              </p>

              {/* Main Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://www.roblox.com/games/127693451158806/TREC-KL"
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-sm tracking-wider uppercase shadow-xl shadow-[#ff007f]/30 transition-all flex items-center gap-3 active:scale-95 group"
                >
                  <Gamepad2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Mainkan di Roblox</span>
                  <ExternalLink className="w-4 h-4 opacity-75" />
                </a>

                <Link
                  href="/voting"
                  className="px-7 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-white border border-white/15 hover:border-[#00f2fe] font-black text-sm tracking-wider uppercase transition-all flex items-center gap-3 shadow-xl active:scale-95 group"
                >
                  <Flame className="w-5 h-5 text-[#ff007f] group-hover:scale-110 transition-transform" />
                  <span>Fashion Runway Voting</span>
                  <ArrowRight className="w-4 h-4 text-[#00f2fe] group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/topup"
                  className="px-5 py-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 group"
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Top Up Store</span>
                  <span className="px-1.5 py-0.5 text-[8px] font-black uppercase rounded bg-amber-500/30 text-amber-300 border border-amber-400/50">
                    Maintenance
                  </span>
                </Link>
              </div>

              {/* Quick Stat Pill */}
              <div className="pt-6 grid grid-cols-3 gap-3 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-white font-mono">24/7</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live Nightlife</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-[#ff007f] font-mono">1,000+</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Avatar Drips</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-black text-[#00f2fe] font-mono">100%</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Fair Voting</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden border-2 border-white/15 shadow-2xl bg-gradient-to-b from-[#121520] to-[#0a0c12] p-2 group">
                <div className="relative rounded-[26px] overflow-hidden aspect-[4/5] sm:aspect-square lg:aspect-[4/5]">
                  <img
                    src="/trec-kl/thumb1.png"
                    alt="TREC KL Runway Club"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-[#06070a]/40 to-transparent" />

                  {/* Overlaid Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live Experience
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#ff007f]/30 backdrop-blur-md border border-[#ff007f]/50 text-xs font-black uppercase tracking-wider text-white">
                      Official Game
                    </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <p className="text-xs font-black uppercase tracking-widest text-[#00f2fe]">
                      Runway Fashion &amp; Nightclub
                    </p>
                    <h3 className="text-2xl font-black text-white uppercase italic leading-tight">
                      TREC KL Kuala Lumpur Vibe
                    </h3>
                    <p className="text-xs text-zinc-300 line-clamp-2">
                      Bergabunglah bersama ribuan pemain Roblox lainnya di catwalk dan lantai dansa paling bergengsi.
                    </p>
                    <div className="pt-2">
                      <a
                        href="https://www.roblox.com/games/127693451158806/TREC-KL"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <Gamepad2 className="w-4 h-4 text-[#ff007f]" />
                        <span>Launch di Roblox</span>
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
              Eksplorasi Platform
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white">
              PENGALAMAN UTAMA DI <span className="text-[#ff007f]">TREC KL</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Bukan cuma sekadar game Roblox biasa, ini adalah ekosistem lifestyle, kompetisi fashion avatar, dan komunitas kreatif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Fashion Voting */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-[#ff007f]/30 hover:border-[#ff007f] transition-all flex flex-col justify-between group shadow-xl shadow-[#ff007f]/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#ff007f]/15 border border-[#ff007f]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-[#ff007f]" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/30">
                    Sub Menu Utama
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    Fashion Runway Voting
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Vote avatar outfit terkece dari komunitas atau upload fotomu sendiri. Menangkan gelar Best Dressed dengan sistem proteksi anti-bot!
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <Link
                  href="/voting"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff007f]/20"
                >
                  <span>Buka Voting Runway</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Top Up Store (Maintenance) */}
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
                    Top Up Robux &amp; Passes
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Layanan pengisian Robux &amp; VIP Gamepass otomatis tanpa login password. Sedang integrasi QRIS, DANA, GoPay, dan ShopeePay.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <Link
                  href="/topup"
                  className="w-full py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Cek Info Maintenance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: VIP Club & Nightlife */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-[#00f2fe]/30 hover:border-[#00f2fe] transition-all flex flex-col justify-between group shadow-xl shadow-[#00f2fe]/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00f2fe]/15 border border-[#00f2fe]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Music className="w-7 h-7 text-[#00f2fe]" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30">
                    In-Game Experience
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    Nightclub &amp; DJ Lounge
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Rasakan atmosfer club malam otentik dengan dance floor interaktif, DJ Booth, sofa VIP mewah, dan sound system bass menggelegar!
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <a
                  href="https://www.roblox.com/games/127693451158806/TREC-KL"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Main di Roblox</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card 4: TikTok Viral Hub */}
            <div className="relative rounded-3xl p-6 bg-[#0c0e14] border border-fuchsia-500/30 hover:border-fuchsia-500 transition-all flex flex-col justify-between group shadow-xl shadow-fuchsia-500/5 hover:-translate-y-1 duration-300">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-fuchsia-400" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    Community &amp; Media
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic mt-2">
                    TikTok Trend Showcase
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Tonton dan ikuti konten TikTok viral dari para kontestan runway! Upload video TikTok kamu dan sematkan di voting profilmu.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <a
                  href="#socials"
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Lihat Hub TikTok</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIKTOK & MEDIA HUB SECTION */}
      <section id="socials" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="relative rounded-[36px] overflow-hidden border-2 border-white/15 bg-gradient-to-r from-[#0d0f17] via-[#120f1c] to-[#0a0d14] p-8 sm:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest">
                  <Video className="w-4 h-4 text-[#ff007f]" />
                  TIKTOK &amp; SOCIAL MEDIA SHOWCASE
                </div>

                <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white leading-tight">
                  KREASI RUNWAY VIRAL DI <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-rose-400 to-[#00f2fe]">
                    TIKTOK #TRECKL
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  Tunjukkan kreativitas catwalk dan outfit terbaikmu di TikTok! Gunakan sound resmi TREC KL dan tag hashtag <b>#TRECKL</b>, <b>#RobloxFashion</b>, serta <b>#RobloxIndonesia</b>.
                  Setiap kontestan yang mendaftar di sub menu Runway Voting dapat menyertakan link video TikTok mereka langsung untuk dinilai ribuan voter!
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://www.tiktok.com/tag/treckl"
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-black hover:bg-zinc-900 border border-white/20 text-white font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2.5 shadow-xl group"
                  >
                    <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>Cari Tren TikTok #TRECKL</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <Link
                    href="/voting"
                    className="px-6 py-3.5 rounded-2xl bg-[#ff007f]/20 hover:bg-[#ff007f]/30 border border-[#ff007f]/40 text-[#ff007f] font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Upload Outfit &amp; TikTok</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-black/60 p-4 shadow-2xl backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#ff007f] flex items-center justify-center font-black text-xs text-white">
                        T
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">@trecklofficial</p>
                        <p className="text-[10px] text-zinc-400">Roblox Runway Community</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Verified
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-pointer">
                    <img
                      src="/trec-kl/thumb2.png"
                      alt="TREC KL Runway TikTok Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Official Hashtag:</span>
                    <span className="font-bold text-[#00f2fe] font-mono">#TRECKL • #RobloxFashion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / CARA BERGABUNG */}
      <section className="py-16 relative z-10 border-t border-white/10 bg-[#06070a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400">
              Panduan Cepat
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
              CARA MENJADI BAGIAN DARI TREC KL
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Ikuti 3 langkah mudah untuk bergabung di panggung fashion runway dan komunitas malam kami.
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
                Connect Roblox Resmi
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hubungkan akun Roblox kamu secara aman menggunakan <b>Roblox OAuth 2.0</b> resmi tanpa perlu memasukkan password akun.
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
                Vote &amp; Pamerkan Outfit
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Buka sub menu <b>Fashion Runway Voting</b>, berikan 2 kuota suara untuk model favorit, atau unggah foto style avatar kamu sendiri.
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
                Masuk Club di Roblox
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Jalankan game <b>TREC KL</b> di Roblox untuk berjalan di panggung catwalk dengan pencahayaan live spotlight dan piala Best Dressed!
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
              SIAPKAN AVATAR DRIP TERBAIKMU SEKARANG!
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
              Ribuan pemain sudah bergabung di panggung TREC KL. Apakah avatarmu yang akan menjadi ikon fashion show berikutnya?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/voting"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#ff007f]/30 transition-all flex items-center gap-2.5 active:scale-95"
              >
                <Flame className="w-5 h-5" />
                <span>Masuk ke Fashion Runway Voting</span>
              </Link>
              <a
                href="https://www.roblox.com/games/127693451158806/TREC-KL"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black text-sm uppercase tracking-wider shadow-xl transition-all flex items-center gap-2.5 active:scale-95"
              >
                <Gamepad2 className="w-5 h-5 text-[#ff007f]" />
                <span>Play TREC KL di Roblox</span>
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
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <Link href="/voting" className="hover:text-[#ff007f] transition-colors">Fashion Runway Voting</Link>
              <Link href="/topup" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <span>Top Up Store</span>
                <span className="px-1.5 py-0.2 text-[8px] font-black uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  Maint
                </span>
              </Link>
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
