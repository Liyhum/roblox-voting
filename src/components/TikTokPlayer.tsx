"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, Loader2, Play, AlertCircle } from "lucide-react";
import { extractTikTokVideoId, isValidTikTokUrl, getTikTokEmbedUrl } from "@/lib/tiktok";

export function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.58a8.27 8.27 0 0 0 4.84 1.55V6.69h-.94z" />
    </svg>
  );
}

interface TikTokPlayerProps {
  url: string;
  className?: string;
  compact?: boolean;
}

export function TikTokPlayer({ url, className = "", compact = false }: TikTokPlayerProps) {
  const [videoId, setVideoId] = useState<string | null>(() => extractTikTokVideoId(url));
  const [canonicalUrl, setCanonicalUrl] = useState<string>(url);
  const [isLoading, setIsLoading] = useState<boolean>(!videoId);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // If we don't have videoId yet (e.g. vt.tiktok.com short links), resolve it via API
  useEffect(() => {
    const directId = extractTikTokVideoId(url);
    if (directId) {
      setVideoId(directId);
      setCanonicalUrl(url);
      setIsLoading(false);
      return;
    }

    if (!isValidTikTokUrl(url)) {
      setError("Format URL TikTok tidak valid");
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch(`/api/tiktok-resolve?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.videoId) {
          setVideoId(data.videoId);
          if (data.canonicalUrl) setCanonicalUrl(data.canonicalUrl);
        } else {
          setError("Tidak dapat memuat video TikTok");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Gagal memproses link TikTok");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <div
      className={`relative w-full h-full bg-zinc-950 flex flex-col items-center justify-center overflow-hidden rounded-2xl ${className}`}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950/90 z-10 p-4">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-[#00f2fe] animate-pulse">
            <TikTokIcon className="w-5 h-5 text-[#ff007f]" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00f2fe]" />
            <span>Memuat Video TikTok...</span>
          </div>
        </div>
      )}

      {/* Embed Iframe when videoId is available */}
      {videoId ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {!isIframeLoaded && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-0">
              <Loader2 className="w-6 h-6 animate-spin text-[#ff007f]" />
            </div>
          )}
          <iframe
            src={getTikTokEmbedUrl(videoId)}
            className="w-full h-full border-0 relative z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsIframeLoaded(true)}
            title="TikTok Outfit Runway Video"
          />
        </div>
      ) : error ? (
        /* Fallback if video ID cannot be loaded into iframe */
        <div className="p-6 text-center space-y-3 z-10 max-w-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Video TikTok Tersedia
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">
              {error}. Kamu bisa tonton langsung melalui aplikasi atau web TikTok:
            </p>
          </div>
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff007f] to-rose-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff007f]/20 transition-all"
          >
            <TikTokIcon className="w-3.5 h-3.5" />
            <span>Buka di TikTok &rarr;</span>
          </a>
        </div>
      ) : null}

      {/* Bottom overlay link to open in TikTok */}
      {!compact && (
        <div className="absolute top-3 right-3 z-20">
          <a
            href={canonicalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-105 group"
            title="Tonton di TikTok"
          >
            <TikTokIcon className="w-3.5 h-3.5 text-[#ff007f] group-hover:text-[#00f2fe] transition-colors" />
            <span>TikTok</span>
            <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-white" />
          </a>
        </div>
      )}
    </div>
  );
}
