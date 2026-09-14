import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { getAllLectures, getWeeks } from "@/lib/lectures";
import { ContinueLearning } from "@/components/lecture/ContinueLearning";
import { WeekSection } from "@/components/lecture/WeekSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const lectures = getAllLectures();
  const weeks = getWeeks();
  return <div className="index-page">
    <div className="page-kicker"><span className="eyebrow">THE STUDY NOTE</span><span className="meta">기초부터 차근차근</span></div>
    <section className="home-hero"><div className="hero-copy"><div className="hero-label"><span className="status-dot" />FORIF C++ STUDY</div><h1>C++ 도전,<br /><span className="muted">미남들과 함께</span></h1><p>C++의 기본 문법부터 객체지향 프로그래밍까지.<br className="desktop-break" />읽고, 직접 작성하고, 이해하는 시간을 함께합니다.</p><div className="hero-actions"><Link href={lectures[0]?.path ?? "/lectures"} className="button primary">학습 시작하기<ArrowRight size={17} /></Link></div></div><ContinueLearning lectures={lectures} /></section>
    <div className="curriculum-heading"><div><span className="eyebrow">THE CURRICULUM</span><h2>커리큘럼</h2></div><span className="meta">{weeks.length} WEEKS <span className="separator">/</span> {lectures.length} LECTURES</span></div>
    {weeks.length ? weeks.map(week => <WeekSection key={week} week={week} lectures={lectures.filter(lecture => lecture.week === week)} showDescriptions={false} />) : <div className="empty-state">새로운 강의가 곧 공개됩니다.</div>}
    <section className="practice-banner"><div className="practice-icon"><Code2 size={25} /></div><div><h2>이해했다면, 직접 만들어 볼 차례.</h2><p>작은 문제를 풀며 오늘 배운 문법을 내 것으로 만드세요.</p></div><Link href="/practice" className="text-link">실습 문제 풀기<ArrowRight size={17} /></Link></section>
    <Footer />
  </div>;
}
