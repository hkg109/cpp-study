import { LectureCard } from "./LectureCard";
import type { LectureMeta } from "@/types/content";

export function WeekSection({ week, lectures, showDescriptions = true }: { week: number; lectures: LectureMeta[]; showDescriptions?: boolean }) {
  const duration = lectures.reduce((total, lecture) => total + (lecture.duration ?? 0), 0);
  return <section className="week-section" id={`week-${week}`}>
    <div className="section-heading"><h2><span className="week-number">{String(week).padStart(2, "0")}</span>Week {String(week).padStart(2, "0")}</h2><span className="meta">{lectures.length}개의 강의{duration > 0 ? ` · 약 ${duration}분` : ""}</span></div>
    <div className="card-grid">{lectures.map(lecture => <LectureCard key={lecture.path} lecture={lecture} showDescription={showDescriptions} />)}</div>
  </section>;
}
