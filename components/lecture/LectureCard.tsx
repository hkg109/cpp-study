"use client";

import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { LectureMeta } from "@/types/content";
import { useProgress } from "./ProgressProvider";

export function LectureCard({ lecture, showDescription = true }: { lecture: LectureMeta; showDescription?: boolean }) {
  const { progress } = useProgress();
  const complete = progress[lecture.slug.join("/")];
  return <Link href={lecture.path} className={`lecture-card ${showDescription ? "" : "compact"}`}>
    <div className="card-meta"><span>{String(lecture.order).padStart(2, "0")}</span><span>{complete ? <span className="completed"><Check size={14} />완료</span> : lecture.duration ? `${lecture.duration} MIN` : "LECTURE"}</span></div>
    <div className="card-title"><h3>{lecture.title}</h3><ArrowUpRight size={19} /></div>
    {showDescription && <p>{lecture.description}</p>}
    <div className="tag-list">{lecture.tags?.slice(0, 3).map(tag => <span key={tag}>#{tag}</span>)}</div>
  </Link>;
}
