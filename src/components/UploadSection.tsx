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

interface UploadSectionProps {
  onSuccess: () => void;
}

export function UploadSection({ onSuccess }: UploadSectionProps) {
  const [username, setUsername] = useState("");
  const [caption, setCaption] = useState("");
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
          setRobloxError("Akun Roblox tidak ditemukan. Pastikan username benar.");
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
      setErrorMessage("File yang diunggah harus berupa gambar (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal 5 MB.");
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
      setErrorMessage("Mohon isi username Roblox kamu.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Mohon pilih atau unggah gambar yang ingin dilombakan.");
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        "Supabase belum terhubung di file .env.local. Silakan isi konfigurasi Supabase terlebih dahulu agar upload tersimpan permanen."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload foto ke Supabase Storage
      const fileExt = selectedFile.name.split(".").pop() || "png";
      const fileName = `${Date.now()}_${username.trim().toLowerCase().replace(/[^a-z0-9]/g, "_")}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("roblox_images")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(
          `Gagal upload gambar: ${uploadError.message}. Pastikan bucket 'roblox_images' sudah dibuat di Supabase.`
        );
      }

      // 2. Ambil public URL foto
      const { data: publicUrlData } = supabase.storage
        .from("roblox_images")
        .getPublicUrl(uploadData.path);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Simpan data submission ke tabel database
      const { error: dbError } = await supabase.from("submissions").insert([
        {
          roblox_username: username.trim(),
          roblox_avatar_url: robloxData?.avatarUrl || null,
          caption: caption.trim() || null,
          image_url: imageUrl,
          votes: 0,
        },
      ]);

      if (dbError) {
        throw new Error(`Gagal menyimpan ke database: ${dbError.message}`);
      }

      // Sukses!
      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
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
    <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Kirim Partisipasi
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Unggah Karya / Screenshot Avatar
        </h2>
        <p className="text-sm text-zinc-400 mt-2">
          Masukkan Username Roblox dan foto terbaikmu agar player lain bisa memberikan vote!
        </p>
      </div>

      {success ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Berhasil Dikirim!</h3>
          <p className="text-sm text-zinc-400">
            Karyamu sudah masuk ke galeri voting. Mengalihkan ke galeri...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Username Roblox */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-200">
              Username Roblox <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: Builderman"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
                required
              />
              {isCheckingRoblox && (
                <div className="absolute right-3.5 top-3.5">
                  <Loader2 className="w-5 h-5 text-rose-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Preview Akun Roblox Otomatis */}
            {robloxData && (
              <div className="flex items-center gap-3 p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl">
                {robloxData.avatarUrl ? (
                  <img
                    src={robloxData.avatarUrl}
                    alt={username}
                    className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-zinc-200">
                      {robloxData.displayName || username}
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                      Terverifikasi
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">@{username}</span>
                </div>
              </div>
            )}

            {robloxError && (
              <p className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {robloxError}
              </p>
            )}
          </div>

          {/* Upload File Foto */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-200">
              Foto / Screenshot Karya <span className="text-rose-500">*</span>
            </label>

            {previewUrl ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-950 group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-colors"
                  title="Ganti Gambar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-rose-500/50 bg-zinc-950/50 hover:bg-zinc-950/90 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-300 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6 text-rose-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-200">
                  Klik untuk pilih file atau seret foto ke sini
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Format didukung: PNG, JPG, WEBP (Maksimal 5MB)
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

          {/* Caption / Deskripsi Singkat */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-200">
              Keterangan / Judul Avatar <span className="text-zinc-500 text-xs font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Contoh: Outfit Neon Cyberpunk 2026"
              maxLength={100}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Pesan Error */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-600/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Mengunggah Karya & Foto...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                <span>Kirim Karya Sekarang</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
