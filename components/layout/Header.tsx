"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Moon, Sun, X, Search, ShieldCheck } from "lucide-react";
import type { LectureMeta, SearchEntry } from "@/types/content";
import { Sidebar } from "./Sidebar";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { useAdmin } from "@/components/admin/AdminContext";

export function Header({ lectures, searchIndex }: { lectures: LectureMeta[]; searchIndex: SearchEntry[] }) {
  const path = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { isAdmin, openAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const adminAvailable = process.env.NODE_ENV === "development";
  return <>
    <header className="site-header"><div className="header-inner">
      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}><Dialog.Trigger asChild><button className="icon-button mobile-only" aria-label="강의 메뉴 열기"><Menu size={21} /></button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="mobile-drawer"><div className="drawer-heading"><Dialog.Title>C++ STUDY</Dialog.Title><Dialog.Close asChild><button className="icon-button" aria-label="강의 메뉴 닫기"><X size={20} /></button></Dialog.Close></div><Dialog.Description className="sr-only">주차별 강의와 실습 탐색</Dialog.Description><Sidebar lectures={lectures} onNavigate={() => setMenuOpen(false)} /></Dialog.Content></Dialog.Portal></Dialog.Root>
      <Link href="/" className="brand" aria-label="Handsome C++ 홈"><span className="brand-symbol">C<span>++</span></span><span>Handsome C++<span className="brand-by"> / FORIF</span></span></Link>
      <nav className="header-nav" aria-label="주 메뉴">{[["/lectures", "강의노트"], ["/practice", "실습"]].map(([href, label]) => <Link href={href} key={href} className={path.startsWith(href) ? "selected" : ""} aria-current={path === href ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="검색 열기"><Search size={16} /><span>강의 검색</span><kbd>⌘ K</kbd></button><button className="icon-button theme-toggle" aria-label="라이트·다크 테마 전환" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><Moon size={18} className="moon-icon" /><Sun size={18} className="sun-icon" /></button>{adminAvailable && <button className={`admin-trigger${isAdmin ? " active" : ""}`} onClick={openAdmin} aria-label="관리자 모드 열기" aria-pressed={isAdmin}><ShieldCheck size={16} /><span>관리자</span></button>}</div>
    </div></header>
    <SearchDialog entries={searchIndex} open={searchOpen} setOpen={setSearchOpen} />
  </>;
}
