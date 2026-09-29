"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSyncExternalStore } from "react";

const SIDEBAR_KEY = "cpp-study-sidebar-collapsed";
const SIDEBAR_EVENT = "cpp-study-sidebar-change";
const getCollapsed = () => {
  try { return localStorage.getItem(SIDEBAR_KEY) === "true"; } catch { return false; }
};
const subscribe = (listener: () => void) => {
  const sync = (event: Event) => { if (!(event instanceof StorageEvent) || event.key === SIDEBAR_KEY || event.key === null) listener(); };
  window.addEventListener("storage", sync);
  window.addEventListener(SIDEBAR_EVENT, sync);
  return () => { window.removeEventListener("storage", sync); window.removeEventListener(SIDEBAR_EVENT, sync); };
};

export function AppShell({ sidebar, children }: { sidebar: React.ReactNode; children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribe, getCollapsed, () => false);
  const toggle = () => {
    try { localStorage.setItem(SIDEBAR_KEY, String(!collapsed)); } catch { /* Ignore unavailable storage. */ }
    window.dispatchEvent(new Event(SIDEBAR_EVENT));
  };
  return <div className={`app-shell${collapsed ? " sidebar-collapsed" : ""}`}>
    <aside className="desktop-sidebar" inert={collapsed}>{sidebar}</aside>
    <button type="button" className="sidebar-toggle" onClick={toggle} aria-label={collapsed ? "왼쪽 학습 메뉴 펼치기" : "왼쪽 학습 메뉴 접기"} aria-expanded={!collapsed}>
      {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
    </button>
    <main id="main-content" tabIndex={-1}>{children}</main>
  </div>;
}
