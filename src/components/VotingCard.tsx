"use client";

import React, { useState } from "react";
import {
  Heart,
  User,
  Maximize2,
  Share2,
  Check,
  Sparkles,
  Shirt,
  Image as ImageIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Submission } from "@/lib/supabase";
import { TikTokPlayer, TikTokIcon } from "./TikTokPlayer";

interface VotingCardProps {
  submission: Submission;
  hasVoted: boolean;
  isQuotaFull?: boolean;
  onVote: (id: string, contestantName: string, avatarUrl?: string) => void;
  onImageClick: (url: string, title: string, tiktokUrl?: string | null) => void;
  onRequireConnect: (id: string, contestantName: string) => void;
  onQuotaExceeded?: () => void;
  isConnected: boolean;
  rank?: number;
}

export function VotingCard({
  submission,
  hasVoted,
  isQuotaFull,
  onVote,
  onImageClick,
  onRequireConnect,
  onQuotaExceeded,
  isConnected,
  rank,
}: VotingCardProps) {
  const [copied, setCopied] = useState(false);
  const [mediaMode, setMediaMode] = useState<"photo" | "tiktok">("photo");

  const hasTikTok = Boolean(submission.tiktok_url);

  const handleVoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Votes are permanent! Once voted, clicking does nothing
    if (hasVoted) return;

    // Connect Roblox required before voting
    if (!isConnected) {
      onRequireConnect(submission.id, submission.roblox_username);
      return;
    }

    // Check if user has already reached their 2-vote quota
    if (isQuotaFull) {
      if (onQuotaExceeded) onQuotaExceeded();
      return;
    }

    // Trigger vote confirmation modal
    onVote(submission.id, submission.roblox_username, submission.image_url);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `Check out and vote for @${submission.roblox_username}'s outfit on TREC KL Fashion Show!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#0c0e14]/90 backdrop-blur-xl border border-white/10 hover:border-[#ff007f]/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff007f]/15 hover:-translate-y-1 flex flex-col">
      {/* Glow highlight on top-right */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#ff007f]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#ff007f]/20 transition-all" />

      {/* Top Media Badges & Controls Header */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left: Rank Badge or Media Count */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {rank ? (
            <div
              className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider shadow-xl backdrop-blur-md flex items-center gap-1.5 ${
                rank === 1
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 border border-amber-300/50 shadow-amber-400/20"
                  : rank === 2
                  ? "bg-gradient-to-r from-slate-200 to-zinc-400 text-zinc-950 border border-white/50"
                  : rank === 3
                  ? "bg-gradient-to-r from-amber-700 to-orange-800 text-white border border-amber-500/40"
                  : "bg-zinc-900/90 text-zinc-300 border border-white/10"
              }`}
            >
              <span>RANK #{rank}</span>
            </div>
          ) : hasTikTok ? (
            <div className="px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-black uppercase tracking-wider text-zinc-200 flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
              <span>Photo + TikTok</span>
            </div>
          ) : null}
        </div>

        {/* Right: Media Switcher Tabs (Only if TikTok exists) */}
        {hasTikTok && (
          <div className="pointer-events-auto flex items-center bg-black/80 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-xl">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMediaMode("photo");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${
                mediaMode === "photo"
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Photo</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMediaMode("tiktok");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${
                mediaMode === "tiktok"
                  ? "bg-gradient-to-r from-[#ff007f] to-rose-600 text-white shadow-md shadow-[#ff007f]/40"
                  : "text-zinc-400 hover:text-[#00f2fe]"
              }`}
            >
              <TikTokIcon className="w-3.5 h-3.5" />
              <span>TikTok</span>
            </button>
          </div>
        )}
      </div>

      {/* Outfit Media Display (Photo or TikTok Video) */}
      <div
        className={`relative w-full bg-zinc-950 overflow-hidden transition-all duration-300 ${
          mediaMode === "tiktok" ? "aspect-[9/13] min-h-[420px]" : "aspect-[4/3]"
        }`}
      >
        {mediaMode === "tiktok" && submission.tiktok_url ? (
          <div className="w-full h-full pt-12 pb-2 px-2 bg-black flex flex-col items-center justify-center">
            <TikTokPlayer url={submission.tiktok_url} compact={false} />
            <button
              type="button"
              onClick={() =>
                onImageClick(
                  submission.image_url,
                  `Runway Outfit by @${submission.roblox_username}`,
                  submission.tiktok_url
                )
              }
              className="mt-2 text-[11px] font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 p-1 transition-colors"
            >
              <Maximize2 className="w-3 h-3 text-[#00f2fe]" />
              <span>Buka Layar Penuh</span>
            </button>
          </div>
        ) : (
          <div
            className="w-full h-full relative cursor-pointer"
            onClick={() =>
              onImageClick(
                submission.image_url,
                `Runway Outfit by @${submission.roblox_username}`,
                submission.tiktok_url
              )
            }
          >
            <img
              src={submission.image_url}
              alt={`Outfit @${submission.roblox_username}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent opacity-80" />

            {/* Hover action overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
                <Maximize2 className="w-3.5 h-3.5 text-[#00f2fe]" /> View Fullscreen
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-white/10 transition-colors shadow-lg"
                title="Share"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
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
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ff007f] rounded-full border-2 border-[#0c0e14]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <h4 className="font-black text-sm text-white tracking-wide truncate group-hover:text-[#00f2fe] transition-colors">
                  @{submission.roblox_username}
                </h4>
                <Sparkles className="w-3 h-3 text-[#ff007f] shrink-0" />
              </div>

              {submission.tiktok_url && (
                <a
                  href={submission.tiktok_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-white/10 text-[10px] font-black text-zinc-300 hover:text-white hover:border-[#ff007f] transition-all shrink-0"
                  title="Lihat di TikTok"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TikTokIcon className="w-2.5 h-2.5 text-[#ff007f]" />
                  <span>TikTok</span>
                </a>
              )}
            </div>
            {submission.caption ? (
              <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-medium">
                {submission.caption}
              </p>
            ) : (
              <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                <Shirt className="w-3 h-3" /> Runway Model
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
            disabled={hasVoted}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
              hasVoted
                ? "bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/40 cursor-default opacity-90 shadow-none"
                : isQuotaFull
                ? "bg-zinc-900 border border-amber-500/40 text-amber-300 hover:bg-zinc-800 active:scale-95"
                : "bg-gradient-to-r from-[#ff007f] via-rose-500 to-[#00f2fe] text-white hover:brightness-110 shadow-lg shadow-[#ff007f]/25 active:scale-95"
            }`}
            title={
              hasVoted
                ? "Your vote has been cast and is permanent"
                : isQuotaFull
                ? "Quota full: Maximum 2 votes per account reached"
                : "Vote for this runway outfit"
            }
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                hasVoted
                  ? "fill-[#ff007f] text-[#ff007f]"
                  : isQuotaFull
                  ? "text-amber-400"
                  : "text-white group-hover:scale-110"
              }`}
            />
            <span>{hasVoted ? "VOTED" : isQuotaFull ? "MAX 2/2" : "VOTE"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
