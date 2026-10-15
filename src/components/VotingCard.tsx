"use client";

import React, { useState } from "react";
import { Heart, User, Maximize2, Share2, Check, Sparkles } from "lucide-react";
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
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        // Cyberpunk nightlife confetti
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { x, y },
          colors: ["#ff007f", "#00f2fe", "#ffbe0b", "#a855f7"],
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
      `Yuk vote foto @${submission.roblox_username} di TREC KL Roblox Awards!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#0c0e14]/90 backdrop-blur-xl border border-white/10 hover:border-[#ff007f]/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff007f]/15 hover:-translate-y-1 flex flex-col">
      {/* Glow highlight on top-right */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#ff007f]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#ff007f]/20 transition-all" />

      {/* Rank Badge if provided */}
      {rank && (
        <div
          className={`absolute top-3.5 left-3.5 z-20 px-3 py-1 rounded-xl text-xs font-black tracking-wider shadow-xl backdrop-blur-md flex items-center gap-1.5 ${
            rank === 1
              ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 neon-glow-amber border border-amber-300/50"
              : rank === 2
              ? "bg-gradient-to-r from-slate-200 to-zinc-400 text-zinc-950 border border-white/50"
              : rank === 3
              ? "bg-gradient-to-r from-amber-700 to-orange-800 text-white border border-amber-500/40"
              : "bg-zinc-900/90 text-zinc-300 border border-white/10"
          }`}
        >
          <span>RANK #{rank}</span>
        </div>
      )}

      {/* Gambar Foto dengan Aspect Ratio Mewah */}
      <div
        className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden cursor-pointer"
        onClick={() =>
          onImageClick(
            submission.image_url,
            `Karya TREC KL @${submission.roblox_username}`
          )
        }
      >
        <img
          src={submission.image_url}
          alt={`Karya @${submission.roblox_username}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Cyber Vignette & Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent opacity-80" />

        {/* Hover action overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
            <Maximize2 className="w-3.5 h-3.5 text-[#00f2fe]" /> Perbesar Foto
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors shadow-lg"
            title="Bagikan"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Info Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        {/* User Profile Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            {submission.roblox_avatar_url ? (
              <img
                src={submission.roblox_avatar_url}
                alt={submission.roblox_username}
                className="w-11 h-11 rounded-2xl border-2 border-white/15 bg-zinc-900 object-cover shadow-md group-hover:border-[#00f2fe] transition-colors"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c0e14]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-sm text-white tracking-wide truncate group-hover:text-[#00f2fe] transition-colors">
                @{submission.roblox_username}
              </h4>
              <Sparkles className="w-3 h-3 text-[#ff007f] shrink-0" />
            </div>
            {submission.caption ? (
              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-medium">
                {submission.caption}
              </p>
            ) : (
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                TREC KL Player
              </p>
            )}
          </div>
        </div>

        {/* Bottom Vote Row */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-mono">
                {submission.votes.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                Votes
              </span>
            </div>
          </div>

          <button
            onClick={handleVoteClick}
            disabled={isVoting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 active:scale-95 ${
              hasVoted
                ? "bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/50 hover:bg-[#ff007f]/30"
                : "bg-gradient-to-r from-[#ff007f] via-rose-500 to-[#00f2fe] text-white hover:brightness-110 shadow-lg shadow-[#ff007f]/25"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                hasVoted ? "fill-[#ff007f] text-[#ff007f] scale-110" : "text-white group-hover:scale-110"
              }`}
            />
            <span>{hasVoted ? "VOTED" : "VOTE"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
