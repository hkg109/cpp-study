"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminContext";
import { NOTE_TITLE_EVENT, PRACTICE_METADATA_EVENT, saveNoteTitle, savePracticeMetadata } from "@/lib/note-draft";
import type { ContentDocument } from "@/types/content";

export function LectureHeader({ lecture, hideDescription = false }: { lecture: ContentDocument; hideDescription?: boolean }) {
  const { isAdmin } = useAdmin();
  const [title, setTitle] = useState(lecture.title);
  const [description, setDescription] = useState(lecture.description);

  useEffect(() => {
    const syncTitle = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; title: string }>).detail;
      if (detail.path === lecture.path) setTitle(detail.title);
    };
    window.addEventListener(NOTE_TITLE_EVENT, syncTitle);
    const syncPracticeMetadata = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; title: string; description: string }>).detail;
      if (detail.path === lecture.path) { setTitle(detail.title); setDescription(detail.description); }
    };
    window.addEventListener(PRACTICE_METADATA_EVENT, syncPracticeMetadata);
    return () => {
      window.removeEventListener(NOTE_TITLE_EVENT, syncTitle);
      window.removeEventListener(PRACTICE_METADATA_EVENT, syncPracticeMetadata);
    };
  }, [lecture.path]);

  const updateTitle = (nextTitle: string) => {
    setTitle(nextTitle);
    if (lecture.kind === "practice") savePracticeMetadata(lecture.path, { title: nextTitle, description });
    else saveNoteTitle(lecture.path, nextTitle);
  };

  const updateDescription = (nextDescription: string) => {
    setDescription(nextDescription);
    savePracticeMetadata(lecture.path, { title, description: nextDescription });
  };

  return <header className="lecture-header">
    <div className="eyebrow">WEEK {String(lecture.week).padStart(2, "0")} <span className="muted">/</span> {lecture.kind === "lectures" ? `LECTURE ${String(lecture.order).padStart(2, "0")}` : lecture.kind.toUpperCase()}</div>
    {isAdmin && (lecture.kind === "lectures" || lecture.kind === "practice") ? <input className="admin-title-input" value={title} onChange={event => updateTitle(event.target.value)} aria-label={`${lecture.kind === "practice" ? "실습" : "강의"} 제목 수정`} /> : <h1>{title}</h1>}
    {!hideDescription && (isAdmin && lecture.kind === "practice" ? <textarea className="admin-description-input" rows={2} value={description} onChange={event => updateDescription(event.target.value)} aria-label="실습 설명 수정" /> : <p className="lead">{description}</p>)}
    {lecture.kind !== "practice" && <div className="lecture-metadata">{lecture.duration && <span>{lecture.duration} MIN</span>}{lecture.difficulty && <span>{lecture.difficulty.toUpperCase()}</span>}{lecture.tags?.map(tag => <span key={tag}>#{tag}</span>)}</div>}
  </header>;
}
