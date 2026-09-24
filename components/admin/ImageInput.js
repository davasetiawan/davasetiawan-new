"use client";

import { useId, useRef, useState } from "react";
import { Eye, ImagePlus, Link2, Loader2, Trash2 } from "lucide-react";

// Upload ke Supabase Storage bucket "images" (file mentah 100% tanpa dipotong)
async function uploadToStorage(file) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const formData = new FormData();
  formData.append("file", file, filename);

  const res = await fetch(`/api/upload?path=${encodeURIComponent(filename)}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload gagal" }));
    throw new Error(err.error || "Upload gagal");
  }

  const { url } = await res.json();
  return url;
}

function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (e) {
          resolve(String(reader.result));
        }
      };
      img.onerror = () => resolve(String(reader.result));
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageInput({ value, onChange }) {
  const id = useId();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("File harus berupa gambar.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const url = await uploadToStorage(file);
      onChange(url);
    } catch (err) {
      // Fallback: simpan sebagai base64 jika upload storage gagal
      console.warn("Storage upload failed, fallback to base64:", err.message);
      try {
        const compressed = await compressImage(file, 1400, 0.80);
        onChange(compressed);
        setError("⚠ Tersimpan lokal (storage tidak tersedia)");
      } catch {
        setError("Upload gagal.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-contain p-1" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--muted-foreground)]">
              belum ada gambar
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            type="text"
            className="tinput"
            placeholder="https://... (URL gambar)"
            value={typeof value === "string" && value.startsWith("data:") ? "" : value || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="tbtn"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <><Loader2 size={13} className="animate-spin" /> Mengupload...</>
              ) : (
                <><ImagePlus size={13} /> Upload Foto</>
              )}
            </button>
            {value && !uploading ? (
              <>
                <a href={value} target="_blank" rel="noreferrer" className="tbtn">
                  <Eye size={13} /> Lihat
                </a>
                <button
                  type="button"
                  className="tbtn tbtn-danger"
                  onClick={() => { onChange(""); setError(""); }}
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </>
            ) : null}
          </div>
          {error && (
            <p className="text-[10px] text-amber-400">{error}</p>
          )}
          <p className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)]">
            <Link2 size={11} />
            Upload foto (tersimpan di cloud) atau tempel URL langsung.
          </p>
        </div>
      </div>

      <input
        ref={fileRef}
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
