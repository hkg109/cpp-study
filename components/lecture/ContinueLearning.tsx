"use client";

import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { LectureMeta } from "@/types/content";
import { useProgress } from "./ProgressProvider";

export function ContinueLearning({ lectures }: { lectures: LectureMeta[] }) {
  const { progress, ready } = useProgress();
  if (!lectures.length) return <section className="continue-panel"><p>첫 강의를 준비하고 있습니다.</p></section>;
  const completed = lectures.filter(lecture => progress[lecture.slug.join("/")]).length;
  const next = lectures.find(lecture => !progress[lecture.slug.join("/")]) ?? lectures[0];
  const finished = completed === lectures.length;
  return <section className="continue-panel" aria-label="이어서 학습">
    <div className="continue-top"><span className="eyebrow">YOUR NEXT STEP</span><span className="meta">{ready ? `${completed} / ${lectures.length} 완료` : "학습 기록 불러오는 중"}</span></div>
    <div className="progress-track" role="progressbar" aria-label="전체 학습 진행률" aria-valuemin={0} aria-valuemax={lectures.length} aria-valuenow={completed}><span style={{ width: `${completed / lectures.length * 100}%` }} /></div>
    <span className="eyebrow">{finished ? "ALL CLEAR" : `WEEK ${String(next.week).padStart(2, "0")}`}</span>
    <h2>{finished ? "모든 강의를 완주했어요." : next.title}</h2>
    {finished && <p>잘 해냈습니다. 배운 내용을 다시 살펴보세요.</p>}
    <Link href={next.path} className="text-link">{finished ? "첫 강의 복습하기" : completed ? "이어서 학습하기" : "첫 강의 시작하기"}{finished ? <CheckCircle2 size={18} /> : <ArrowUpRight size={18} />}</Link>
  </section>;
}
