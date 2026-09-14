"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Terminal } from "lucide-react";
import type { LectureMeta } from "@/types/content";
import { useProgress } from "@/components/lecture/ProgressProvider";
import { useEffect, useState } from "react";
import { NOTE_TITLE_EVENT } from "@/lib/note-draft";

export function Sidebar({ lectures, onNavigate }: { lectures: LectureMeta[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { progress } = useProgress();
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  useEffect(() => {
    const syncTitle = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; title: string }>).detail;
      const lecture = lectures.find(item => item.path === detail.path);
      if (!lecture) return;
      setEditedTitles(current => ({ ...current, [detail.path]: detail.title || lecture.title }));
    };
    window.addEventListener(NOTE_TITLE_EVENT, syncTitle);
    return () => window.removeEventListener(NOTE_TITLE_EVENT, syncTitle);
  }, [lectures]);
  const weeks = [...new Set(lectures.map(lecture => lecture.week))];
  return <nav className="sidebar-content" aria-label="강의 탐색">
    {weeks.map(week => <details open className="week-nav" key={week}>
      <summary><span>WEEK {String(week).padStart(2, "0")}</span><ChevronDown size={14} /></summary>
      <div>{lectures.filter(lecture => lecture.week === week).map(lecture => <Link key={lecture.path} href={lecture.path} onClick={onNavigate} className={`side-link ${pathname === lecture.path ? "active" : ""}`} aria-current={pathname === lecture.path ? "page" : undefined}><span className="side-order">{String(lecture.order).padStart(2, "0")}</span><span>{editedTitles[lecture.path] ?? lecture.title}</span>{progress[lecture.slug.join("/")] && <Check size={14} aria-label="학습 완료" className="trailing" />}</Link>)}</div>
    </details>)}
    <div className="sidebar-section resources"><span className="nav-label">KEEP PRACTICING</span><Link href="/practice" onClick={onNavigate} className={`side-link ${pathname.startsWith("/practice") ? "active" : ""}`}><Terminal size={16} />실습 문제</Link></div>
    <div className="sidebar-note"><span className="small-logo">미남들과 함께하는 C++</span><p>정시템 최고 미남들과<br />재밌게 배웁니다</p><span>FORIF STUDY NOTES</span></div>
  </nav>;
}
