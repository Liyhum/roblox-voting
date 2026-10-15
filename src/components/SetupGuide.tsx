"use client";

import React from "react";
import { AlertCircle, Key, Database, ExternalLink } from "lucide-react";

export function SetupGuide() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 mb-8 text-amber-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-amber-300">
            Koneksi Supabase Belum Terhubung
          </h3>
          <p className="text-sm text-zinc-300">
            Web ini saat ini berjalan dalam mode pratinjau (dummy). Untuk mengaktifkan upload gambar dan penyimpanan vote secara permanen, ikuti langkah berikut:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
            <li>
              Buka project Supabase kamu di{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline inline-flex items-center gap-1 hover:text-amber-300"
              >
                supabase.com <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
            <li>
              Masuk ke <b>SQL Editor</b> $\rightarrow$ Paste isi file{" "}
              <code className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">
                supabase_schema.sql
              </code>{" "}
              lalu klik <b>Run</b>.
            </li>
            <li>
              Masuk ke <b>Project Settings</b> $\rightarrow$ <b>API</b> $\rightarrow$ Copy{" "}
              <b>Project URL</b> dan <b>anon public key</b>.
            </li>
            <li>
              Buka file{" "}
              <code className="bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">
                .env.local
              </code>{" "}
              di folder project ini dengan Notepad, lalu paste kedua data tersebut.
            </li>
            <li>Restart server (atau refresh halaman ini).</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
