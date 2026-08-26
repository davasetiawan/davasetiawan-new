"use client";

import { useId, useRef } from "react";
import { Eye, ImagePlus, Link2, Trash2 } from "lucide-react";

const MAX_BYTES = 1_500_000;

export default function ImageInput({ value, onChange }) {
  const id = useId();
  const fileRef = useRef(null);

  const pick = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("File harus berupa gambar.");
      return;
    }
    if (file.size > MAX_BYTES) {
      window.alert(
        "Ukuran gambar maksimal 1.5 MB. Kompres dulu atau gunakan URL gambar."
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="h-24 w-40 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="h-full w-full object-cover" />
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
            >
              <ImagePlus size={13} /> Upload Foto
            </button>
            {value ? (
              <>
                <a type="button" href={value} target="_blank" rel="noreferrer" className="tbtn">
                  <Eye size={13} /> Lihat
                </a>
                <button
                  type="button"
                  className="tbtn tbtn-danger"
                  onClick={() => onChange("")}
                >
                  <Trash2 size={13} /> Hapus
                </button>
              </>
            ) : null}
          </div>
          <p className="flex items-center gap-1.5 text-[10px] text-[var(--muted-foreground)]">
            <Link2 size={11} />
            Upload dari perangkat (maks 1.5 MB, tersimpan sebagai data URL) atau tempel URL.
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
