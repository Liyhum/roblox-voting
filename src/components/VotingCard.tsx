"use client";

import React, { useState } from "react";
import { Heart, User, Maximize2, Share2, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { Submission } from "@/lib/supabase";

interface VotingCardProps {
  submission: Submission;
  hasVoted: boolean;
  onVote: (id: string) => Promise<void>;
  onUnvote?: (id: string) => Promise<void>;
  onImageClick: (url: string, title: string) => void;
  rank?: number;
}

export function VotingCard({
  submission,
  hasVoted,
  onVote,
  onUnvote,
  onImageClick,
  rank,
}: VotingCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleVoteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isVoting) return;

    setIsVoting(true);
    try {
      if (hasVoted && onUnvote) {
        await onUnvote(submission.id);
      } else if (!hasVoted) {
        // Efek confetti keren di posisi tombol
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 40,
          spread: 60,
          origin: { x, y },
          colors: ["#f43f5e", "#ec4899", "#fbbf24"],
        });

        await onVote(submission.id);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `Yuk vote karya Roblox @${submission.roblox_username} di Roblox Vote!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-950/20 flex flex-col">
      {/* Rank Badge if in Leaderboard or Top 3 */}
      {rank && (
        <div
          className={`absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-md flex items-center gap-1.5 ${
            rank === 1
              ? "bg-amber-400 text-zinc-950"
              : rank === 2
              ? "bg-slate-300 text-zinc-950"
              : rank === 3
              ? "bg-amber-700 text-white"
              : "bg-zinc-800/90 text-zinc-300 backdrop-blur-md"
          }`}
        >
          <span>#{rank}</span>
        </div>
      )}

      {/* Gambar Karya */}
      <div
        className="relative aspect-square w-full bg-zinc-950 overflow-hidden cursor-pointer"
        onClick={() =>
          onImageClick(
            submission.image_url,
            `Karya Roblox @${submission.roblox_username}`
          )
        }
      >
        <img
          src={submission.image_url}
          alt={`Karya @${submission.roblox_username}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
          <span className="text-xs text-zinc-300 flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" /> Klik untuk perbesar
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            title="Bagikan"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Info & Tombol Vote */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          {submission.roblox_avatar_url ? (
            <img
              src={submission.roblox_avatar_url}
              alt={submission.roblox_username}
              className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-zinc-100 truncate group-hover:text-rose-400 transition-colors">
              @{submission.roblox_username}
            </h4>
            {submission.caption ? (
              <p className="text-xs text-zinc-400 line-clamp-1">
                {submission.caption}
              </p>
            ) : (
              <p className="text-[11px] text-zinc-500">Player Roblox</p>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black tracking-tight text-white">
              {submission.votes.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-zinc-400">vote</span>
          </div>

          <button
            onClick={handleVoteClick}
            disabled={isVoting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              hasVoted
                ? "bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30"
                : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                hasVoted ? "fill-rose-500 text-rose-500 scale-110" : "text-white"
              }`}
            />
            <span>{hasVoted ? "Sudah Divote" : "Vote"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
