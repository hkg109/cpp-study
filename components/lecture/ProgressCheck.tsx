"use client";

import { CheckCircle2 } from "lucide-react";
import { useProgress } from "./ProgressProvider";

export function ProgressCheck({ slug }: { slug: string }) {
  const { progress, ready, toggle, storageError } = useProgress();
  return <section className="completion-box" aria-label="학습 완료">
    <div><CheckCircle2 size={23} /><div><strong>오늘도 한 걸음 앞으로.</strong><p>내용을 이해했다면 학습 완료를 체크해 주세요.</p></div></div>
    <label className="check-label"><input type="checkbox" checked={!!progress[slug]} disabled={!ready} onChange={() => toggle(slug)} />이 강의 학습 완료</label>
    <small>{storageError ? "브라우저 저장소를 사용할 수 없어 현재 화면에서만 진도가 유지됩니다." : "학습 기록은 현재 브라우저에 저장됩니다."}</small>
  </section>;
}
