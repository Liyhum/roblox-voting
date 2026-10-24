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
  ShieldCheck,
  Image as ImageIcon,
  AlertTriangle,
  Heart,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { VotingCard } from "@/components/VotingCard";
import { UploadSection } from "@/components/UploadSection";
import { Leaderboard } from "@/components/Leaderboard";
import { SetupGuide } from "@/components/SetupGuide";
import { RobloxConnectModal, ConnectedRobloxUser } from "@/components/RobloxConnectModal";
import { HostControlModal } from "@/components/HostControlModal";
import { TikTokPlayer, TikTokIcon } from "@/components/TikTokPlayer";
import { CountdownTimer } from "@/components/CountdownTimer";
import { generateHardwareFingerprint } from "@/lib/hardware-fingerprint";
import { supabase, isSupabaseConfigured, Submission } from "@/lib/supabase";
import { EventStatusType } from "@/lib/event-status";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gallery" | "upload" | "leaderboard">("gallery");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"votes" | "newest">("votes");
  const [votedIds, setVotedIds] = useState<string[]>([]);

  // Event Voting Status (Locked / Live / Ended)
  const [eventStatusData, setEventStatusData] = useState<{
    status: EventStatusType;
    startedAt: number | null;
    durationSeconds: number | null;
    endsAt: number | null;
    customEndDate?: string | null;
  }>({
    status: "not_started",
    startedAt: null,
    durationSeconds: null,
    endsAt: null,
    customEndDate: null,
  });
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // Roblox Connect state
  const [connectedUser, setConnectedUser] = useState<ConnectedRobloxUser | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [pendingVoteTarget, setPendingVoteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isOAuthConfigured, setIsOAuthConfigured] = useState(false);

  // Modal Lightbox for 2 Media (Foto + TikTok Video)
  const [zoomModal, setZoomModal] = useState<{
    url: string;
    title: string;
    tiktokUrl?: string | null;
  } | null>(null);
  const [modalMediaTab, setModalMediaTab] = useState<"photo" | "tiktok">("photo");

  // Quota Exceeded Modal (Max 2 Votes per Roblox account)
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  // Vote Confirmation Target (English Confirmation Modal)
  const [confirmVoteTarget, setConfirmVoteTarget] = useState<{
    id: string;
    name: string;
    avatarUrl?: string;
  } | null>(null);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  // Helper for user-specific vote storage key
  const getVoteStorageKey = useCallback((username?: string) => {
    return username
      ? `trec_kl_voted_${username.trim().toLowerCase()}`
      : "trec_kl_voted_guest";
  }, []);

  // Load connected Roblox user and voted IDs
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("trec_connected_roblox_user");
      if (storedUser) {
        setConnectedUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore
    }

    // Check official Roblox OAuth server session
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsOAuthConfigured(Boolean(data.isOAuthConfigured));
        if (data.user) {
          setConnectedUser(data.user);
          localStorage.setItem("trec_connected_roblox_user", JSON.stringify(data.user));
        }
      })
      .catch(() => {});
  }, []);

  // Sync votes whenever connected user changes
  useEffect(() => {
    const key = getVoteStorageKey(connectedUser?.username);
    try {
      const storedVotes = localStorage.getItem(key);
      if (storedVotes) {
        setVotedIds(JSON.parse(storedVotes));
      } else {
        setVotedIds([]);
      }
    } catch {
      setVotedIds([]);
    }

    // If Supabase is configured and user is connected, sync from votes_log
    if (isSupabaseConfigured && connectedUser?.id) {
      supabase
        .from("votes_log")
        .select("submission_id")
        .eq("voter_roblox_id", connectedUser.id)
        .then(({ data, error }) => {
          if (!error && data) {
            const ids = data.map((row: { submission_id: string }) => row.submission_id);
            setVotedIds(ids);
            localStorage.setItem(key, JSON.stringify(ids));
          }
        });
    }
  }, [connectedUser, getVoteStorageKey]);

  // Fetch submissions from Supabase
  const loadSubmissions = useCallback(async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order(sortBy === "votes" ? "votes" : "created_at", { ascending: false });

      if (error) {
        console.error("Failed to load submissions:", error);
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

  // Polling Event Status (Locked, Live, Ended)
  const fetchEventStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/event-status");
      const data = await res.json();
      if (data && data.success) {
        setEventStatusData({
          status: data.status,
          startedAt: data.startedAt,
          durationSeconds: data.durationSeconds,
          endsAt: data.endsAt,
          customEndDate: data.customEndDate || null,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchEventStatus();
    // Poll every 3 seconds for instant synchronization across all attendee devices
    const interval = setInterval(fetchEventStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchEventStatus]);

  // Handle Vote Request from card or leaderboard
  const handleVoteRequest = (id: string, contestantName: string, avatarUrl?: string) => {
    // 1. Check if voting has been started by the host
    if (eventStatusData.status === "not_started") {
      alert("Voting has not started yet! Please wait for the event host to initiate the voting session.");
      return;
    }

    if (eventStatusData.status === "ended") {
      alert("Voting has concluded. Thank you for participating!");
      return;
    }

    // 2. Strict Check: Must connect and must be member of FEMME'S STUDIO group
    if (!connectedUser || !connectedUser.isInGroup) {
      setPendingVoteTarget({ id, name: contestantName, avatarUrl } as { id: string; name: string });
      setIsConnectModalOpen(true);
      return;
    }

    if (votedIds.includes(id)) {
      return;
    }

    // STRICT CHECK: Maximum 2 votes per Roblox account
    if (votedIds.length >= 2) {
      setIsQuotaModalOpen(true);
      return;
    }

    // Open English Vote Confirmation Modal (Permanent Vote Notice)
    setConfirmVoteTarget({ id, name: contestantName, avatarUrl });
  };

  // Execute vote after user confirms in the English confirmation modal
  const executeConfirmedVote = async () => {
    if (!confirmVoteTarget) return;
    const { id, name } = confirmVoteTarget;

    if (votedIds.includes(id) || votedIds.length >= 2) {
      setConfirmVoteTarget(null);
      return;
    }

    setIsSubmittingVote(true);
    const key = getVoteStorageKey(connectedUser?.username);
    const nextVoted = [...votedIds, id];

    // Optimistic update
    setVotedIds(nextVoted);
    localStorage.setItem(key, JSON.stringify(nextVoted));

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );

    // Celebration confetti
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff007f", "#00f2fe", "#ffbe0b", "#a855f7"],
    });

    // Generate / Retrieve persistent device fingerprint ID
    let deviceId = "";
    let hardwareFingerprint = "";
    if (typeof window !== "undefined") {
      deviceId = localStorage.getItem("trec_voter_device_id") || "";
      if (!deviceId) {
        deviceId = "dev_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
        localStorage.setItem("trec_voter_device_id", deviceId);
      }
      try {
        hardwareFingerprint = await generateHardwareFingerprint();
      } catch {
        hardwareFingerprint = "";
      }
    }

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId: id,
          voterUsername: connectedUser?.username,
          voterId: connectedUser?.id,
          deviceId,
          hardwareFingerprint,
        }),
      });

      const resData = await res.json();

      if (!res.ok || resData.success === false) {
        alert(resData.message || "Failed to record vote. Your 2-vote quota may have been reached.");
        // Rollback optimistic update
        setVotedIds(votedIds);
        localStorage.setItem(key, JSON.stringify(votedIds));
        setSubmissions((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, votes: Math.max(0, item.votes - 1) } : item
          )
        );
        return;
      }
    } catch (err) {
      console.error("Failed to cast vote:", err);
      // Rollback optimistic update on network failure
      setVotedIds(votedIds);
      localStorage.setItem(key, JSON.stringify(votedIds));
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, votes: Math.max(0, item.votes - 1) } : item
        )
      );
    } finally {
      setIsSubmittingVote(false);
      setConfirmVoteTarget(null);
    }
  };

  // Callback after user connects Roblox account
  const handleUserConnected = async (user: ConnectedRobloxUser) => {
    setConnectedUser(user);
    if (pendingVoteTarget) {
      // Trigger confirmation modal for pending vote target
      const target = pendingVoteTarget;
      setPendingVoteTarget(null);
      setTimeout(() => {
        handleVoteRequest(target.id, target.name);
      }, 300);
    }
  };

  const handleDisconnect = async () => {
    localStorage.removeItem("trec_connected_roblox_user");
    setConnectedUser(null);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
  };

  // Search filtering
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
        connectedUser={connectedUser}
        onOpenConnectModal={() => {
          setPendingVoteTarget(null);
          setIsConnectModalOpen(true);
        }}
        onDisconnect={handleDisconnect}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-28 sm:pb-14 relative z-10">
        {!isSupabaseConfigured && <SetupGuide />}

        {/* Tab 1: Runway Fashion Gallery */}
        {activeTab === "gallery" && (
          <div className="space-y-8 sm:space-y-10">
            {/* Cinematic Hero Showcase */}
            <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-[#0c0e14]">
              {/* Background with Cinematic Vignette */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/trec-kl/thumb1.png"
                  alt="TREC KL Runway"
                  className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06070a] via-[#06070a]/90 to-[#06070a]/60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 p-5 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[360px] sm:min-h-[400px]">
                <div className="max-w-2xl space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f] text-[11px] sm:text-xs font-black uppercase tracking-widest backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    TREC KL &bull; Runway Fashion Show
                  </div>

                  <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase italic leading-tight sm:leading-none">
                    VOTE THE BEST AVATAR RUNWAY DRIP!
                  </h1>

                  <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                    The premier fashion show &amp; nightlife hangout on Roblox. Connect your Roblox account, vote for your favorite avatar styles, or submit your outfit to win <b className="text-amber-400">Best Dressed</b>!
                  </p>
                </div>

                {/* Live Stats & CTA Row */}
                <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-5 sm:gap-6 border-t border-white/10 mt-6">
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="flex-1 sm:flex-initial px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-[#ff007f]/30 transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      Submit Outfit
                    </button>

                    <button
                      onClick={() => setActiveTab("leaderboard")}
                      className="px-4 sm:px-6 py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Leaderboard
                    </button>

                    {!connectedUser && (
                      <button
                        onClick={() => {
                          setPendingVoteTarget(null);
                          setIsConnectModalOpen(true);
                        }}
                        className="px-4 sm:px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#00f2fe]" />
                        <span>Connect</span>
                      </button>
                    )}

                    <a
                      href="https://www.roblox.com/games/127693451158806/TREC-KL"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 sm:px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 active:scale-95 min-h-[44px]"
                    >
                      <Gamepad2 className="w-4 h-4 text-[#00f2fe]" />
                      <span className="hidden sm:inline">Play Game</span>
                      <ExternalLink className="w-3 h-3 text-zinc-500" />
                    </a>
                  </div>

                  {/* Counter Badges */}
                  <div className="flex items-center justify-around sm:justify-end gap-6 text-center sm:text-right pt-3 sm:pt-0 border-t border-white/5 sm:border-t-0">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono">
                        {submissions.length}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Total Models
                      </div>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10" />
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-[#ff007f] font-mono">
                        {totalVotesCount.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Votes Cast
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Event Status & Host Trigger Banner */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-300 backdrop-blur-xl relative overflow-hidden ${
                eventStatusData.status === "active"
                  ? "bg-gradient-to-r from-emerald-950/40 via-zinc-950/80 to-emerald-950/40 border-emerald-500/40 shadow-xl shadow-emerald-500/10"
                  : eventStatusData.status === "ended"
                  ? "bg-gradient-to-r from-rose-950/30 via-zinc-950/80 to-zinc-950/80 border-rose-500/30"
                  : "bg-gradient-to-r from-amber-950/30 via-zinc-950/80 to-zinc-950/80 border-amber-500/30"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center md:text-left">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shadow-md shrink-0 border ${
                      eventStatusData.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : eventStatusData.status === "ended"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    }`}
                  >
                    {eventStatusData.status === "active" ? (
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                      </span>
                    ) : eventStatusData.status === "ended" ? (
                      <Lock className="w-5 h-5 text-rose-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-amber-400 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          eventStatusData.status === "active"
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : eventStatusData.status === "ended"
                            ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                            : "bg-amber-500/15 border-amber-500/40 text-amber-300"
                        }`}
                      >
                        {eventStatusData.status === "active"
                          ? "LIVE VOTING OPEN"
                          : eventStatusData.status === "ended"
                          ? "VOTING CONCLUDED"
                          : "VOTING LOCKED / NOT STARTED"}
                      </span>
                      {eventStatusData.status === "active" && (
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:inline">
                          &bull; Real-time synchronized
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white tracking-wide mt-1">
                      {eventStatusData.status === "active"
                        ? "Votes Are Now Being Accepted!"
                        : eventStatusData.status === "ended"
                        ? "The voting round has ended"
                        : "Voting Has Not Begun Yet"}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                      {eventStatusData.status === "active"
                        ? "You may now vote for up to 2 models. Browse entries below and hit VOTE!"
                        : eventStatusData.status === "ended"
                        ? "Voting is closed. Check the Leaderboard tab to view the winners and rankings."
                        : "Please wait for the event host to start the voting session. Models are open for preview."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Countdown Timer */}
            <CountdownTimer
              targetDate={
                eventStatusData.status === "active" && eventStatusData.endsAt
                  ? new Date(eventStatusData.endsAt).toISOString()
                  : eventStatusData.customEndDate
                  ? eventStatusData.customEndDate
                  : undefined
              }
            />

            {/* Account Quota Status Banner */}
            {connectedUser && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-950/90 to-zinc-900/90 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shadow-md border ${
                      votedIds.length >= 2
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        : "bg-[#ff007f]/20 text-[#ff007f] border-[#ff007f]/40"
                    }`}
                  >
                    {votedIds.length}/2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Voting Quota:</span>
                      <span
                        className={
                          votedIds.length >= 2
                            ? "text-amber-400 font-extrabold"
                            : "text-[#00f2fe] font-extrabold"
                        }
                      >
                        {votedIds.length === 0
                          ? "2 Votes Remaining"
                          : votedIds.length === 1
                          ? "1 Vote Remaining"
                          : "0 Votes Left (Quota Full)"}
                      </span>
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Signed in as{" "}
                      <span className="text-white font-semibold">@{connectedUser.username}</span>{" "}
                      &bull; ⚠️ <span className="text-zinc-300">Votes are permanent and cannot be undone</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                    Max 2 Votes / Account
                  </span>
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0c0e14]/80 border border-white/10 p-3.5 sm:p-4 rounded-3xl backdrop-blur-xl">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model username or outfit title..."
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff007f] transition-all"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 hidden sm:inline flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
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
                    Top Votes
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
                    Newest
                  </button>
                </div>

                <button
                  onClick={() => loadSubmissions()}
                  className="p-2.5 rounded-2xl bg-zinc-950/90 border border-white/10 text-zinc-400 hover:text-white hover:border-[#ff007f] transition-colors shadow-md"
                  title="Refresh List"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid Galeri Runway */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-2 border-[#ff007f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-zinc-400">Loading runway models...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-20 bg-[#0c0e14]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <h3 className="text-lg font-black text-white uppercase tracking-wider">
                  {searchQuery ? "No models match your search" : "The Runway is Ready for You!"}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  {searchQuery
                    ? `No entries found matching "${searchQuery}". Try a different keyword.`
                    : "No outfits have been submitted yet. Be the first to register your avatar and win votes!"}
                </p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-[#ff007f]/25 hover:brightness-110 transition-all"
                >
                  Submit Your Avatar Now!
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredSubmissions.map((sub, index) => (
                  <VotingCard
                    key={sub.id}
                    submission={sub}
                    hasVoted={votedIds.includes(sub.id)}
                    isQuotaFull={votedIds.length >= 2}
                    eventStatus={eventStatusData.status}
                    onVote={(id, name, avatarUrl) => handleVoteRequest(id, name, avatarUrl)}
                    onQuotaExceeded={() => setIsQuotaModalOpen(true)}
                    onImageClick={(url, title, tiktokUrl) => {
                      setZoomModal({ url, title, tiktokUrl });
                      setModalMediaTab("photo");
                    }}
                    onRequireConnect={(id, contestantName) => {
                      setPendingVoteTarget({ id, name: contestantName });
                      setIsConnectModalOpen(true);
                    }}
                    isConnected={Boolean(connectedUser)}
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
            connectedUsername={connectedUser?.username}
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
            onImageClick={(url, title, tiktokUrl) => {
              setZoomModal({ url, title, tiktokUrl });
              setModalMediaTab("photo");
            }}
          />
        )}
      </main>

      {/* Modal Connect Roblox */}
      <RobloxConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => {
          setIsConnectModalOpen(false);
          setPendingVoteTarget(null);
        }}
        onConnected={handleUserConnected}
        pendingVoteContestantName={pendingVoteTarget?.name}
        isOAuthConfigured={isOAuthConfigured}
        onOpenHostControls={() => setIsHostModalOpen(true)}
      />

      {/* Lightbox Modal (2 Media: Photo + Video TikTok) */}
      {zoomModal && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setZoomModal(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center my-auto overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Close Button + Media Selector if TikTok exists */}
            <div className="w-full flex items-center justify-between pb-3 sm:pb-4 gap-2">
              {zoomModal.tiktokUrl ? (
                <div className="flex items-center bg-zinc-900/90 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl">
                  <button
                    type="button"
                    onClick={() => setModalMediaTab("photo")}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all min-h-[38px] ${
                      modalMediaTab === "photo"
                        ? "bg-white/20 text-white shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMediaTab("tiktok")}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all min-h-[38px] ${
                      modalMediaTab === "tiktok"
                        ? "bg-gradient-to-r from-[#ff007f] to-rose-600 text-white shadow-md shadow-[#ff007f]/40"
                        : "text-zinc-400 hover:text-[#00f2fe]"
                    }`}
                  >
                    <TikTokIcon className="w-3.5 h-3.5" />
                    <span>TikTok</span>
                  </button>
                </div>
              ) : (
                <div />
              )}

              <button
                onClick={() => setZoomModal(null)}
                className="p-2.5 rounded-full bg-zinc-800 text-white hover:bg-[#ff007f] transition-all hover:scale-105 shadow-xl border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
                title="Close"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Body */}
            {modalMediaTab === "tiktok" && zoomModal.tiktokUrl ? (
              <div className="w-full max-w-md h-[520px] max-h-[68vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-zinc-950 flex flex-col items-center justify-center">
                <TikTokPlayer url={zoomModal.tiktokUrl} compact={false} />
              </div>
            ) : (
              <div className="relative flex items-center justify-center max-h-[68vh] w-full">
                <img
                  src={zoomModal.url}
                  alt={zoomModal.title}
                  className="max-h-[68vh] w-auto max-w-full rounded-2xl sm:rounded-3xl object-contain shadow-2xl border border-white/20"
                />
              </div>
            )}

            {/* Title & Quick Action */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-xl text-center sm:text-left">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
                {zoomModal.title}
              </p>

              {zoomModal.tiktokUrl && (
                <a
                  href={zoomModal.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/60 hover:bg-[#ff007f] text-white text-xs font-bold border border-white/20 transition-all shadow-md active:scale-95 min-h-[40px]"
                >
                  <TikTokIcon className="w-3.5 h-3.5" />
                  <span>Open in TikTok App &rarr;</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* English Vote Confirmation Modal (Permanent & Non-refundable) */}
      {confirmVoteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => {
            if (!isSubmittingVote) setConfirmVoteTarget(null);
          }}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#13151f] to-[#0a0b10] border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl text-center space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Icon Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#ff007f]/20 to-rose-500/10 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f] shadow-lg shadow-[#ff007f]/20">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-[#ff007f] animate-pulse" />
            </div>

            {/* Header Text */}
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
                <AlertTriangle className="w-3.5 h-3.5" />
                Permanent Vote Notice
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase">
                Confirm Your Vote?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                You are about to cast your vote for:
              </p>
              <div className="py-2 px-3 sm:py-2.5 sm:px-4 rounded-2xl bg-white/5 border border-white/10 font-black text-[#ff007f] text-base sm:text-lg tracking-wide uppercase">
                @{confirmVoteTarget.name}
              </div>
            </div>

            {/* Strict Notice Box in English */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] sm:text-xs text-amber-200/90 leading-relaxed space-y-1">
                  <p className="font-extrabold text-amber-300 uppercase tracking-wider text-[10px]">
                    Cannot Be Undone / Unvoted
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-zinc-300">
                    <li>
                      This vote is <strong className="text-white">permanent</strong> and cannot be unvoted or changed later.
                    </li>
                    <li>
                      Each Roblox account is strictly limited to <strong className="text-white">2 votes total</strong>.
                    </li>
                    <li>
                      This action will use{" "}
                      <strong className="text-[#00f2fe]">
                        Vote {votedIds.length + 1} of 2
                      </strong>{" "}
                      for your account.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
              <button
                type="button"
                disabled={isSubmittingVote}
                onClick={() => setConfirmVoteTarget(null)}
                className="flex-1 py-3 px-3 sm:px-4 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all border border-white/10 disabled:opacity-50 min-h-[44px] active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingVote}
                onClick={executeConfirmedVote}
                className="flex-1 py-3 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#ff007f]/30 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px] active:scale-95"
              >
                {isSubmittingVote ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Yes, Vote</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* English Quota Exceeded Modal */}
      {isQuotaModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsQuotaModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#13151f] to-[#0a0b10] border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl text-center space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
                Vote Limit Reached
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight uppercase">
                Quota Full (2/2 Votes Used)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                You have already used all <strong className="text-white">2 available votes</strong> for your account.
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 text-left space-y-1.5">
              <p className="font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Votes are permanent:
              </p>
              <p className="text-[11px] text-zinc-400 pl-3.5 leading-relaxed">
                Votes cannot be undone, swapped, or refunded. Thank you for participating in the TREC KL Fashion Runway!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsQuotaModalOpen(false)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#ff007f]/30 min-h-[44px] active:scale-95"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Host Controls Modal */}
      <HostControlModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
        currentStatus={eventStatusData.status}
        startedAt={eventStatusData.startedAt}
        endsAt={eventStatusData.endsAt}
        customEndDate={eventStatusData.customEndDate}
        onStatusUpdated={fetchEventStatus}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06070a] py-8 mt-16 text-center text-xs text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-bold text-zinc-400 uppercase tracking-widest">
            TREC KL Fashion Runway &bull; Roblox Avatar &amp; Outfits Awards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-400">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <span className="text-zinc-600">&bull;</span>
            <a
              href="https://discord.gg/54GEpCZGz"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#5865F2] transition-colors"
            >
              Discord Community
            </a>
            <span className="text-zinc-600">&bull;</span>
            <a
              href="https://sociabuzz.com/treckl/donate"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              Donate (SociaBuzz)
            </a>
            <span className="text-zinc-600">&bull;</span>
            <a href="/privacy" className="hover:text-white transition-colors underline underline-offset-4">
              Privacy Policy
            </a>
            <span className="text-zinc-600">&bull;</span>
            <a href="/terms" className="hover:text-white transition-colors underline underline-offset-4">
              Terms of Service
            </a>
          </div>
          <p className="text-[11px] text-zinc-600">
            Official Game:{" "}
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
