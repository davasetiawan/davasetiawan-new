"use client";

import { useState } from "react";
import { KeyRound, X } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "../../lib/store";

export default function AdminAuth({ onSuccess, onClose }) {
  const data = useData();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (password === data.settings.password) {
      sessionStorage.setItem("dava-admin-auth", "1");
      onSuccess();
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 2500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.92, y: 14 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="tcard w-full max-w-sm"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest">
            <KeyRound size={15} className="text-[var(--accent)]" />
            ADMIN AUTHENTICATION
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--accent)]"
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <p className="text-xs text-[var(--muted)]">
            dava@davasetiawan:~$ sudo su
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[var(--muted)]">&gt; password:</span>
            <input
              autoFocus
              type="password"
              className="tinput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="text-xs" style={{ color: "var(--danger)" }}>
              ✖ ACCESS DENIED — password salah.
            </p>
          ) : null}

          <div className="mt-1 flex items-center gap-2">
            <button type="submit" className="tbtn tbtn-primary">
              Masuk
            </button>
            <button type="button" className="tbtn" onClick={onClose}>
              Batal
            </button>
          </div>

          <p className="mt-2 text-[10px] text-[var(--muted)]">
            Default: <code>admin123</code> — ganti di tab Settings setelah login.
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
}
