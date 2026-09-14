import type { Metadata } from "next";
import { connection } from "next/server";
import "pretendard/dist/web/static/pretendard.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { AdminProvider } from "@/components/admin/AdminProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { getAllLectures } from "@/lib/lectures";
import { getSearchIndex } from "@/lib/search";

export const metadata: Metadata = {
  title: { default: "Handsome C++ | FORIF", template: "%s | Handsome C++" },
  description: "한 줄씩 이해하고, 직접 쓰면서 배우는 FORIF C++ 스터디. 강의노트와 실습으로 C++의 기초를 쌓아갑니다.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Local admin edits must be read on every development request. Production content is
  // generated once at build time so Vercel can serve the pages from its static cache.
  if (process.env.NODE_ENV === "development") await connection();
  const lectures = getAllLectures();
  const shell = <>
    <a href="#main-content" className="skip-link">본문으로 바로가기</a>
    <Header lectures={lectures} searchIndex={getSearchIndex()} />
    <div className="app-shell"><aside className="desktop-sidebar"><Sidebar lectures={lectures} /></aside><main id="main-content" tabIndex={-1}>{children}</main></div>
  </>;
  return <html lang="ko" suppressHydrationWarning><body><Providers>
    {process.env.NODE_ENV === "development" ? <AdminProvider expectedPassword="1009">{shell}</AdminProvider> : shell}
  </Providers></body></html>;
}
