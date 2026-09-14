import type { Metadata } from "next";
import { getAllLectures, getWeeks } from "@/lib/lectures";
import { WeekSection } from "@/components/lecture/WeekSection";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "강의노트", description: "주차별 C++ 강의노트와 학습 커리큘럼을 살펴보세요." };
export default function LecturesPage() {
  const lectures = getAllLectures();
  const weeks = getWeeks();
  return <div className="index-page"><header className="page-title"><span className="eyebrow">THE CURRICULUM</span><h1>강의노트</h1><p>작은 개념 하나부터, 순서대로 쌓아갑니다.</p><span className="meta">{weeks.length} Weeks · {lectures.length} Lectures</span></header>{weeks.length ? weeks.map(week => <WeekSection key={week} week={week} lectures={lectures.filter(lecture => lecture.week === week)} showDescriptions={false} />) : <div className="empty-state">강의를 준비하고 있습니다.</div>}<Footer /></div>;
}
