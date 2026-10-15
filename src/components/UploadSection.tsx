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
  Car,
  Shirt,
  Users,
  Music,
} from "lucide-react";
import confetti from "canvas-confetti";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface UploadSectionProps {
  onSuccess: () => void;
}

const CATEGORIES = [
  { id: "outfit", label: "Streetwear Drip", icon: Shirt },
  { id: "car", label: "Car Meet / Ride", icon: Car },
  { id: "hangout", label: "Club / Hangout", icon: Users },
  { id: "party", label: "Nightlife Party", icon: Music },
];

export function UploadSection({ onSuccess }: UploadSectionProps) {
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("outfit");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Roblox user verification state
  const [isCheckingRoblox, setIsCheckingRoblox] = useState(false);
  const [robloxData, setRobloxData] = useState<{
    displayName?: string;
    avatarUrl?: string;
  } | null>(null);
  const [robloxError, setRobloxError] = useState("");

  // Upload status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounced Roblox Avatar lookup
  useEffect(() => {
    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 3) {
      setRobloxData(null);
      setRobloxError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingRoblox(true);
      setRobloxError("");
      try {
        const res = await fetch(`/api/roblox-avatar?username=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        if (res.ok && data.name) {
          setRobloxData({
            displayName: data.displayName,
            avatarUrl: data.avatarUrl,
          });
        } else {
          setRobloxData(null);
          setRobloxError("Akun Roblox tidak ditemukan. Cek kembali username kamu.");
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
      setErrorMessage("File harus berupa gambar (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal 8 MB.");
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
      setErrorMessage("Wajib mengisi Username Roblox.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Wajib mengunggah foto / screenshot karya.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        "Supabase belum terhubung di .env.local. Silakan isi konfigurasi Supabase terlebih dahulu."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const fileExt = selectedFile.name.split(".").pop() || "png";
      const fileName = `${Date.now()}_${username.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}.${fileExt}`;

      // Upload ke Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("roblox_images")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      // Ambil Public URL
      const { data: publicUrlData } = supabase.storage
        .from("roblox_images")
        .getPublicUrl(uploadData.path);

      const imageUrl = publicUrlData.publicUrl;

      // Format caption dengan kategori
      const selectedCatObj = CATEGORIES.find((c) => c.id === category);
      const categoryTag = selectedCatObj ? `[${selectedCatObj.label}] ` : "";
      const finalCaption = caption.trim() ? `${categoryTag}${caption.trim()}` : categoryTag.trim();

      // Insert ke database
      const { error: dbError } = await supabase.from("submissions").insert([
        {
          roblox_username: username.trim(),
          roblox_avatar_url: robloxData?.avatarUrl || null,
          caption: finalCaption || null,
          image_url: imageUrl,
          votes: 0,
        },
      ]);

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
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
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
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
          TREC KL Community Entry
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase italic">
          Kirim Foto & Drip Kamu
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
          Tunjukkan outfit terbaik, mobil impian, atau momen hangout kamu di TREC KL untuk divote oleh seluruh pemain!
        </p>
      </div>

      {success ? (
        <div className="py-12 text-center space-y-4 relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-wide">
            Karya Berhasil Terdaftar!
          </h3>
          <p className="text-sm text-zinc-400">
            Foto kamu sudah tampil di galeri voting. Mengalihkan ke galeri...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Input Username */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              Username Roblox <span className="text-[#ff007f]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: YourRobloxName"
                className="w-full px-4 py-3 bg-zinc-950/80 border border-white/10 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all font-medium text-sm"
                required
              />
              {isCheckingRoblox && (
                <div className="absolute right-4 top-3.5">
                  <Loader2 className="w-5 h-5 text-[#00f2fe] animate-spin" />
                </div>
              )}
            </div>

            {/* Live Roblox Profile Preview */}
            {robloxData && (
              <div className="flex items-center gap-3.5 p-3.5 bg-zinc-950/90 border border-white/10 rounded-2xl shadow-inner">
                {robloxData.avatarUrl ? (
                  <img
                    src={robloxData.avatarUrl}
                    alt={username}
                    className="w-12 h-12 rounded-xl border border-[#00f2fe]/40 bg-zinc-900 object-cover shadow-md shadow-[#00f2fe]/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center">
                    <User className="w-6 h-6 text-zinc-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white truncate">
                      {robloxData.displayName || username}
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">@{username}</p>
                </div>
              </div>
            )}

            {robloxError && (
              <p className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" /> {robloxError}
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              Kategori Foto
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      active
                        ? "bg-[#ff007f]/20 text-white border-[#ff007f] shadow-lg shadow-[#ff007f]/20"
                        : "bg-zinc-950/60 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${active ? "text-[#ff007f]" : "text-zinc-500"}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              Upload Screenshot / Foto <span className="text-[#ff007f]">*</span>
            </label>

            {previewUrl ? (
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/20 bg-zinc-950 group shadow-2xl">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105"
                  title="Ganti Foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/15 hover:border-[#00f2fe]/60 bg-zinc-950/40 hover:bg-zinc-950/80 rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-300 flex items-center justify-center mx-auto mb-3 group-hover:border-[#00f2fe] group-hover:scale-110 transition-all">
                  <UploadCloud className="w-6 h-6 text-[#00f2fe]" />
                </div>
                <p className="text-sm font-bold text-zinc-200">
                  Pilih file screenshot dari game TREC KL
                </p>
                <p className="text-xs text-zinc-500 mt-1 font-mono">
                  PNG, JPG, WEBP hingga 8MB
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

          {/* Caption */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300">
              Judul / Caption Singkat <span className="text-zinc-600 font-normal lowercase">(opsional)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Contoh: Malam minggu di TREC KL bareng squad!"
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
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase text-white bg-gradient-to-r from-[#ff007f] via-rose-600 to-[#00f2fe] hover:brightness-110 shadow-2xl shadow-[#ff007f]/30 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengunggah Karya ke TREC KL...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                <span>Kirim Partisipasi Sekarang</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
