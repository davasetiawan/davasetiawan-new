"use client";

import { useSyncExternalStore } from "react";
import SEED from "./seed";

const KEY = "dava-portfolio:v2";

let data = null;
let snapshot = null;
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
  return data;
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

function update(mutator) {
  init();
  const draft = clone(data);
  const next = typeof mutator === "function" ? mutator(draft) : mutator;
  if (!next) return;
  data = next;
  snapshot = data;
  persist();
  listeners.forEach((listener) => listener());
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
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    data = clone(SEED);
    snapshot = data;
    listeners.forEach((listener) => listener());
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
    draft[collection] = (draft[collection] || []).filter(
      (row) => row.id !== id
    );
    return draft;
  });
}
