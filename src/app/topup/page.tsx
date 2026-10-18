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
  { id: "rbx-80", name: "Starter Drip", amount: "80 Robux", price: "Rp 15.000", badge: "Starter" },
  { id: "rbx-400", name: "Runway Basic", amount: "400 Robux", price: "Rp 65.000", bonus: "+20 Bonus" },
  { id: "rbx-800", name: "Fashion Icon", amount: "800 Robux", price: "Rp 125.000", popular: true, bonus: "+50 Bonus", badge: "Most Popular" },
  { id: "rbx-1700", name: "TREC VIP Elite", amount: "1,700 Robux", price: "Rp 250.000", bonus: "+150 Bonus", badge: "Best Value" },
  { id: "rbx-4500", name: "Runway Royalty", amount: "4,500 Robux", price: "Rp 640.000", bonus: "+500 Bonus" },
  { id: "rbx-10000", name: "Celebrity Mega", amount: "10,000 Robux", price: "Rp 1.350.000", bonus: "+1,200 Bonus", badge: "Whale Tier" },
];

const GAMEPASSES = [
  { id: "vip-lounge", title: "TREC KL VIP Lounge Access", price: "Rp 45.000", desc: "Akses sofa eksklusif, private bar, champagne efek, dan custom VIP tag di game." },
  { id: "runway-spotlight", title: "Supermodel Catwalk Spotlight", price: "Rp 60.000", desc: "Lampu panggung otomatis mengikuti avatar kamu + sound effect walk spektakuler." },
  { id: "dj-booth", title: "Guest DJ Mixer Pass", price: "Rp 75.000", desc: "Kontrol playlist musik club, visualizer lighting lantai dansa, dan smoke machine." },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 p-0.5 group-hover:border-[#ff007f] transition-all shadow-md">
              <img src="/trec-kl/icon.png" alt="TREC KL" className="w-full h-full object-cover rounded-[10px]" />
            </div>
            <div>
              <span className="font-black text-lg tracking-wider text-white uppercase italic">TREC KL</span>
              <span className="ml-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Store
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/voting"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#ff007f]" />
              <span>Fashion Voting</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-12">
        {/* Notice Banner: Under Maintenance */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-[#0e111a] to-[#0c0e14] p-6 sm:p-10 shadow-2xl shadow-amber-500/10">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Wrench className="w-48 h-48 text-amber-400 rotate-12" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-widest animate-pulse">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              SISTEM TOP UP SEDANG MAINTENANCE
            </div>

            <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white">
              TREC KL TOP UP STORE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-[#ff007f]">
                SEDANG DALAM TAHAP PEMELIHARAAN
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Halo warga TREC KL! Kami sedang melakukan upgrade sistem gateway pembayaran otomatis (QRIS Instan, DANA, GoPay, OVO, ShopeePay &amp; Virtual Account) untuk memastikan proses top up Robux dan Gamepass VIP Anda berjalan <b>100% instan, legal, aman, dan tanpa login password</b>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Estimasi Rilis: <b>Coming Soon</b></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Metode: <b>QRIS &amp; E-Wallet</b></span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300">
                <Lock className="w-4 h-4 text-[#00f2fe] shrink-0" />
                <span>Keamanan: <b>100% Legal Garansi</b></span>
              </div>
            </div>

            {/* Email Notification Form */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-amber-400" /> Dapatkan Notifikasi Saat Store Kembali Buka:
              </p>
              {subscribed ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Terima kasih! Kami akan memberi tahu Anda segera setelah payment gateway online!</span>
                </div>
              ) : (
                <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2.5 max-w-lg">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Masukkan alamat email kamu..."
                    required
                    className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950/90 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    Ingatkan Saya
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Catalog Preview with Maintenance Badges */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                <Coins className="w-6 h-6 text-amber-400" />
                Katalog Paket (Pratinjau Harga)
              </h2>
              <p className="text-xs text-zinc-400">
                Paket di bawah ini akan aktif otomatis setelah maintenance payment gateway selesai.
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
                Gamepass VIP
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
                      <span className="text-xs text-zinc-400 uppercase font-bold">Harga</span>
                      <span className="text-lg font-black text-white">{pkg.price}</span>
                    </div>

                    <button
                      disabled
                      className="w-full py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-zinc-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sedang Maintenance</span>
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
                      <span className="text-xs text-zinc-400 uppercase font-bold">Harga Pass</span>
                      <span className="text-lg font-black text-white">{gp.price}</span>
                    </div>

                    <button
                      disabled
                      className="w-full py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-zinc-400 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sedang Maintenance</span>
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
            <p className="font-bold text-white">Butuh bantuan atau ingin info partnership?</p>
            <p>Hubungi admin komunitas TREC KL melalui Discord atau media sosial kami.</p>
          </div>
          <a
            href="https://www.roblox.com/games/127693451158806/TREC-KL"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold tracking-wide flex items-center gap-2 transition-all shrink-0"
          >
            <Gamepad2 className="w-4 h-4 text-[#ff007f]" />
            <span>Mainkan TREC KL Sekarang</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06070a] py-8 mt-16 text-center text-xs text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-zinc-400 uppercase tracking-widest">
            TREC KL • Official Roblox Nightlife &amp; Fashion Runway
          </p>
          <p className="text-[11px] text-zinc-600">
            TREC KL is not affiliated with or endorsed by Roblox Corporation.
          </p>
        </div>
      </footer>
    </div>
  );
}
