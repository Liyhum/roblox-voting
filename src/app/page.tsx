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
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { VotingCard } from "@/components/VotingCard";
import { UploadSection } from "@/components/UploadSection";
import { Leaderboard } from "@/components/Leaderboard";
import { SetupGuide } from "@/components/SetupGuide";
import { supabase, isSupabaseConfigured, Submission } from "@/lib/supabase";

// Dummy data saat Supabase belum diisi oleh user
const DUMMY_SUBMISSIONS: Submission[] = [
  {
    id: "demo-1",
    roblox_username: "ShadowNinja99",
    roblox_avatar_url: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-7B74E7917F72FE5358CF7528387F3B01-Png/150/150/AvatarHeadshot/Png/noFilter",
    caption: "Cyberpunk Assassin Set 🗡️",
    image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    votes: 42,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "demo-2",
    roblox_username: "KawaiiBobaGirl",
    roblox_avatar_url: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-0196CA8B98EF720ED3F694F1C07C74FF-Png/150/150/AvatarHeadshot/Png/noFilter",
    caption: "Pastel Fairy Outfit with Wings ✨",
    image_url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    votes: 89,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "demo-3",
    roblox_username: "NoobMaster_X",
    roblox_avatar_url: "https://tr.rbxcdn.com/30DAY-AvatarHeadshot-9B1D6D238CE9C3691DA869BAE5B4C2A3-Png/150/150/AvatarHeadshot/Png/noFilter",
    caption: "Retro Classic Noob 2008 Style 💛",
    image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    votes: 124,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload" | "leaderboard">("gallery");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");
  const [votedIds, setVotedIds] = useState<string[]>([]);

  // Modal Lightbox gambar
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string } | null>(null);

  // Load voted IDs dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("roblox_voted_submissions");
      if (stored) {
        setVotedIds(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch data dari Supabase
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
        setSubmissions(data as Submission[]);
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

  // Handle Voting
  const handleVote = async (id: string) => {
    if (votedIds.includes(id)) return;

    // Update state lokal seketika
    const nextVoted = [...votedIds, id];
    setVotedIds(nextVoted);
    localStorage.setItem("roblox_voted_submissions", JSON.stringify(nextVoted));

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );

    // Update ke database Supabase
    if (isSupabaseConfigured) {
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
    localStorage.setItem("roblox_voted_submissions", JSON.stringify(nextVoted));

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: Math.max(0, item.votes - 1) } : item
      )
    );

    if (isSupabaseConfigured) {
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
      return (
        sub.roblox_username.toLowerCase().includes(q) ||
        (sub.caption && sub.caption.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "votes") return b.votes - a.votes;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        submissionCount={submissions.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Setup Guide Banner jika Supabase belum diisi */}
        {!isSupabaseConfigured && <SetupGuide />}

        {/* Tab 1: Galeri Voting */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-rose-950/60 via-zinc-900 to-amber-950/40 border border-zinc-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Voting Komunitas Roblox
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Vote Avatar & Outfit Roblox Terkeren!
                </h1>
                <p className="text-sm sm:text-base text-zinc-300">
                  Dukung pemain favoritmu dengan memberikan vote, atau kirimkan screenshot karya dan avatarmu untuk memenangkan posisi teratas!
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Ikut Kirim Karya
                  </button>
                  <button
                    onClick={() => setActiveTab("leaderboard")}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-sm transition-all"
                  >
                    Lihat Papan Peringkat
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 p-3 sm:p-4 rounded-2xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Username Roblox atau judul..."
                  className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Sort Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-400 hidden sm:inline flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Urutkan:
                </span>
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
                  <button
                    onClick={() => setSortBy("votes")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                      sortBy === "votes"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Paling Populer
                  </button>
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                      sortBy === "newest"
                        ? "bg-zinc-800 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Terbaru
                  </button>
                </div>

                <button
                  onClick={() => loadSubmissions()}
                  className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid Galeri */}
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-zinc-400">Memuat karya komunitas...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
                <p className="text-zinc-400 text-sm">
                  {searchQuery
                    ? `Tidak ada hasil untuk pencarian "${searchQuery}"`
                    : "Belum ada karya yang diunggah."}
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  Jadilah yang pertama kirim!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage.url}
              alt={zoomImage.title}
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl border border-zinc-800"
            />
            <p className="text-sm font-semibold text-zinc-300 mt-3 text-center">
              {zoomImage.title}
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 mt-12 text-center text-xs text-zinc-500">
        <p>
          Roblox Vote Community &bull; Dibuat untuk komunitas Roblox &bull; Siap dideploy ke Vercel
        </p>
      </footer>
    </div>
  );
}
