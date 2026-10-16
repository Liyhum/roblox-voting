"use client";

import React from "react";
import { Trophy, Medal, Crown, Flame, Sparkles } from "lucide-react";
import { Submission } from "@/lib/supabase";
import { TikTokIcon } from "./TikTokPlayer";

interface LeaderboardProps {
  submissions: Submission[];
  onImageClick: (url: string, title: string, tiktokUrl?: string | null) => void;
}

export function Leaderboard({ submissions, onImageClick }: LeaderboardProps) {
  const sorted = [...submissions].sort((a, b) => b.votes - a.votes);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-20 bg-[#0c0e14]/80 border border-white/10 rounded-3xl max-w-xl mx-auto p-8 backdrop-blur-xl">
        <Trophy className="w-14 h-14 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-lg font-black text-white uppercase tracking-wider">
          No Models on the Runway Yet
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
          Be the first to submit your avatar outfit to lead the Best Dressed leaderboard!
        </p>
      </div>
    );
  }

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];
  const rest = sorted.slice(3);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black uppercase tracking-widest border border-amber-500/30 mb-3">
          <Crown className="w-3.5 h-3.5" />
          TREC KL Runway Podium
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase italic">
          Best Dressed Leaderboard
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Top-ranked avatar models based on community votes in the TREC KL fashion show
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end pt-4">
        {/* Rank 2 */}
        {top2 && (
          <div className="order-2 sm:order-1 bg-[#0c0e14]/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 text-center flex flex-col items-center relative shadow-xl hover:border-slate-500 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-zinc-400 text-zinc-950 font-black flex items-center justify-center text-sm shadow-lg mb-3">
              #2
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
              Silver Runway Star
            </span>
            <div
              className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-400/80 mb-3.5 cursor-pointer shadow-lg group relative"
              onClick={() =>
                onImageClick(top2.image_url, `Outfit by @${top2.roblox_username}`, top2.tiktok_url)
              }
            >
              <img
                src={top2.image_url}
                alt={top2.roblox_username}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {top2.tiktok_url && (
                <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20">
                  <TikTokIcon className="w-3 h-3 text-[#ff007f]" />
                </div>
              )}
            </div>
            <h4 className="font-black text-base text-white truncate max-w-full">
              @{top2.roblox_username}
            </h4>
            <div className="mt-3 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-200 text-xs font-black flex items-center gap-1.5 border border-white/10 font-mono">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{top2.votes.toLocaleString()} VOTES</span>
            </div>
          </div>
        )}

        {/* Rank 1 (Champion) */}
        {top1 && (
          <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-950/40 via-[#0c0e14] to-[#0c0e14] backdrop-blur-2xl border-2 border-amber-500/80 rounded-3xl p-7 text-center flex flex-col items-center relative shadow-2xl -translate-y-3">
            <div className="absolute -top-5 w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-zinc-950 font-black flex items-center justify-center text-base shadow-xl shadow-amber-400/40">
              <Crown className="w-6 h-6 fill-zinc-950 text-zinc-950" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 mt-2 mb-2 animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 👑 BEST DRESSED CHAMPION
            </span>

            <div
              className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-amber-400 mb-4 cursor-pointer shadow-2xl shadow-amber-500/30 group relative"
              onClick={() =>
                onImageClick(top1.image_url, `Outfit by @${top1.roblox_username}`, top1.tiktok_url)
              }
            >
              <img
                src={top1.image_url}
                alt={top1.roblox_username}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {top1.tiktok_url && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <TikTokIcon className="w-3.5 h-3.5 text-[#ff007f]" />
                  <span className="text-[10px] font-bold text-white uppercase">Video</span>
                </div>
              )}
            </div>

            <h4 className="font-black text-lg sm:text-xl text-amber-200 truncate max-w-full">
              @{top1.roblox_username}
            </h4>
            {top1.caption && (
              <p className="text-xs text-zinc-400 line-clamp-1 italic mt-1 max-w-[200px]">
                "{top1.caption}"
              </p>
            )}

            <div className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-400/25 font-mono">
              <Flame className="w-4 h-4 fill-zinc-950" />
              <span>{top1.votes.toLocaleString()} TOTAL VOTES</span>
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {top3 && (
          <div className="order-3 sm:order-3 bg-[#0c0e14]/90 backdrop-blur-xl border border-amber-900/60 rounded-3xl p-6 text-center flex flex-col items-center relative shadow-xl hover:border-amber-700 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-700 to-orange-800 text-white font-black flex items-center justify-center text-sm shadow-lg mb-3">
              #3
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2">
              Bronze Runway Icon
            </span>
            <div
              className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-amber-700 mb-3.5 cursor-pointer shadow-lg group relative"
              onClick={() =>
                onImageClick(top3.image_url, `Outfit by @${top3.roblox_username}`, top3.tiktok_url)
              }
            >
              <img
                src={top3.image_url}
                alt={top3.roblox_username}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {top3.tiktok_url && (
                <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20">
                  <TikTokIcon className="w-3 h-3 text-[#ff007f]" />
                </div>
              )}
            </div>
            <h4 className="font-black text-base text-white truncate max-w-full">
              @{top3.roblox_username}
            </h4>
            <div className="mt-3 px-3.5 py-1.5 rounded-full bg-amber-950/60 text-amber-300 text-xs font-black flex items-center gap-1.5 border border-amber-800/40 font-mono">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{top3.votes.toLocaleString()} VOTES</span>
            </div>
          </div>
        )}
      </div>

      {/* Ranks 4+ List */}
      {rest.length > 0 && (
        <div className="bg-[#0c0e14]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/10 shadow-2xl">
          <div className="p-4 bg-zinc-950/60 flex items-center justify-between text-xs font-black text-zinc-400 uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <span>Position</span>
              <span>Model &amp; Outfit</span>
            </div>
            <span>Votes</span>
          </div>

          {rest.map((sub, index) => (
            <div
              key={sub.id}
              className="p-4.5 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-sm font-black text-zinc-500 font-mono text-center">
                  #{index + 4}
                </span>

                <div
                  className="w-12 h-12 rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 cursor-pointer shrink-0 shadow-md group relative"
                  onClick={() =>
                    onImageClick(sub.image_url, `Outfit by @${sub.roblox_username}`, sub.tiktok_url)
                  }
                >
                  <img
                    src={sub.image_url}
                    alt={sub.roblox_username}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  {sub.tiktok_url && (
                    <div className="absolute top-1 right-1 p-0.5 rounded-sm bg-black/80">
                      <TikTokIcon className="w-2.5 h-2.5 text-[#ff007f]" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-black text-sm text-white">
                      @{sub.roblox_username}
                    </h5>
                    {sub.tiktok_url && (
                      <span className="text-[9px] font-bold text-zinc-400 bg-zinc-900 border border-white/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <TikTokIcon className="w-2.5 h-2.5 text-[#ff007f]" />
                        <span>TikTok</span>
                      </span>
                    )}
                  </div>
                  {sub.caption && (
                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                      {sub.caption}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 font-black text-sm text-zinc-300 font-mono">
                <Medal className="w-4 h-4 text-[#ff007f]" />
                <span>{sub.votes.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
