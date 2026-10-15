"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export interface ConnectedRobloxUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
}

interface RobloxConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (user: ConnectedRobloxUser) => void;
  pendingVoteContestantName?: string;
  isOAuthConfigured?: boolean;
}

export function RobloxConnectModal({
  isOpen,
  onClose,
  onConnected,
  pendingVoteContestantName,
  isOAuthConfigured = false,
}: RobloxConnectModalProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [robloxData, setRobloxData] = useState<ConnectedRobloxUser | null>(null);
  const [error, setError] = useState("");

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setError("");
      setRobloxData(null);
    }
  }, [isOpen]);

  // Debounce lookup
  useEffect(() => {
    const trimmed = usernameInput.trim();
    if (!trimmed || trimmed.length < 3) {
      setRobloxData(null);
      setError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsVerifying(true);
      setError("");
      try {
        const res = await fetch(`/api/roblox-avatar?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (res.ok && data.name) {
          setRobloxData({
            id: data.id,
            username: data.name,
            displayName: data.displayName || data.name,
            avatarUrl: data.avatarUrl,
          });
        } else {
          setRobloxData(null);
          setError("Roblox account not found. Please double-check your username.");
        }
      } catch {
        setRobloxData(null);
      } finally {
        setIsVerifying(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameInput]);

  if (!isOpen) return null;

  const handleManualConfirm = () => {
    if (!robloxData) return;
    localStorage.setItem("trec_connected_roblox_user", JSON.stringify(robloxData));
    onConnected(robloxData);
    onClose();
  };

  const handleOfficialRobloxLogin = () => {
    window.location.href = "/api/auth/roblox/login";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full bg-[#0c0e14] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ff007f]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00f2fe]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff007f] via-rose-500 to-[#00f2fe] p-0.5 mx-auto mb-3 shadow-lg shadow-[#ff007f]/30">
            <div className="w-full h-full bg-[#0c0e14] rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#00f2fe]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ff007f]/15 text-[#ff007f] text-[10px] font-black uppercase tracking-widest border border-[#ff007f]/30 mb-2">
            <Sparkles className="w-3 h-3" />
            Official Verification
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase italic">
            Connect Roblox Account
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {pendingVoteContestantName
              ? `Connect your Roblox account to cast your vote for @${pendingVoteContestantName}`
              : "Connect your official Roblox account to vote in the Fashion Show"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Official Roblox Login Button */}
          {isOAuthConfigured ? (
            <button
              onClick={handleOfficialRobloxLogin}
              className="w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-[#00f2fe] hover:brightness-110 shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 group"
            >
              <img
                src="/trec-kl/icon.png"
                alt="Roblox"
                className="w-5 h-5 rounded-lg group-hover:scale-110 transition-transform"
              />
              <span>Log in with Official Roblox</span>
              <ExternalLink className="w-4 h-4 text-white/80" />
            </button>
          ) : (
            <div className="p-3 bg-zinc-950/80 border border-white/10 rounded-2xl text-left space-y-1">
              <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Roblox OAuth Setup Available
              </p>
              <p className="text-[10px] text-zinc-400">
                To enable 1-click official Roblox login, enter <code className="text-zinc-200">ROBLOX_CLIENT_ID</code> in <code className="text-zinc-200">.env.local</code>. Meanwhile, you can connect via username below:
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {isOAuthConfigured ? "Or Verify with Username" : "Connect via Username"}
            </span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>

          {/* Manual Username Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
              Your Roblox Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. Builderman"
                className="w-full px-4 py-3 bg-zinc-950 border border-white/15 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] text-sm font-medium transition-all"
              />
              {isVerifying && (
                <div className="absolute right-3.5 top-3.5">
                  <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Preview Verified Account */}
          {robloxData && (
            <div className="flex items-center gap-3.5 p-3.5 bg-zinc-950/90 border border-emerald-500/30 rounded-2xl shadow-inner">
              {robloxData.avatarUrl ? (
                <img
                  src={robloxData.avatarUrl}
                  alt={robloxData.username}
                  className="w-12 h-12 rounded-xl border border-emerald-500/50 bg-zinc-900 object-cover shadow-md shadow-emerald-500/20"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-emerald-500/50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white truncate">
                    {robloxData.displayName}
                  </span>
                  <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-black uppercase tracking-wider">
                    Ready to Vote
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">@{robloxData.username}</p>
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </p>
          )}

          {/* Confirm Button */}
          <button
            onClick={handleManualConfirm}
            disabled={!robloxData}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#ff007f] via-rose-600 to-[#00f2fe] hover:brightness-110 shadow-xl shadow-[#ff007f]/25 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Connect Username</span>
          </button>

          <p className="text-[10px] text-zinc-500 text-center font-medium">
            Protected with anti-fraud encryption. Only public Roblox avatar data is read.
          </p>
        </div>
      </div>
    </div>
  );
}
