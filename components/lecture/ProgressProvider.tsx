"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { parseProgress, PROGRESS_KEY, type Progress } from "@/lib/progress";

const ProgressContext = createContext({ progress: {} as Progress, ready: false, storageError: false, toggle: (_slug: string) => { void _slug; } });

const serverSnapshot = { progress: {} as Progress, ready: false, storageError: false };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
const getSnapshot = () => snapshot;
const getServerSnapshot = () => serverSnapshot;
const emit = () => listeners.forEach(listener => listener());

function readStorage() {
  try { snapshot = { progress: parseProgress(localStorage.getItem(PROGRESS_KEY)), ready: true, storageError: false }; }
  catch { snapshot = { ...snapshot, ready: true, storageError: true }; }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  readStorage();
  const sync = (event: StorageEvent) => { if (event.key === PROGRESS_KEY || event.key === null) readStorage(); };
  window.addEventListener("storage", sync);
  return () => { listeners.delete(listener); window.removeEventListener("storage", sync); };
}

function toggle(slug: string) {
  let current = snapshot.progress;
  if (!snapshot.storageError) {
    try { current = parseProgress(localStorage.getItem(PROGRESS_KEY)); } catch { /* Keep in-memory state. */ }
  }
  const progress = { ...current, [slug]: !current[slug] };
  let storageError = false;
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch { storageError = true; }
  snapshot = { progress, ready: true, storageError }; emit();
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <ProgressContext.Provider value={{ ...state, toggle }}>{children}</ProgressContext.Provider>;
}

export const useProgress = () => useContext(ProgressContext);
