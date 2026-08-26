"use client";

import { useEffect, useRef, useState } from "react";
import {
  BadgeCheck,
  Download,
  FolderGit2,
  History,
  Inbox,
  KeyRound,
  LogOut,
  Megaphone,
  Plus,
  RotateCcw,
  Save,
  Settings as SettingsIcon,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { useData, store } from "../../lib/store";
import SEED from "../../lib/seed";
import ImageInput from "./ImageInput";

const PANEL_TABS = [
  { id: "bio", label: "Bio & Hero", icon: UserRound },
  { id: "skills", label: "Skills & Marquee", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "experience", label: "Experience", icon: History },
  { id: "certificates", label: "Certificates", icon: BadgeCheck },
  { id: "inbox", label: "Inbox", icon: Inbox },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </span>
      {children}
    </label>
  );
}

function CollectionEditor({ collectionKey, singular, fields, defaultItem, metaOf }) {
  const data = useData();
  const items = data[collectionKey] || [];
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editId === null) return;
    if (editId === "new") {
      setDraft({ ...defaultItem });
    } else {
      const found = items.find((row) => row.id === editId);
      setDraft(found ? { ...found } : { ...defaultItem });
    }
    setFormError("");
  }, [editId]);

  const setValue = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = () => {
    for (const field of fields) {
      if (field.required && !String(draft[field.key] ?? "").trim()) {
        setFormError(`'${field.label}' wajib diisi.`);
        return;
      }
    }
    const clean = {};
    for (const field of fields) {
      let value = draft[field.key];
      if (field.type === "tags") {
        value = String(value || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      } else {
        value = String(value ?? "").trim();
      }
      clean[field.key] = value;
    }
    store.update((d) => {
      const list = d[collectionKey] ? [...d[collectionKey]] : [];
      const id =
        editId === "new"
          ? crypto.randomUUID
            ? crypto.randomUUID()
            : String(Date.now())
          : editId;
      const entry = { ...clean, id };
      const idx = list.findIndex((row) => row.id === id);
      if (idx >= 0) list[idx] = entry;
      else list.unshift(entry);
      d[collectionKey] = list;
      return d;
    });
    setEditId(null);
  };

  const remove = (id) => {
    if (!window.confirm(`Hapus ${singular} ini?`)) return;
    store.update((d) => {
      d[collectionKey] = (d[collectionKey] || []).filter((row) => row.id !== id);
      return d;
    });
    if (editId === id) setEditId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">
          {singular} <span className="text-[var(--muted-foreground)]">({items.length})</span>
        </h3>
        <button
          className="tbtn"
          onClick={() => setEditId(editId === "new" ? null : "new")}
        >
          <Plus size={13} /> Tambah
        </button>
      </div>

      {editId !== null ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--highlight)_40%,transparent)] bg-[color-mix(in_srgb,var(--highlight)_5%,transparent)] p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => {
              if (field.type === "textarea") {
                return (
                  <Field key={field.key} label={field.label + (field.required ? " *" : "")}>
                    <textarea
                      rows={field.rows || 3}
                      className="tinput resize-y"
                      value={draft[field.key] ?? ""}
                      onChange={(e) => setValue(field.key, e.target.value)}
                    />
                  </Field>
                );
              }
              if (field.type === "select") {
                return (
                  <Field key={field.key} label={field.label + (field.required ? " *" : "")}>
                    <select
                      className="tinput"
                      value={draft[field.key] ?? ""}
                      onChange={(e) => setValue(field.key, e.target.value)}
                    >
                      {(field.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                );
              }
              if (field.type === "image") {
                return (
                  <div key={field.key} className="sm:col-span-2">
                    <Field label={field.label + (field.required ? " *" : "")}>
                      <ImageInput
                        value={draft[field.key] || ""}
                        onChange={(v) => setValue(field.key, v)}
                      />
                    </Field>
                  </div>
                );
              }
              return (
                <Field key={field.key} label={field.label + (field.required ? " *" : "")}>
                  <input
                    type={field.type === "month" ? "month" : "text"}
                    className="tinput"
                    placeholder={field.placeholder}
                    value={
                      field.type === "tags"
                        ? Array.isArray(draft[field.key])
                          ? draft[field.key].join(", ")
                          : draft[field.key] ?? ""
                        : draft[field.key] ?? ""
                    }
                    onChange={(e) => setValue(field.key, e.target.value)}
                  />
                </Field>
              );
            })}
          </div>

          {formError ? (
            <p className="text-xs text-red-500">✖ {formError}</p>
          ) : null}

          <div className="flex items-center gap-2">
            <button className="tbtn tbtn-primary" onClick={save}>
              <Save size={13} /> Simpan
            </button>
            <button className="tbtn" onClick={() => setEditId(null)}>
              Batal
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)]">
        {items.length === 0 ? (
          <p className="p-6 text-center text-sm italic text-[var(--muted-foreground)]">
            [ kosong ]
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">{metaOf(item)}</div>
              <button
                className="tbtn tbtn-icon shrink-0"
                title="Edit"
                onClick={() => setEditId(item.id)}
              >
                <Wrench size={13} />
              </button>
              <button
                className="tbtn tbtn-icon tbtn-danger shrink-0"
                title="Hapus"
                onClick={() => remove(item.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BioHeroEditor() {
  const data = useData();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(data.profile)));
  const [saved, setSaved] = useState(false);

  const save = () => {
    store.update((d) => {
      d.profile = JSON.parse(JSON.stringify(draft));
      return d;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const socialValue = (index, key, value) => {
    setDraft((d) => ({
      ...d,
      socials: d.socials.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    }));
  };

  const text = (label, key, required) => (
    <Field label={label + (required ? " *" : "")}>
      <input
        className="tinput"
        value={draft[key] || ""}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
      />
    </Field>
  );

  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-display text-base font-semibold">IDENTITAS &amp; HERO</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {text("Nama Lengkap", "name", true)}
        {text("Nama Panggilan (greeting)", "greetingName")}
        {text("Handle (kartu About, cth: @davasetiawan)", "handle")}
        {text("Role / Headline", "role")}
        {text("Status Availability", "availability")}
        {text("Lokasi", "location")}
        {text("Email", "email", true)}
        {text("Hero — teks sebelum highlight", "heroPre")}
        {text("Hero — kata ber-highlight (aksen)", "heroHighlight")}
        {text("Hero — teks sesudah highlight", "heroPost")}
        {text("URL CV / Resume (untuk banner atas)", "resumeUrl")}
      </div>

      <Field label="Foto Profil (kartu About)">
        <ImageInput
          value={draft.photoUrl || ""}
          onChange={(v) => setDraft({ ...draft, photoUrl: v })}
        />
      </Field>

      <Field label="Sub-headline hero">
        <textarea rows={2} className="tinput resize-y" value={draft.subheadline || ""} onChange={(e) => setDraft({ ...draft, subheadline: e.target.value })} />
      </Field>

      <Field label="Headline About (animasi per kata)">
        <textarea rows={2} className="tinput resize-y" value={draft.aboutHeadline || ""} onChange={(e) => setDraft({ ...draft, aboutHeadline: e.target.value })} />
      </Field>

      <Field label="Bio (enter = paragraf baru)">
        <textarea rows={4} className="tinput resize-y" value={draft.bio || ""} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
      </Field>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Sosial media</p>
        {draft.socials.map((social, index) => (
          <div key={index} className="flex gap-2">
            <input
              className="tinput max-w-[150px]"
              placeholder="Label"
              value={social.label}
              onChange={(e) => socialValue(index, "label", e.target.value)}
            />
            <input
              className="tinput"
              placeholder="https://..."
              value={social.url}
              onChange={(e) => socialValue(index, "url", e.target.value)}
            />
            <button
              className="tbtn tbtn-icon tbtn-danger shrink-0"
              title="Hapus baris"
              onClick={() =>
                setDraft((d) => ({ ...d, socials: d.socials.filter((_, i) => i !== index) }))
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <button
          className="tbtn self-start"
          onClick={() => setDraft((d) => ({ ...d, socials: [...d.socials, { label: "", url: "" }] }))}
        >
          <Plus size={13} /> Baris
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="tbtn tbtn-primary" onClick={save}>
          <Save size={13} /> Simpan Perubahan
        </button>
        {saved ? <span className="text-xs font-semibold text-[var(--highlight)]">✔ tersimpan</span> : null}
      </div>
    </div>
  );
}

function SkillsMarqueeEditor() {
  const data = useData();
  const [skillsText, setSkillsText] = useState(() => (data.skills || []).join("\n"));
  const [marqueeText, setMarqueeText] = useState(() => (data.marquee || []).join("\n"));
  const [techText, setTechText] = useState(() =>
    (data.techStack || []).map((t) => `${t.name} | ${t.logoUrl}`).join("\n")
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    store.update((d) => {
      d.skills = [...new Set(skillsText.split("\n").map((s) => s.trim()).filter(Boolean))];
      d.marquee = [...new Set(marqueeText.split("\n").map((s) => s.trim()).filter(Boolean))];
      d.techStack = techText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, logoUrl] = line.split("|").map((part) => part.trim());
          return { name: name || "", logoUrl: logoUrl || "" };
        })
        .filter((t) => t.name);
      return d;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-display text-base font-semibold">SKILLS &amp; MARQUEE</h3>
      <Field label="Skills (satu per baris)">
        <textarea rows={9} className="tinput resize-y" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
      </Field>
      <Field label="Tech Stack Marquee (format: Nama | URL-logo, satu per baris)">
        <textarea rows={7} className="tinput resize-y" value={techText} onChange={(e) => setTechText(e.target.value)} />
      </Field>
      <Field label="Kata-kata marquee layanan (satu per baris)">
        <textarea rows={5} className="tinput resize-y" value={marqueeText} onChange={(e) => setMarqueeText(e.target.value)} />
      </Field>
      <div className="flex items-center gap-3">
        <button className="tbtn tbtn-primary" onClick={save}>
          <Save size={13} /> Simpan
        </button>
        {saved ? <span className="text-xs font-semibold text-[var(--highlight)]">✔ tersimpan</span> : null}
      </div>
    </div>
  );
}

function MessagesViewer() {
  const data = useData();
  const messages = data.messages || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">
          Pesan Masuk <span className="text-[var(--muted-foreground)]">({messages.length})</span>
        </h3>
        {messages.length > 0 ? (
          <button
            className="tbtn tbtn-danger"
            onClick={() => {
              if (!window.confirm("Hapus semua pesan?")) return;
              store.update((d) => {
                d.messages = [];
                return d;
              });
            }}
          >
            <Trash2 size={13} /> Hapus Semua
          </button>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border-strong)] p-8 text-center text-sm italic text-[var(--muted-foreground)]">
          [ inbox kosong ]
        </p>
      ) : (
        messages.map((msg) => (
          <article key={msg.id} className="rounded-2xl border border-[var(--border)] p-4">
            <header className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">
                {msg.name}{" "}
                <span className="font-normal text-[var(--muted-foreground)]">&lt;{msg.email}&gt;</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  {new Date(msg.date).toLocaleString("id-ID")}
                </span>
                <button
                  className="tbtn tbtn-icon tbtn-danger"
                  title="Hapus"
                  onClick={() => {
                    store.update((d) => {
                      d.messages = (d.messages || []).filter((m) => m.id !== msg.id);
                      return d;
                    });
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </header>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted-foreground)]">
              {msg.message}
            </p>
          </article>
        ))
      )}
    </div>
  );
}

function SettingsEditor() {
  const data = useData();
  const fileRef = useRef(null);
  const [password, setPassword] = useState("");
  const [announce, setAnnounce] = useState(() => ({
    ...(data.settings?.announcement || {}),
  }));
  const [status, setStatus] = useState("");

  const flash = (message, ok = true) => {
    setStatus(message);
    setTimeout(() => setStatus(""), 3000);
    return ok;
  };

  const saveAnnouncement = () => {
    store.update((d) => {
      d.settings.announcement = { ...announce };
      return d;
    });
    flash("✔ pengumuman disimpan");
  };

  const savePassword = () => {
    if (password.trim().length < 4) {
      flash("✖ password minimal 4 karakter");
      return;
    }
    store.update((d) => {
      d.settings.password = password.trim();
      return d;
    });
    setPassword("");
    flash("✔ password diganti");
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("✔ backup diunduh");
  };

  const importJson = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.projects)) {
          throw new Error("format tidak valid");
        }
        store.update(() => parsed);
        flash("✔ data berhasil diimpor");
      } catch {
        flash("✖ gagal impor: file tidak valid");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold">
          <Megaphone size={16} className="text-[var(--highlight)]" /> BANNER PENGUMUMAN
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Label"><input className="tinput" value={announce.label || ""} onChange={(e) => setAnnounce({ ...announce, label: e.target.value })} /></Field>
          <Field label="Teks CTA"><input className="tinput" value={announce.cta || ""} onChange={(e) => setAnnounce({ ...announce, cta: e.target.value })} /></Field>
          <Field label="Deskripsi"><input className="tinput" value={announce.desc || ""} onChange={(e) => setAnnounce({ ...announce, desc: e.target.value })} /></Field>
          <Field label="URL tujuan CTA"><input className="tinput" value={announce.url || ""} onChange={(e) => setAnnounce({ ...announce, url: e.target.value })} /></Field>
        </div>
        <button className="tbtn tbtn-primary self-start" onClick={saveAnnouncement}>
          <Save size={13} /> Simpan Pengumuman
        </button>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold">
          <KeyRound size={16} className="text-[var(--highlight)]" /> PASSWORD ADMIN
        </h3>
        <div className="flex max-w-md gap-2">
          <input
            type="password"
            className="tinput"
            placeholder="Password baru (min. 4 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="tbtn shrink-0" onClick={savePassword}>
            <Save size={13} /> Ganti
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-display text-base font-semibold">BACKUP DATA</h3>
        <div className="flex flex-wrap gap-2">
          <button className="tbtn" onClick={exportJson}>
            <Download size={13} /> Export JSON
          </button>
          <button className="tbtn" onClick={() => fileRef.current?.click()}>
            <Upload size={13} /> Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importJson(file);
              e.target.value = "";
            }}
          />
          <button
            className="tbtn tbtn-danger"
            onClick={() => {
              if (!window.confirm("Reset SEMUA data ke bawaan? Perubahan akan hilang.")) return;
              store.resetAll();
              flash("✔ data direset ke default");
            }}
          >
            <RotateCcw size={13} /> Reset Default
          </button>
        </div>
      </section>

      {status ? (
        <p className={`text-xs font-semibold ${status.startsWith("✖") ? "text-red-500" : "text-[var(--highlight)]"}`}>
          {status}
        </p>
      ) : null}
    </div>
  );
}

export default function AdminPanel({ onClose, onLogout }) {
  const [tab, setTab] = useState("bio");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "92vh" }}
        className="my-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3.5">
          <span className="flex items-center gap-2 font-display text-sm font-semibold tracking-wide">
            <Sparkles size={15} className="text-[var(--highlight)]" />
            Admin CMS
            <span className="hidden text-xs font-normal text-[var(--muted-foreground)] sm:inline">
              — kelola konten portfolio
            </span>
          </span>
          <div className="flex items-center gap-2">
            <button className="tbtn tbtn-icon" title="Logout admin" onClick={onLogout}>
              <LogOut size={14} />
            </button>
            <button className="tbtn tbtn-icon" title="Tutup" onClick={onClose}>
              <X size={15} />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--border)] p-2 sm:w-48 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            {PANEL_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-left text-xs font-medium transition-colors sm:rounded-xl ${
                  tab === id
                    ? "bg-[color-mix(in_srgb,var(--highlight)_12%,transparent)] text-[var(--highlight)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {tab === "bio" ? <BioHeroEditor /> : null}
            {tab === "skills" ? <SkillsMarqueeEditor /> : null}
            {tab === "projects" ? (
              <CollectionEditor
                collectionKey="projects"
                singular="Project"
                defaultItem={{
                  title: "",
                  year: String(new Date().getFullYear()),
                  description: "",
                  tags: [],
                  imageUrl: "",
                  demoUrl: "",
                  repoUrl: "",
                }}
                fields={[
                  { key: "title", label: "Judul", required: true },
                  { key: "year", label: "Tahun", required: true },
                  { key: "description", label: "Deskripsi", type: "textarea", rows: 3, required: true },
                  { key: "tags", label: "Tags (pisahkan koma)", type: "tags" },
                  { key: "imageUrl", label: "Gambar Thumbnail", type: "image" },
                  { key: "demoUrl", label: "URL Demo" },
                  { key: "repoUrl", label: "URL GitHub" },
                ]}
                metaOf={(item) => (
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt="" className="h-9 w-16 shrink-0 rounded-lg border border-[var(--border)] object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.title}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {item.year} · {(item.tags || []).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              />
            ) : null}
            {tab === "experience" ? (
              <CollectionEditor
                collectionKey="experience"
                singular="Experience"
                defaultItem={{ role: "", org: "", period: "", type: "work", description: "" }}
                fields={[
                  { key: "role", label: "Posisi / Jenjang", required: true },
                  { key: "org", label: "Perusahaan / Institusi", required: true },
                  { key: "period", label: "Periode (cth: 2024 — Sekarang)", required: true },
                  {
                    key: "type",
                    label: "Tipe",
                    type: "select",
                    options: [
                      { value: "work", label: "Work / Kerja" },
                      { value: "education", label: "Education / Pendidikan" },
                    ],
                  },
                  { key: "description", label: "Deskripsi", type: "textarea", rows: 3, required: true },
                ]}
                metaOf={(item) => (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      [{(item.type || "work").toUpperCase()}] {item.role}
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      @{item.org} · {item.period}
                    </p>
                  </div>
                )}
              />
            ) : null}
            {tab === "certificates" ? (
              <CollectionEditor
                collectionKey="certificates"
                singular="Certificate"
                defaultItem={{ name: "", issuer: "", date: "", imageUrl: "", verifyUrl: "" }}
                fields={[
                  { key: "name", label: "Nama Sertifikat", required: true },
                  { key: "issuer", label: "Penerbit", required: true },
                  { key: "date", label: "Tanggal Terbit", type: "month", required: true },
                  { key: "imageUrl", label: "Gambar Sertifikat", type: "image", required: true },
                  { key: "verifyUrl", label: "URL Verifikasi" },
                ]}
                metaOf={(item) => (
                  <div className="flex min-w-0 items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt="" className="h-10 w-14 shrink-0 rounded-lg border border-[var(--border)] object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {item.issuer} · {item.date}
                      </p>
                    </div>
                  </div>
                )}
              />
            ) : null}
            {tab === "inbox" ? <MessagesViewer /> : null}
            {tab === "settings" ? <SettingsEditor /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
