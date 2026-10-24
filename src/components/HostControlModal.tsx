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
  Calendar,
} from "lucide-react";
import { EventStatusType } from "@/lib/event-status";

interface HostControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: EventStatusType;
  startedAt: number | null;
  endsAt: number | null;
  customEndDate?: string | null;
  onStatusUpdated: () => void;
}

export function HostControlModal({
  isOpen,
  onClose,
  currentStatus,
  startedAt,
  endsAt,
  customEndDate,
  onStatusUpdated,
}: HostControlModalProps) {
  const [pin, setPin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("trec_host_pin") || "";
    }
    return "";
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(0); // 0 = no time limit
  const [customEndDateInput, setCustomEndDateInput] = useState<string>(() => {
    if (customEndDate) {
      try {
        return new Date(customEndDate).toISOString().slice(0, 16);
      } catch {
        return "";
      }
    }
    return "";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = async (action: "start" | "pause" | "reset" | "end" | "set_end_date") => {
    if (!pin.trim()) {
      setErrorMsg("Please enter the Host PIN to proceed.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let formattedEndDate: string | undefined = undefined;
    if (action === "set_end_date") {
      if (!customEndDateInput) {
        setErrorMsg("Please select a valid closing date and time.");
        setIsSubmitting(false);
        return;
      }
      formattedEndDate = new Date(customEndDateInput).toISOString();
    }

    try {
      const res = await fetch("/api/event-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          durationSeconds: action === "start" ? selectedDuration : undefined,
          customEndDate: formattedEndDate,
          pin: pin.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to execute host command.");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("trec_host_pin", pin.trim());
      }

      setSuccessMsg(data.message || "Action executed successfully!");
      onStatusUpdated();
    } catch {
      setErrorMsg("Network error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-[#0c0e14] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#00f2fe]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#ff007f]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00f2fe] to-[#ff007f] flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-base tracking-wider uppercase">
                Host Event Control
              </h3>
              <p className="text-[11px] text-zinc-400">
                Live voting session organizer panel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                currentStatus === "active"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : currentStatus === "ended"
                  ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                  : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
              }`}
            />
            <span className="text-xs font-bold text-zinc-300">
              Current Live Status:
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
              currentStatus === "active"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : currentStatus === "ended"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : "bg-amber-500/20 text-amber-300 border-amber-500/40"
            }`}
          >
            {currentStatus === "active"
              ? "🟢 Voting Live (Open)"
              : currentStatus === "ended"
              ? "🔴 Voting Ended (Closed)"
              : "🟡 Not Started (Locked)"}
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

        {/* Set Custom Closing Date & Time (Host Controlled) */}
        <div className="space-y-2 mb-4 p-3.5 rounded-2xl bg-zinc-950 border border-white/10">
          <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00f2fe]" /> Atur Tanggal & Jam Tutup Voting
            </span>
            <span className="text-[10px] text-[#00f2fe]">Auto-Sync Countdown</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="datetime-local"
              value={customEndDateInput}
              onChange={(e) => {
                setCustomEndDateInput(e.target.value);
                setErrorMsg(null);
              }}
              className="flex-1 px-3 py-2 bg-zinc-900 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#00f2fe]"
            />
            <button
              type="button"
              onClick={() => handleAction("set_end_date")}
              disabled={isSubmitting || !customEndDateInput}
              className="px-4 py-2 bg-gradient-to-r from-[#00f2fe] to-[#ff007f] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 min-h-[38px] shrink-0"
            >
              Simpan Tanggal
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1">
            Mengatur batas penutupan global langsung dari browser tanpa perlu edit file .env.
          </p>
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
            <span>End Voting (Close)</span>
          </button>

          {/* Reset Session */}
          <button
            onClick={() => handleAction("reset")}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-zinc-900 border border-white/15 text-zinc-300 font-black text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[46px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
