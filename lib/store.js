"use client";

import { useSyncExternalStore } from "react";
import SEED from "./seed";
import { supabaseBrowser } from "./supabase";

const KEY = "dava-portfolio:v2";
const SINGLE_ID = 1;

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

function fromRemote(row) {
  if (!row) return null;
  return merge(SEED, {
    profile: row.profile,
    skills: row.skills,
    marquee: row.marquee,
    techStack: row.techStack ?? row.tech_stack,
    projects: row.projects,
    experience: row.experience,
    certificates: row.certificates,
    messages: row.messages,
    settings: row.settings,
  });
}

function notify() {
  listeners.forEach((listener) => listener());
}

function persistLocal() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

function applyRemote(row) {
  const next = fromRemote(row);
  if (!next) return;
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
    if (saved && !saved.error) applyRemote(saved);
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
      if (remote && !remote.error) applyRemote(remote);
    }
  } catch {
  } finally {
    window.clearTimeout(timeout);
    bindRealtime();
  }
}

function init() {
  if (data !== null) return data;
  if (typeof window === "undefined") {
    data = clone(SEED);
    snapshot = data;
    return data;
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    data = raw ? merge(SEED, JSON.parse(raw)) : clone(SEED);
  } catch {
    data = clone(SEED);
  }
  snapshot = data;
  hydrateFromServer();
  return data;
}

function update(mutator) {
  init();
  const draft = clone(data);
  const next = typeof mutator === "function" ? mutator(draft) : mutator;
  if (!next) return;
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
    persistLocal();
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
