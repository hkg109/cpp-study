"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { PRACTICE_METADATA_EVENT, type PracticeMetadata } from "@/lib/note-draft";
import type { LectureMeta } from "@/types/content";

function PracticeRow({ doc }: { doc: LectureMeta }) {
  const [metadata, setMetadata] = useState<PracticeMetadata>({ title: doc.title, description: doc.description });
  useEffect(() => {
    const syncMetadata = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; title: string; description: string }>).detail;
      if (detail.path === doc.path) setMetadata({ title: detail.title, description: detail.description });
    };
    window.addEventListener(PRACTICE_METADATA_EVENT, syncMetadata);
    return () => window.removeEventListener(PRACTICE_METADATA_EVENT, syncMetadata);
  }, [doc.path]);
  return <Link href={doc.path} className="resource-row"><span className="eyebrow">WEEK {String(doc.week).padStart(2, "0")}</span><div><h2>{metadata.title}</h2>{metadata.description && <p>{metadata.description}</p>}{doc.due && <span className="meta">제출 기한 · {doc.due}</span>}</div><ArrowUpRight size={22} /></Link>;
}

export function ResourceList({ docs, practice }: { docs: LectureMeta[]; practice: boolean }) {
  return <div className="resource-list">{docs.map(doc => practice ? <PracticeRow key={doc.path} doc={doc} /> : <Link href={doc.path} key={doc.path} className="resource-row"><span className="eyebrow">WEEK {String(doc.week).padStart(2, "0")}</span><div><h2>{doc.title}</h2><p>{doc.description}</p>{doc.due && <span className="meta">제출 기한 · {doc.due}</span>}</div><ArrowUpRight size={22} /></Link>)}{!docs.length && <div className="empty-state">새로운 {practice ? "실습을" : "과제를"} 준비하고 있습니다.</div>}</div>;
}
