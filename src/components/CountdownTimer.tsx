"use client";

import React, { useState, useEffect } from "react";
import { Clock, Flame, AlertCircle, Trophy, Sparkles } from "lucide-react";

interface CountdownTimerProps {
  targetDate?: string;
  onExpire?: (isExpired: boolean) => void;
  compact?: boolean;
}

export function CountdownTimer({ targetDate, onExpire, compact = false }: CountdownTimerProps) {
  // Read target date from prop or environment variable, fallback to default future date
  const finalTargetDateString =
    targetDate ||
    process.env.NEXT_PUBLIC_VOTING_END_DATE ||
    "2026-10-25T23:59:59+08:00";

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const targetTime = new Date(finalTargetDateString).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (isNaN(targetTime) || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [finalTargetDateString, onExpire]);

  if (!mounted) {
    return (
      <div className="h-20 w-full rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  // If time is up
  if (timeLeft.isExpired) {
    return (
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-500/30 p-4 sm:p-5 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest mb-0.5">
                Event Ended
              </div>
              <h4 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Voting Has Officially Closed!
              </h4>
            </div>
          </div>
          <div className="text-xs text-zinc-300 font-medium max-w-sm">
            All runway votes have been recorded. Check the Leaderboard to see the Best Dressed winners!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0c0e14]/90 via-[#121520]/95 to-[#0c0e14]/90 border border-white/15 p-4 sm:p-5 backdrop-blur-2xl shadow-2xl">
      {/* Ambient glowing highlights */}
      <div className="absolute top-0 left-1/4 w-32 h-16 bg-[#ff007f]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-32 h-16 bg-[#00f2fe]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title and Live Status */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-10 h-10 rounded-2xl bg-[#ff007f]/20 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f] shadow-lg shadow-[#ff007f]/20">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Countdown
              </span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold hidden sm:inline">
                TREC KL Runway
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-wide mt-0.5">
              Voting Closes In
            </h4>
          </div>
        </div>

        {/* Countdown Digits Grid */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-zinc-950/90 border border-white/15 flex items-center justify-center shadow-inner group">
              <span className="text-lg sm:text-2xl font-black font-mono text-white tracking-tight">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mt-1">
              Days
            </span>
          </div>

          <span className="text-zinc-600 font-bold text-lg sm:text-xl -mt-4">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-zinc-950/90 border border-white/15 flex items-center justify-center shadow-inner">
              <span className="text-lg sm:text-2xl font-black font-mono text-white tracking-tight">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mt-1">
              Hours
            </span>
          </div>

          <span className="text-zinc-600 font-bold text-lg sm:text-xl -mt-4">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-zinc-950/90 border border-white/15 flex items-center justify-center shadow-inner">
              <span className="text-lg sm:text-2xl font-black font-mono text-[#00f2fe] tracking-tight">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mt-1">
              Mins
            </span>
          </div>

          <span className="text-zinc-600 font-bold text-lg sm:text-xl -mt-4">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-16 h-13 sm:h-16 rounded-2xl bg-zinc-950/90 border border-[#ff007f]/40 flex items-center justify-center shadow-lg shadow-[#ff007f]/10">
              <span className="text-lg sm:text-2xl font-black font-mono text-[#ff007f] tracking-tight animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-[#ff007f] mt-1">
              Secs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
