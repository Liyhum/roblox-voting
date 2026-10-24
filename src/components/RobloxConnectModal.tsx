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
import { generateHardwareFingerprint } from "@/lib/hardware-fingerprint";

export interface ConnectedRobloxUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  isInGroup?: boolean;
  roleName?: string;
  accountAgeDays?: number;
  isAccountOldEnough?: boolean;
}

const HOST_SECRET_CODES = ["#host", "#admin", "#femme", "femme_host99_tr3c$2026"];

interface RobloxConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (user: ConnectedRobloxUser) => void;
  pendingVoteContestantName?: string;
  isOAuthConfigured?: boolean;
  onOpenHostControls?: () => void;
}

export function RobloxConnectModal({
  isOpen,
  onClose,
  onConnected,
  pendingVoteContestantName,
  isOAuthConfigured = false,
  onOpenHostControls,
}: RobloxConnectModalProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [robloxData, setRobloxData] = useState<ConnectedRobloxUser | null>(null);
  const [error, setError] = useState("");

  const isHostCode = HOST_SECRET_CODES.includes(usernameInput.trim().toLowerCase());

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

    // Intercept Host Secret Code: Do not look up Roblox API
    if (HOST_SECRET_CODES.includes(trimmed.toLowerCase())) {
      setRobloxData(null);
      setError("");
      setIsVerifying(false);
      return;
    }

    setIsVerifying(true);
    setError("");
    try {
      const res = await fetch(`/api/roblox-avatar?username=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (res.ok && data.name) {
        // Real-time check if this device/hardware is already bound to another USN
        try {
          const hardwareFingerprint = await generateHardwareFingerprint();
          let deviceId = "";
          if (typeof window !== "undefined") {
            deviceId = localStorage.getItem("trec_voter_device_id") || "";
            if (!deviceId) {
              deviceId = "dev_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
              localStorage.setItem("trec_voter_device_id", deviceId);
            }
          }

          const checkRes = await fetch("/api/bind-device", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              voterId: data.id,
              username: data.name,
              deviceId,
              hardwareFingerprint,
              checkOnly: true,
            }),
          });

          const checkData = await checkRes.json();
          if (!checkRes.ok || checkData.success === false) {
            setError(checkData.message || "Perangkat ini sudah terkunci untuk akun Roblox lain.");
            setRobloxData(null);
            return;
          }
        } catch {
          // non-blocking if check fails network
        }

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

  const handleManualConfirm = async () => {
    if (!robloxData) return;

    setIsVerifying(true);
    setError("");

    try {
      const hardwareFingerprint = await generateHardwareFingerprint();
      let deviceId = "";
      if (typeof window !== "undefined") {
        deviceId = localStorage.getItem("trec_voter_device_id") || "";
        if (!deviceId) {
          deviceId = "dev_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
          localStorage.setItem("trec_voter_device_id", deviceId);
        }
      }

      const res = await fetch("/api/bind-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voterId: robloxData.id,
          username: robloxData.username,
          deviceId,
          hardwareFingerprint,
        }),
      });

      const resData = await res.json();
      if (!res.ok || resData.success === false) {
        setError(resData.message || "Perangkat ini sudah terikat dengan akun Roblox lain.");
        setIsVerifying(false);
        return;
      }
    } catch {
      // ignore
    } finally {
      setIsVerifying(false);
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
            Simple Voter Check-In
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase italic">
            Enter Roblox Username
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {pendingVoteContestantName
              ? `Enter your username to vote for @${pendingVoteContestantName}`
              : "Enter your Roblox username (USN) to vote. No password needed!"}
          </p>
        </div>

        <div className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
              Your Roblox Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. ZeerutLua"
                autoFocus
                className="w-full px-4 py-3 bg-zinc-950 border border-white/15 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] text-sm font-medium transition-all"
              />
              {isVerifying && (
                <div className="absolute right-3.5 top-3.5">
                  <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Host Secret Trigger View */}
          {isHostCode ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/50 text-center space-y-3 shadow-lg shadow-amber-500/10 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto text-xl shadow-md">
                👑
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Host Secret Code Verified!
                </h4>
                <p className="text-xs text-zinc-300 mt-1">
                  Organizer authorization recognized. You can now start, pause, or end voting for all attendees.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenHostControls) onOpenHostControls();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-xl shadow-amber-400/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>⚡ Open Host Controls (Start / Stop Vote)</span>
              </button>
            </div>
          ) : (
            <>
              {/* Account Preview Status */}
              {robloxData && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5 p-3.5 bg-zinc-950/90 border border-emerald-500/40 rounded-2xl shadow-inner">
                    {robloxData.avatarUrl ? (
                      <img
                        src={robloxData.avatarUrl}
                        alt={robloxData.username}
                        className="w-12 h-12 rounded-xl border border-emerald-500/50 bg-zinc-900 object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-sm text-white truncate">
                          {robloxData.displayName}
                        </span>
                        <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Found
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">@{robloxData.username}</p>
                    </div>
                  </div>

                  {/* Group Verification - Strict Requirement */}
                  {robloxData.isInGroup ? (
                    <div className="px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs shadow-inner">
                      <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>FEMME&apos;S STUDIO Member Verified</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                        {robloxData.roleName || "Member"}
                      </span>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/40 rounded-2xl text-left space-y-2.5 shadow-md">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-wider">
                            Wajib Gabung Roblox Group
                          </p>
                          <p className="text-[11px] text-zinc-300 leading-relaxed mt-0.5">
                            Akun <strong className="text-white">@{robloxData.username}</strong> belum bergabung ke grup resmi <strong className="text-amber-400">FEMME&apos;S STUDIO</strong>. Kamu wajib join grup terlebih dahulu untuk bisa voting!
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <a
                          href="https://www.roblox.com/groups/740188661"
                          target="_blank"
                          rel="noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#ff007f]/25 text-center min-h-[38px]"
                        >
                          <span>Join FEMME&apos;S STUDIO</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => verifyUser(usernameInput)}
                          disabled={isVerifying}
                          className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 min-h-[38px] active:scale-95"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin text-[#00f2fe]" : ""}`} />
                          <span>{isVerifying ? "Mengecek..." : "Cek Ulang Status"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Account Age Gate Check - Anti-Bot clone protection */}
                  {robloxData.isAccountOldEnough === false && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-2 text-left">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-300">Akun Roblox Terlalu Baru</p>
                        <p className="text-[11px] text-zinc-300 mt-0.5">
                          Akun ini baru berumur <strong className="text-white">{robloxData.accountAgeDays} hari</strong>. Syarat minimal adalah <strong className="text-white">30 hari</strong> untuk mencegah akun klon / bot.
                        </p>
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

              {/* Confirm Button - Strictly blocked if not in group or account too young */}
              <button
                onClick={handleManualConfirm}
                disabled={!robloxData || !robloxData.isInGroup || robloxData.isAccountOldEnough === false}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                  robloxData && robloxData.isInGroup && robloxData.isAccountOldEnough !== false
                    ? "bg-gradient-to-r from-[#ff007f] via-rose-600 to-[#00f2fe] text-white hover:brightness-110 shadow-xl shadow-[#ff007f]/25 cursor-pointer"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5 opacity-70"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {!robloxData
                    ? "Type Your Roblox Username"
                    : !robloxData.isInGroup
                    ? "Wajib Join Group FEMME'S STUDIO"
                    : robloxData.isAccountOldEnough === false
                    ? "Akun Terlalu Baru (< 30 Hari)"
                    : "Confirm & Cast Vote"}
                </span>
              </button>

              {/* Optional OAuth Login Option */}
              {isOAuthConfigured && (
                <div className="pt-2 text-center border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleOfficialRobloxLogin}
                    className="text-[11px] text-zinc-400 hover:text-white transition-colors underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Or log in with official Roblox OAuth</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </>
          )}

          <p className="text-[10px] text-zinc-500 text-center font-medium">
            Each Roblox account has a fair quota of 2 votes across the runway.
          </p>
        </div>
      </div>
    </div>
  );
}
