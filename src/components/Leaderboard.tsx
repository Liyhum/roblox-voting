"use client";

import React from "react";
import { Trophy, Medal, Crown, Flame, User } from "lucide-react";
import { Submission } from "@/lib/supabase";

interface LeaderboardProps {
  submissions: Submission[];
  onImageClick: (url: string, title: string) => void;
}

export function Leaderboard({ submissions, onImageClick }: LeaderboardProps) {
  // Sort submissions by votes descending
  const sorted = [...submissions].sort((a, b) => b.votes - a.votes);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800 rounded-3xl max-w-xl mx-auto p-8">
        <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-zinc-300">Belum Ada Karya Masuk</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Jadilah orang pertama yang mengirimkan avatar untuk memimpin papan peringkat!
        </p>
      </div>
    );
  }

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];
  const rest = sorted.slice(3);

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 mb-2">
          <Trophy className="w-3.5 h-3.5" />
          Papan Peringkat Komunitas
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Peringkat Teratas (Most Voted)
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Peringkat diperbarui secara langsung berdasarkan jumlah vote komunitas
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end pt-4">
        {/* Rank 2 */}
        {top2 && (
          <div className="order-2 sm:order-1 bg-zinc-900/90 border border-slate-700/60 rounded-2xl p-5 text-center flex flex-col items-center relative shadow-lg">
            <div className="w-9 h-9 rounded-full bg-slate-300 text-zinc-950 font-black flex items-center justify-center text-sm shadow-md mb-3">
              #2
            </div>
            <div
              className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-400 mb-3 cursor-pointer shadow-md"
              onClick={() =>
                onImageClick(top2.image_url, `Karya @${top2.roblox_username}`)
              }
            >
              <img
                src={top2.image_url}
                alt={top2.roblox_username}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </div>
            <h4 className="font-bold text-sm text-white truncate max-w-full">
              @{top2.roblox_username}
            </h4>
            <div className="mt-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{top2.votes.toLocaleString()} Vote</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Champion) */}
        {top1 && (
          <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-900 border-2 border-amber-500/60 rounded-2xl p-6 text-center flex flex-col items-center relative shadow-2xl shadow-amber-950/30 -translate-y-2">
            <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-400 text-zinc-950 font-black flex items-center justify-center text-sm shadow-xl shadow-amber-400/30">
              <Crown className="w-5 h-5 text-zinc-950 fill-zinc-950" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 mt-2 mb-2">
              Juara 1 Sementara
            </span>
            <div
              className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-amber-400 mb-3 cursor-pointer shadow-xl shadow-amber-500/20"
              onClick={() =>
                onImageClick(top1.image_url, `Karya @${top1.roblox_username}`)
              }
            >
              <img
                src={top1.image_url}
                alt={top1.roblox_username}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </div>
            <h4 className="font-black text-base text-amber-200 truncate max-w-full">
              @{top1.roblox_username}
            </h4>
            {top1.caption && (
              <p className="text-xs text-zinc-400 line-clamp-1 italic mt-0.5">
                "{top1.caption}"
              </p>
            )}
            <div className="mt-3 px-4 py-1.5 rounded-full bg-amber-400 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-md">
              <Flame className="w-4 h-4 fill-zinc-950" />
              <span>{top1.votes.toLocaleString()} VOTE</span>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {top3 && (
          <div className="order-3 sm:order-3 bg-zinc-900/90 border border-amber-900/60 rounded-2xl p-5 text-center flex flex-col items-center relative shadow-lg">
            <div className="w-9 h-9 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-sm shadow-md mb-3">
              #3
            </div>
            <div
              className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-700 mb-3 cursor-pointer shadow-md"
              onClick={() =>
                onImageClick(top3.image_url, `Karya @${top3.roblox_username}`)
              }
            >
              <img
                src={top3.image_url}
                alt={top3.roblox_username}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </div>
            <h4 className="font-bold text-sm text-white truncate max-w-full">
              @{top3.roblox_username}
            </h4>
            <div className="mt-2 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 text-xs font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{top3.votes.toLocaleString()} Vote</span>
            </div>
          </div>
        )}
      </div>

      {/* Ranks 4+ List */}
      {rest.length > 0 && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
          <div className="p-4 bg-zinc-950/50 flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <div className="flex items-center gap-4">
              <span>Posisi</span>
              <span>Peserta</span>
            </div>
            <span>Perolehan Vote</span>
          </div>

          {rest.map((sub, index) => (
            <div
              key={sub.id}
              className="p-4 flex items-center justify-between hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-sm font-black text-zinc-500 text-center">
                  #{index + 4}
                </span>

                <div
                  className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 cursor-pointer shrink-0"
                  onClick={() =>
                    onImageClick(sub.image_url, `Karya @${sub.roblox_username}`)
                  }
                >
                  <img
                    src={sub.image_url}
                    alt={sub.roblox_username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h5 className="font-bold text-sm text-zinc-200">
                    @{sub.roblox_username}
                  </h5>
                  {sub.caption && (
                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {sub.caption}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-300">
                <Medal className="w-4 h-4 text-zinc-500" />
                <span>{sub.votes.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
