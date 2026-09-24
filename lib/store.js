"use client";

import { useSyncExternalStore } from "react";
import SEED from "./seed";
import { supabaseBrowser } from "./supabase";

const KEY = "dava-portfolio:v2";
const SINGLE_ID = 1;
const DB_NAME = "DavaPortfolioDB";
const DB_STORE = "content_store";

let data = null;
let snapshot = null;
let hydrating = false;
let realtimeBound = false;
const listeners = new Set();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function merge(base, patch) {
  if (Array.isArray(patch)) return clone(patch);
  if (patch && typeof patch === "object") {
    const out =
      base && typeof base === "object" && !Array.isArray(base) ? { ...base } : {};
    for (const key of Object.keys(patch)) {
      out[key] = merge(out[key], patch[key]);
    }
    return out;
  }
  return patch === undefined ? base : patch;
}

// IndexedDB Helper Functions for unlimited browser storage space
function openIDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("No IndexedDB"));
    }
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function getIDB(key) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const store = tx.objectStore(DB_STORE);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function setIDB(key, val) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      const store = tx.objectStore(DB_STORE);
      const req = store.put(val, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}
}

async function deleteIDB(key) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      const store = tx.objectStore(DB_STORE);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {}
}

function fromRemote(row) {
  if (!row) return null;
  // For gallery: use server value directly (even if empty [])
  // Do NOT merge with SEED.gallery to avoid overwriting user photos with defaults
  return {
    profile: row.profile ?? SEED.profile,
    skills: row.skills ?? SEED.skills,
    marquee: row.marquee ?? SEED.marquee,
    techStack: row.techStack ?? row.tech_stack ?? SEED.techStack,
    projects: row.projects ?? SEED.projects,
    experience: row.experience ?? SEED.experience,
    certificates: row.certificates ?? SEED.certificates,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    messages: row.messages ?? SEED.messages,
    settings: row.settings ?? SEED.settings,
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persistLocal() {
  if (!data) return;
  // Primary storage: IndexedDB (supports GBs of media data)
  setIDB(KEY, data);

  // Secondary backup: localStorage (silent catch)
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

function applyRemote(row, { forceOverwrite = false } = {}) {
  const next = fromRemote(row);
  if (!next) return;

  // Guard: only overwrite local data if server is strictly newer
  // _localAt = timestamp set every time user saves via admin panel
  // If local data has been modified after server's timestamp, keep local
  if (!forceOverwrite) {
    const serverTs = row._localAt || 0;
    const localTs = data?._localAt || 0;
    if (localTs > serverTs) {
      // Local is newer — push local back to server silently and bail
      persistRemote(data);
      return;
    }
  }

  data = next;
  snapshot = data;
  persistLocal();
  notify();
}

async function persistRemote(payload) {
  try {
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const saved = await res.json();
    // After our own save, apply server echo only if it still matches our timestamp
    if (saved && !saved.error && !saved.offline) {
      const savedTs = saved._localAt || 0;
      const localTs = data?._localAt || 0;
      if (savedTs >= localTs) applyRemote(saved, { forceOverwrite: true });
    }
  } catch {}
}

function bindRealtime() {
  if (realtimeBound || typeof window === "undefined") return;
  realtimeBound = true;
  try {
    supabaseBrowser()
      .channel("content-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "content",
          filter: `id=eq.${SINGLE_ID}`,
        },
        (payload) => {
          // Realtime: only apply if server is newer than current local
          if (payload.new) applyRemote(payload.new);
        }
      )
      .subscribe();
  } catch {}
}

async function hydrateFromServer() {
  if (hydrating || typeof window === "undefined") return;
  hydrating = true;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch("/api/content", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (res.ok) {
      const remote = await res.json();
      if (remote && !remote.error && !remote.offline) applyRemote(remote);
    }
  } catch {
  } finally {
    window.clearTimeout(timeout);
    bindRealtime();
  }
}

function init() {
  if (data !== null) return data;
  data = clone(SEED);
  snapshot = data;

  if (typeof window !== "undefined") {
    // 1. Try sync load from localStorage
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const stored = JSON.parse(raw);
        data = merge(SEED, stored);
        snapshot = data;
        notify();
      }
    } catch {}

    // 2. Load from IndexedDB (supports unlimited storage for uploaded photos)
    getIDB(KEY).then((idbStored) => {
      if (idbStored) {
        data = merge(SEED, idbStored);
        snapshot = data;
        notify();
      }
      hydrateFromServer();
    });
  }
  return data;
}

function update(mutator) {
  init();
  const draft = clone(data);
  const next = typeof mutator === "function" ? mutator(draft) : mutator;
  if (!next) return;
  // Stamp local modification time so server data cannot silently overwrite it
  next._localAt = Date.now();
  data = next;
  snapshot = data;
  persistLocal();
  notify();
  persistRemote(next);
}

export const store = {
  subscribe(listener) {
    init();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    init();
    return snapshot;
  },
  getServerSnapshot() {
    return SEED;
  },
  update,
  resetAll() {
    data = clone(SEED);
    snapshot = data;
    deleteIDB(KEY);
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    notify();
    fetch("/api/content", { method: "DELETE" }).catch(() => {});
  },
};

export function useData() {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );
}

export function upsertItem(collection, item, id) {
  store.update((draft) => {
    const list = draft[collection] || [];
    const finalId = id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    const entry = { ...item, id: finalId };
    const idx = list.findIndex((row) => row.id === finalId);
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    draft[collection] = list;
    return draft;
  });
}

export function removeItem(collection, id) {
  store.update((draft) => {
    draft[collection] = (draft[collection] || []).filter((row) => row.id !== id);
    return draft;
  });
}

