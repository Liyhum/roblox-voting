"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Play,
  Pause,
  Square,
  RotateCcw,
  KeyRound,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from "lucide-react";
import { EventStatusType } from "@/lib/event-status";

interface HostControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: EventStatusType;
  startedAt: number | null;
  endsAt: number | null;
  onStatusUpdated: () => void;
}

export function HostControlModal({
  isOpen,
  onClose,
  currentStatus,
  startedAt,
  endsAt,
  onStatusUpdated,
}: HostControlModalProps) {
  const [pin, setPin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trec_host_pin") || "";
    }
    return "";
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(0); // 0 = no time limit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async (action: "start" | "pause" | "reset" | "end") => {
    if (!pin.trim()) {
      setErrorMsg("Please enter the Host PIN to proceed.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/event-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          durationSeconds: action === "start" ? selectedDuration : undefined,
          pin: pin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setErrorMsg(data.message || "Failed to update event status.");
        return;
      }

      // Save pin locally for organizer convenience
      localStorage.setItem("trec_host_pin", pin.trim());
      setSuccessMsg(`Status updated: ${data.status.toUpperCase()}!`);
      onStatusUpdated();
    } catch {
      setErrorMsg("Network error communicating with the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0c0e14] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#ff007f]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-zinc-950 flex items-center justify-center shadow-lg font-black text-sm">
              👑
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Event Host Controls</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Control when voting starts, pauses, or ends for all participants
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="my-5 p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                currentStatus === "active"
                  ? "bg-emerald-400 animate-ping"
                  : currentStatus === "ended"
                  ? "bg-rose-500"
                  : "bg-amber-400"
              }`}
            />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Current Voting Status
              </div>
              <div className="text-sm font-extrabold text-white uppercase tracking-wider mt-0.5">
                {currentStatus === "not_started" && "🔒 Voting Locked (Not Started)"}
                {currentStatus === "active" && "🟢 Live Voting in Progress"}
                {currentStatus === "ended" && "🏁 Voting Concluded"}
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
              currentStatus === "active"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : currentStatus === "ended"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            {currentStatus}
          </span>
        </div>

        {/* PIN Authorization */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#00f2fe]" /> Host Secret PIN
            </span>
            <span className="text-[10px] text-zinc-500 italic">Confidential</span>
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="Enter Host PIN..."
            className="w-full px-4 py-2.5 bg-zinc-950 border border-white/15 rounded-xl text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] transition-all font-mono"
          />
        </div>

        {/* Timer Duration Selection (only applicable when starting) */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ff007f]" /> Voting Round Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "No Limit", secs: 0 },
              { label: "3 Mins", secs: 180 },
              { label: "5 Mins", secs: 300 },
              { label: "10 Mins", secs: 600 },
            ].map((opt) => (
              <button
                key={opt.secs}
                type="button"
                onClick={() => setSelectedDuration(opt.secs)}
                className={`py-2 px-1 rounded-xl text-xs font-extrabold uppercase transition-all border ${
                  selectedDuration === opt.secs
                    ? "bg-[#ff007f] text-white border-[#ff007f] shadow-md shadow-[#ff007f]/30"
                    : "bg-zinc-950 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Start Voting */}
          <button
            onClick={() => handleAction("start")}
            disabled={isSubmitting || currentStatus === "active"}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[46px]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Voting Now</span>
          </button>

          {/* Pause Voting */}
          <button
            onClick={() => handleAction("pause")}
            disabled={isSubmitting || currentStatus === "not_started"}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-900 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[46px]"
          >
            <Pause className="w-4 h-4" />
            <span>Pause Voting</span>
          </button>

          {/* End Voting */}
          <button
            onClick={() => handleAction("end")}
            disabled={isSubmitting || currentStatus === "ended"}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-900 border border-rose-500/40 text-rose-300 font-black text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[46px]"
          >
            <Square className="w-4 h-4" />
            <span>End Voting</span>
          </button>

          {/* Reset Status */}
          <button
            onClick={() => handleAction("reset")}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-950 border border-white/10 text-zinc-400 font-black text-xs uppercase tracking-wider hover:text-white hover:border-white/20 active:scale-95 disabled:opacity-40 transition-all min-h-[46px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Not Started</span>
          </button>
        </div>
      </div>
    </div>
  );
}
