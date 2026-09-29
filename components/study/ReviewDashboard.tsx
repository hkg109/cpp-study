"use client";

import Link from "next/link";
import { Bookmark, Brain, Highlighter, MessageSquareText, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { listAllStudyRecords, type StudyRecord } from "@/lib/study-store";

type DocumentMeta = { path: string; title: string; week: string };
const label = (record: StudyRecord) => record.type === "highlight" ? "형광펜" : record.type === "memo" ? "메모" : record.type === "bookmark" ? "북마크" : record.type === "flashcard" ? "플래시카드" : "확인 문제";
const priority = (record: StudyRecord) => record.quizResult === "wrong" ? 0 : record.quizResult === "unsure" ? 1 : record.type === "memo" ? 2 : record.type === "highlight" ? 3 : record.type === "bookmark" ? 4 : 5;

export function ReviewDashboard({ documents }: { documents: DocumentMeta[] }) {
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [filters, setFilters] = useState({ week: "", type: "", color: "" });
  useEffect(() => { let cancelled = false; void listAllStudyRecords().then(value => { if (!cancelled) setRecords(value); }); return () => { cancelled = true; }; }, []);
  const metadata = useMemo(() => new Map(documents.map(document => [document.path, document])), [documents]);
  const options = (key: "week") => [...new Set(documents.map(document => document[key]))].sort();
  const visible = records.filter(record => {
    const document = metadata.get(record.documentPath);
    return document && (!filters.week || document.week === filters.week) && (!filters.type || record.type === filters.type) && (!filters.color || record.color === filters.color);
  }).sort((a, b) => priority(a) - priority(b) || a.updatedAt.localeCompare(b.updatedAt));
  const stats = { all: records.length, wrong: records.filter(record => record.quizResult === "wrong").length, unsure: records.filter(record => record.quizResult === "unsure").length, mastered: records.filter(record => record.quizResult === "correct").length };
  const update = (key: keyof typeof filters, value: string) => setFilters(current => ({ ...current, [key]: value }));
  return <div className="review-page"><header className="review-header"><span className="eyebrow">STUDY REVIEW</span><h1>복습 노트</h1><p>중요하게 표시한 내용과 다시 볼 문제를 주차별로 모았습니다.</p></header>
    <section className="review-stats" aria-label="학습 통계"><div><strong>{stats.all}</strong><span>전체 기록</span></div><div><strong>{stats.wrong}</strong><span>다시 학습</span></div><div><strong>{stats.unsure}</strong><span>헷갈림</span></div><div><strong>{stats.mastered}</strong><span>알고 있음</span></div></section>
    <section className="review-filters" aria-label="복습 필터">{(["week"] as const).map(key => <select key={key} value={filters[key]} onChange={event => update(key, event.target.value)} aria-label={`${"주차"} 필터`}><option value="">{"전체 주차"}</option>{options(key).map(value => <option key={value}>{value}</option>)}</select>)}<select value={filters.type} onChange={event => update("type", event.target.value)} aria-label="기록 유형 필터"><option value="">전체 기록</option><option value="highlight">형광펜</option><option value="memo">메모</option><option value="bookmark">북마크</option><option value="quiz">확인 문제</option><option value="flashcard">플래시카드</option></select><select value={filters.color} onChange={event => update("color", event.target.value)} aria-label="색상 필터"><option value="">전체 색상</option>{["yellow","blue","red","green","purple"].map(color => <option key={color}>{color}</option>)}</select><button onClick={() => setFilters({ week:"", type:"", color:"" })}><RotateCcw size={14} />초기화</button></section>
    <section className="review-list">{visible.length === 0 ? <div className="review-empty"><Brain size={28} /><h2>복습할 기록이 없습니다.</h2><p>강의 노트에서 형광펜, 메모, 북마크를 남기거나 문제를 풀어 보세요.</p></div> : visible.map(record => { const document = metadata.get(record.documentPath)!; const Icon = record.type === "highlight" ? Highlighter : record.type === "memo" ? MessageSquareText : record.type === "bookmark" ? Bookmark : Brain; return <Link key={record.id} href={`${record.documentPath}?studyBlock=${encodeURIComponent(record.blockId)}`} className={`review-card ${record.quizResult ?? ""}`}><Icon size={18} /><div><span className="review-card-meta">{document.week} · {label(record)}</span><h2>{document.title}</h2>{record.selectedText && <q>{record.selectedText}</q>}{record.memo && <p>{record.memo}</p>}{record.quizResult && <strong>{record.quizResult === "wrong" ? "다시 학습" : record.quizResult === "unsure" ? "헷갈림" : "알고 있음"}</strong>}</div></Link>; })}</section>
  </div>;
}
