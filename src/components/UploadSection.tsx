"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  User,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { TikTokIcon } from "./TikTokPlayer";
import { isValidTikTokUrl, extractTikTokVideoId } from "@/lib/tiktok";

interface UploadSectionProps {
  onSuccess: () => void;
  connectedUsername?: string;
}

export function UploadSection({ onSuccess, connectedUsername }: UploadSectionProps) {
  const [username, setUsername] = useState(connectedUsername || "");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // TikTok video state
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [tiktokStatus, setTiktokStatus] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [tiktokInfo, setTiktokInfo] = useState<{ videoId?: string | null; message?: string } | null>(null);

  // Roblox user verification state
  const [isCheckingRoblox, setIsCheckingRoblox] = useState(false);
  const [robloxData, setRobloxData] = useState<{
    displayName?: string;
    avatarUrl?: string;
    isInGroup?: boolean;
    roleName?: string;
  } | null>(null);
  const [robloxError, setRobloxError] = useState("");

  // Duplicate submission check state (1 USN = 1 Submit Rule)
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [duplicateSubmission, setDuplicateSubmission] = useState<{
    id: string;
    roblox_username: string;
    caption?: string | null;
  } | null>(null);

  // Upload status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync connected username if user connects account later
  useEffect(() => {
    if (connectedUsername && !username) {
      setUsername(connectedUsername);
    }
  }, [connectedUsername, username]);

  // Debounced TikTok link validator
  useEffect(() => {
    const trimmed = tiktokUrl.trim();
    if (!trimmed) {
      setTiktokStatus("idle");
      setTiktokInfo(null);
      return;
    }

    if (!isValidTikTokUrl(trimmed)) {
      setTiktokStatus("invalid");
      setTiktokInfo({ message: "URL must start with https:// and come from tiktok.com" });
      return;
    }

    // Direct numeric video ID in URL
    const directId = extractTikTokVideoId(trimmed);
    if (directId) {
      setTiktokStatus("valid");
      setTiktokInfo({ videoId: directId, message: "TikTok video detected!" });
      return;
    }

    // Short links: resolve via API
    setTiktokStatus("validating");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tiktok-resolve?url=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (data.valid) {
          setTiktokStatus("valid");
          setTiktokInfo({
            videoId: data.videoId,
            message: data.videoId ? "TikTok video verified!" : "Valid TikTok link!",
          });
        } else {
          setTiktokStatus("invalid");
          setTiktokInfo({ message: data.error || "Could not verify TikTok link" });
        }
      } catch {
        setTiktokStatus("valid");
        setTiktokInfo({ message: "TikTok link saved" });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [tiktokUrl]);

  // Debounced Roblox Avatar lookup & Duplicate Submission Verification
  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 3) {
      setRobloxData(null);
      setRobloxError("");
      setDuplicateSubmission(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingRoblox(true);
      setIsCheckingDuplicate(true);
      setRobloxError("");
      setDuplicateSubmission(null);

      // 1. Strict Check: Has this username already submitted an outfit? (1 USN = 1 Submit)
      if (isSupabaseConfigured) {
        try {
          const { data: existing } = await supabase
            .from("submissions")
            .select("id, roblox_username, caption")
            .ilike("roblox_username", trimmed)
            .limit(1);

          if (existing && existing.length > 0) {
            setDuplicateSubmission(existing[0]);
          }
        } catch (e) {
          console.error("Duplicate check error:", e);
        } finally {
          setIsCheckingDuplicate(false);
        }
      } else {
        setIsCheckingDuplicate(false);
      }

      // 2. Fetch Roblox Avatar and Verify Group Membership
      try {
        const res = await fetch(`/api/roblox-avatar?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (res.ok && data.name) {
          setRobloxData({
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
            isInGroup: Boolean(data.isInGroup),
            roleName: data.roleName || "",
          });
        } else {
          setRobloxData(null);
          setRobloxError("Roblox account not found. Please verify your username.");
        }
      } catch {
        setRobloxData(null);
      } finally {
        setIsCheckingRoblox(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("File must be an image (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Image size must be less than 8MB.");
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Please enter your Roblox username.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Please upload a photo of your avatar outfit.");
      return;
    }

    if (!tiktokUrl.trim()) {
      setErrorMessage("Please enter your avatar outfit TikTok video URL (Required).");
      return;
    }

    if (!isValidTikTokUrl(tiktokUrl.trim())) {
      setErrorMessage("Invalid TikTok URL. Please enter a valid TikTok link (e.g., https://www.tiktok.com/@username/video/... or https://vt.tiktok.com/...).");
      return;
    }

    if (robloxData && !robloxData.isInGroup) {
      setErrorMessage("You must join our official Roblox group 'FEMME'S STUDIO' to submit your avatar.");
      return;
    }

    if (duplicateSubmission) {
      setErrorMessage(
        `Roblox account @${duplicateSubmission.roblox_username} is already registered on the runway! Rule: Only 1 outfit submission per Roblox account.`
      );
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        "Supabase is not configured in .env.local yet. Please configure it to save uploads."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("username", username.trim());
      formData.append("caption", caption.trim());
      if (tiktokUrl.trim()) {
        formData.append("tiktokUrl", tiktokUrl.trim());
      }
      if (robloxData?.avatarUrl) {
        formData.append("avatarUrl", robloxData.avatarUrl);
      }
      formData.append("file", selectedFile);

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to submit outfit. Please try again.");
      }

      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ff007f", "#00f2fe", "#ffbe0b"],
      });

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#0c0e14]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative neon ambient blur */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#ff007f]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff007f]/15 text-[#ff007f] text-xs font-black uppercase tracking-widest border border-[#ff007f]/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          TREC KL Runway Entry
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase italic">
          Submit Runway Outfit
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Showcase your best avatar style at the TREC KL Fashion Show to be crowned Best Dressed!
        </p>
      </div>

      {success ? (
        <div className="py-12 text-center space-y-4 relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wide">
            Outfit Successfully Registered!
          </h3>
          <p className="text-sm text-zinc-400">
            Your avatar is now live on the runway. Redirecting to gallery...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Input Username */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
                Roblox Model Username <span className="text-[#ff007f]">*</span>
              </label>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                Limit: 1 Outfit / USN
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. YourRobloxName"
                className={`w-full px-4 py-3 bg-zinc-950/80 border rounded-2xl text-white placeholder-zinc-600 focus:outline-none transition-all font-medium text-sm ${
                  duplicateSubmission
                    ? "border-rose-500/60 focus:border-rose-500"
                    : "border-white/10 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                }`}
                required
              />
              {(isCheckingRoblox || isCheckingDuplicate) && (
                <div className="absolute right-4 top-3.5">
                  <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
                </div>
              )}
            </div>

            {/* Live Roblox Profile Preview with Group Verification */}
            {robloxData && (
              <div className="space-y-2">
                <div className="flex items-center gap-3.5 p-3.5 bg-zinc-950/90 border border-white/10 rounded-2xl shadow-inner">
                  {robloxData.avatarUrl ? (
                    <img
                      src={robloxData.avatarUrl}
                      alt={username}
                      className="w-12 h-12 rounded-xl border border-white/20 bg-zinc-900 object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-zinc-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white truncate">
                        {robloxData.displayName || username}
                      </span>
                      {robloxData.isInGroup ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                          Group Member
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                          Not in Group
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">@{username}</p>
                  </div>
                </div>

                {!robloxData.isInGroup && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold text-[11px]">
                      Must join <b>FEMME'S STUDIO</b> to submit
                    </span>
                    <a
                      href="https://www.roblox.com/groups/740188661"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#ff007f] to-rose-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md hover:brightness-110"
                    >
                      Join Group &rarr;
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Duplicate Submission Warning Alert (1 USN = 1 Submit Rule) */}
            {duplicateSubmission && (
              <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-xs shadow-lg animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-rose-300 uppercase tracking-wider text-[11px]">
                      Username Already Registered!
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md font-black uppercase">
                      1 USN = 1 Entry
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Roblox account <strong className="text-white">@{duplicateSubmission.roblox_username}</strong> already has an outfit registered on the runway. Each Roblox account is only allowed to submit <strong>1 outfit look</strong>.
                  </p>
                </div>
              </div>
            )}

            {robloxError && (
              <p className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" /> {robloxError}
              </p>
            )}
          </div>

          {/* Upload Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              Avatar Outfit Photo / Screenshot <span className="text-[#ff007f]">*</span>
            </label>

            {previewUrl ? (
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 group shadow-2xl">
                <img
                  src={previewUrl}
                  alt="Preview Outfit"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                  title="Change Photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-[#ff007f]/60 bg-zinc-950/40 hover:bg-zinc-950/80 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-300 flex items-center justify-center mx-auto mb-3 group-hover:border-[#ff007f] group-hover:scale-110 transition-all">
                  <UploadCloud className="w-6 h-6 text-[#ff007f]" />
                </div>
                <p className="text-sm font-bold text-zinc-200">
                  Click to browse or drag &amp; drop screenshot here
                </p>
                <p className="text-xs text-zinc-500 mt-1 font-mono">
                  PNG, JPG, WEBP up to 8MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* TikTok Video URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <TikTokIcon className="w-3.5 h-3.5 text-[#ff007f]" />
                <span>Link Video TikTok Outfit</span>
                <span className="text-[#ff007f]">*</span>
              </label>
              {tiktokStatus === "valid" && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Siap di Runway</span>
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@roblox_treckl/video/... or https://vt.tiktok.com/..."
                required
                className={`w-full px-4 py-3 bg-zinc-950/80 border rounded-2xl text-white placeholder-zinc-600 focus:outline-none transition-all font-medium text-sm ${
                  tiktokStatus === "valid"
                    ? "border-emerald-500/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                    : tiktokStatus === "invalid"
                    ? "border-rose-500/50 focus:border-rose-400"
                    : "border-white/10 focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe]"
                }`}
              />
              {tiktokStatus === "validating" && (
                <div className="absolute right-4 top-3.5">
                  <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-zinc-500">
              <p className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#ff007f] shrink-0" />
                <span>Video catwalk / showcase TikTok akan langsung diputar di runway show!</span>
              </p>
              {tiktokInfo?.message && (
                <span
                  className={
                    tiktokStatus === "invalid"
                      ? "text-rose-400 font-medium"
                      : "text-emerald-400 font-medium"
                  }
                >
                  {tiktokInfo.message}
                </span>
              )}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              Outfit Title / Style Concept <span className="text-zinc-600 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Midnight Cyberpunk Gothic Runway Set"
              maxLength={100}
              className="w-full px-4 py-3 bg-zinc-950/80 border border-white/10 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all font-medium text-sm"
            />
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || Boolean(duplicateSubmission) || Boolean(robloxData && !robloxData.isInGroup)}
            className={`w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] ${
              duplicateSubmission
                ? "bg-zinc-800 text-zinc-400 border border-white/10 cursor-not-allowed"
                : "bg-gradient-to-r from-[#ff007f] via-rose-600 to-[#00f2fe] text-white hover:brightness-110 shadow-2xl shadow-[#ff007f]/30 disabled:opacity-50"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering Outfit to Runway...</span>
              </>
            ) : duplicateSubmission ? (
              <>
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>Username Already Registered (1 Outfit Limit)</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                <span>Submit Outfit to Runway</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
