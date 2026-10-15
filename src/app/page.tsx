"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Clock,
  Sparkles,
  X,
  Plus,
  RefreshCw,
  Gamepad2,
  Trophy,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VotingCard } from "@/components/VotingCard";
import { UploadSection } from "@/components/UploadSection";
import { Leaderboard } from "@/components/Leaderboard";
import { SetupGuide } from "@/components/SetupGuide";
import { supabase, isSupabaseConfigured, Submission } from "@/lib/supabase";

// Dummy demo entries khusus tema TREC KL jika belum ada data di database
const DUMMY_SUBMISSIONS: Submission[] = [
  {
    id: "demo-1",
    roblox_username: "NightRider_KL",
    roblox_avatar_url: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-7B74E7917F72FE5358CF7528387F3B01-Png/150/150/AvatarHeadshot/Png/noFilter",
    caption: "[Car Meet / Ride] R34 Skyline Stance di Parkiran TREC KL 🏎️💨",
    image_url: "/trec-kl/thumb1.png",
    votes: 142,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "demo-2",
    roblox_username: "AlyaCyberpunk",
    roblox_avatar_url: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0196CA8B98EF720ED3F694F1C07C74FF-Png/150/150/AvatarHeadshot/Png/noFilter",
    caption: "[Streetwear Drip] Cyberpunk Glow Outfit at TREC Neon Alley ✨",
    image_url: "/trec-kl/thumb2.png",
    votes: 98,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "demo-3",
    roblox_username: "ZoukMaster99",
    roblox_avatar_url: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-9B1D6D238CE9C3691DA869BAE5B4C2A3-Png/150/150/AvatarHeadshot/Png/noFilter",
    caption: "[Club / Hangout] Malam minggu pecah bareng squad di TREC KL! 🔥",
    image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
    votes: 165,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload" | "leaderboard">("gallery");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");
  const [votedIds, setVotedIds] = useState<string[]>([]);

  // Modal Lightbox gambar
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  // Load voted IDs dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("trec_kl_voted_submissions");
      if (stored) {
        setVotedIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch submissions
  const loadSubmissions = useCallback(async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setSubmissions(DUMMY_SUBMISSIONS);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order(sortBy === "votes" ? "votes" : "created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data submissions:", error);
      } else if (data) {
        setSubmissions(data.length > 0 ? (data as Submission[]) : DUMMY_SUBMISSIONS);
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // Handle Vote
  const handleVote = async (id: string) => {
    if (votedIds.includes(id)) return;

    const nextVoted = [...votedIds, id];
    setVotedIds(nextVoted);
    localStorage.setItem("trec_kl_voted_submissions", JSON.stringify(nextVoted));

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );

    if (isSupabaseConfigured && !id.startsWith("demo-")) {
      try {
        await supabase.rpc("increment_vote", { row_id: id });
      } catch (err) {
        console.error("Gagal increment vote:", err);
      }
    }
  };

  // Handle Unvote
  const handleUnvote = async (id: string) => {
    if (!votedIds.includes(id)) return;

    const nextVoted = votedIds.filter((item) => item !== id);
    setVotedIds(nextVoted);
    localStorage.setItem("trec_kl_voted_submissions", JSON.stringify(nextVoted));

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: Math.max(0, item.votes - 1) } : item
      )
    );

    if (isSupabaseConfigured && !id.startsWith("demo-")) {
      try {
        await supabase.rpc("decrement_vote", { row_id: id });
      } catch (err) {
        console.error("Gagal decrement vote:", err);
      }
    }
  };

  // Filter & Search
  const filteredSubmissions = submissions
    .filter((sub) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        sub.roblox_username.toLowerCase().includes(q) ||
        (sub.caption && sub.caption.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (categoryFilter === "all") return true;
      if (categoryFilter === "car") return sub.caption?.toLowerCase().includes("car") || sub.caption?.toLowerCase().includes("ride");
      if (categoryFilter === "outfit") return sub.caption?.toLowerCase().includes("drip") || sub.caption?.toLowerCase().includes("outfit");
      if (categoryFilter === "hangout") return sub.caption?.toLowerCase().includes("hangout") || sub.caption?.toLowerCase().includes("club");

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalVotesCount = submissions.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 flex flex-col font-sans selection:bg-[#ff007f] selection:text-white relative">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#ff007f]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00f2fe]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        submissionCount={submissions.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {!isSupabaseConfigured && <SetupGuide />}

        {/* Tab 1: Galeri Voting */}
        {activeTab === "gallery" && (
          <div className="space-y-10">
            {/* Cinematic TREC KL Hero Showcase */}
            <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-[#0c0e14]">
              {/* Game Thumbnail Background with Cinematic Dark Vignette */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/trec-kl/thumb1.png"
                  alt="TREC KL Roblox"
                  className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06070a] via-[#06070a]/90 to-[#06070a]/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 p-6 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[420px]">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f] text-xs font-black uppercase tracking-widest backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    TREC KL Official Community Awards
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase italic leading-none">
                    VOTE OUTFIT &amp; MOBIL TER-DRIP!
                  </h1>

                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                    Tempat kumpul malam paling hype di Roblox Malaysia. Dukung foto pemain favoritmu atau upload screenshot mobil dan avatar terbaikmu untuk meraih gelar <b className="text-amber-400">King of TREC KL</b>!
                  </p>
                </div>

                {/* Live Stats & CTA Row */}
                <div className="pt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 mt-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#ff007f]/30 transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      Kirim Foto Kamu
                    </button>

                    <button
                      onClick={() => setActiveTab("leaderboard")}
                      className="px-6 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Hall of Fame
                    </button>

                    <a
                      href="https://www.roblox.com/games/127693451158806/TREC-KL"
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2"
                    >
                      <Gamepad2 className="w-4 h-4 text-[#00f2fe]" />
                      <span>Main TREC KL</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </a>
                  </div>

                  {/* Quick Counter Badges */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">
                        {submissions.length}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Total Kontestan
                      </div>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-[#ff007f] font-mono">
                        {totalVotesCount.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Suara Masuk
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "all", label: "Semua Kategori" },
                { id: "outfit", label: "👔 Streetwear Drip" },
                { id: "car", label: "🏎️ Car Meet / Ride" },
                { id: "hangout", label: "🍾 Club & Hangout" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black tracking-wider uppercase whitespace-nowrap transition-all border ${
                    categoryFilter === tab.id
                      ? "bg-white text-zinc-950 border-white shadow-lg"
                      : "bg-[#0c0e14]/80 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0c0e14]/80 border border-white/10 p-3.5 sm:p-4 rounded-3xl backdrop-blur-xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Username Roblox atau judul foto..."
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff007f] transition-all"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 hidden sm:inline flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Urutkan:
                </span>
                <div className="flex bg-zinc-950/90 p-1 rounded-2xl border border-white/10 text-xs">
                  <button
                    onClick={() => setSortBy("votes")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all ${
                      sortBy === "votes"
                        ? "bg-[#ff007f] text-white shadow-md shadow-[#ff007f]/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    Top Vote
                  </button>
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider transition-all ${
                      sortBy === "newest"
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#00f2fe]" />
                    Terbaru
                  </button>
                </div>

                <button
                  onClick={() => loadSubmissions()}
                  className="p-2.5 rounded-2xl bg-zinc-950/90 border border-white/10 text-zinc-400 hover:text-white hover:border-[#ff007f] transition-colors shadow-md"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid Galeri */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-2 border-[#ff007f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-400">Memuat kontestan TREC KL...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-20 bg-[#0c0e14]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <p className="text-zinc-400 text-sm">
                  {searchQuery
                    ? `Tidak ditemukan kontestan dengan kata kunci "${searchQuery}"`
                    : "Belum ada foto yang masuk untuk kategori ini."}
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 text-white text-xs font-black uppercase tracking-wider"
                >
                  Jadilah yang pertama kirim!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredSubmissions.map((sub, index) => (
                  <VotingCard
                    key={sub.id}
                    submission={sub}
                    hasVoted={votedIds.includes(sub.id)}
                    onVote={handleVote}
                    onUnvote={handleUnvote}
                    onImageClick={(url, title) => setZoomImage({ url, title })}
                    rank={sortBy === "votes" && !searchQuery ? index + 1 : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload Form */}
        {activeTab === "upload" && (
          <UploadSection
            onSuccess={() => {
              loadSubmissions();
              setActiveTab("gallery");
            }}
          />
        )}

        {/* Tab 3: Leaderboard */}
        {activeTab === "leaderboard" && (
          <Leaderboard
            submissions={submissions}
            onImageClick={(url, title) => setZoomImage({ url, title })}
          />
        )}
      </main>

      {/* Lightbox Modal Gambar */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 p-2.5 rounded-full bg-zinc-800 text-white hover:bg-[#ff007f] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage.url}
              alt={zoomImage.title}
              className="max-h-[80vh] w-auto rounded-3xl object-contain shadow-2xl border border-white/20"
            />
            <p className="text-sm font-black uppercase tracking-wider text-zinc-300 mt-4 text-center">
              {zoomImage.title}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06070a] py-8 mt-16 text-center text-xs text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-zinc-400 uppercase tracking-widest">
            TREC KL Community Voting &bull; Roblox Malaysia Nightlife Hangout
          </p>
          <p className="text-[11px] text-zinc-600">
            Game URL:{" "}
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
      </footer>
    </div>
  );
}
