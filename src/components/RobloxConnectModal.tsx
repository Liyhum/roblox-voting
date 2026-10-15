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
  Users,
  RefreshCw,
} from "lucide-react";

export interface ConnectedRobloxUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  isInGroup?: boolean;
  roleName?: string;
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

  const verifyUser = async (nameToVerify: string) => {
    const trimmed = nameToVerify.trim();
    if (!trimmed || trimmed.length < 3) {
      setRobloxData(null);
      setError("");
      return;
    }

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
          isInGroup: Boolean(data.isInGroup),
          roleName: data.roleName || "",
        });
      } else {
        setRobloxData(null);
        setError("Roblox account not found. Please double-check your username.");
      }
    } catch {
      setRobloxData(null);
      setError("Failed to verify Roblox account. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Debounce lookup
  useEffect(() => {
    const timer = setTimeout(() => {
      verifyUser(usernameInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameInput]);

  if (!isOpen) return null;

  const handleManualConfirm = () => {
    if (!robloxData) return;
    if (!robloxData.isInGroup) {
      setError("You must join our official Roblox Group before you can vote.");
      return;
    }
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
            Group Member Verification
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase italic">
            Connect Roblox Account
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {pendingVoteContestantName
              ? `Cast your vote for @${pendingVoteContestantName}`
              : "Verify your account and group membership to vote"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Official Roblox Login Button if OAuth active */}
          {isOAuthConfigured && (
            <>
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

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-[1px] bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Or Connect with Username
                </span>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>
            </>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
              Roblox Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. YourRobloxUsername"
                className="w-full px-4 py-3 bg-zinc-950 border border-white/15 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] text-sm font-medium transition-all"
              />
              {isVerifying && (
                <div className="absolute right-3.5 top-3.5">
                  <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Account & Group Membership Status */}
          {robloxData && (
            <div className="space-y-3">
              {/* User profile row */}
              <div className="flex items-center gap-3.5 p-3.5 bg-zinc-950/90 border border-white/10 rounded-2xl shadow-inner">
                {robloxData.avatarUrl ? (
                  <img
                    src={robloxData.avatarUrl}
                    alt={robloxData.username}
                    className="w-12 h-12 rounded-xl border border-white/20 bg-zinc-900 object-cover shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-zinc-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-white truncate">
                      {robloxData.displayName}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">@{robloxData.username}</p>
                </div>
              </div>

              {/* Group Check Result */}
              {robloxData.isInGroup ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-emerald-300">
                        FEMME'S STUDIO Member
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        Role: {robloxData.roleName || "Member"} &bull; Eligible to Vote
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Verified
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-amber-300 uppercase tracking-wide">
                        Group Membership Required
                      </p>
                      <p className="text-[11px] text-zinc-300 mt-0.5">
                        You must join our official Roblox group <b>FEMME'S STUDIO</b> to vote!
                      </p>
                    </div>
                  </div>

                  {/* Direct Link to Join Group */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="https://www.roblox.com/groups/740188661"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-[11px] tracking-wider uppercase text-center flex items-center justify-center gap-1.5 shadow-md shadow-[#ff007f]/20 transition-all"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Join FEMME'S STUDIO</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => verifyUser(usernameInput)}
                      disabled={isVerifying}
                      className="p-2.5 rounded-xl bg-zinc-900 border border-white/15 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Re-check Membership"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>
              )}
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
            disabled={!robloxData || !robloxData.isInGroup}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
              robloxData && robloxData.isInGroup
                ? "bg-gradient-to-r from-[#ff007f] via-rose-600 to-[#00f2fe] text-white hover:brightness-110 shadow-xl shadow-[#ff007f]/25"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {robloxData && !robloxData.isInGroup
                ? "Join Group First to Vote"
                : "Confirm & Connect Account"}
            </span>
          </button>

          <p className="text-[10px] text-zinc-500 text-center font-medium">
            Official Group ID: 740188661 (FEMME'S STUDIO &bull; 11.5k+ Members)
          </p>
        </div>
      </div>
    </div>
  );
}
