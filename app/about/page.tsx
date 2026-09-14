import fs from "node:fs";
import path from "node:path";
import { renderMDX } from "@/lib/mdx";
import { getAllLectures, getWeeks } from "@/lib/lectures";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "스터디 소개", description: "FORIF C++ 스터디의 학습 목표와 진행 방식을 소개합니다." };
export default async function AboutPage() {
  const { content } = await renderMDX(fs.readFileSync(path.join(process.cwd(), "content/about.mdx"), "utf8"));
  const lectures = getAllLectures();
  return <div className="index-page about-page"><header className="page-title"><span className="eyebrow">ABOUT THE STUDY</span><h1>함께 읽고, 직접 만드는 C++.</h1><p>처음의 낯섦을 지나, 스스로 코드를 쓰는 힘을 기릅니다.</p></header><div className="prose">{content}<h2>현재 공개된 커리큘럼</h2>{getWeeks().map(week => <section key={week}><h3>Week {String(week).padStart(2, "0")}</h3><ul>{lectures.filter(lecture => lecture.week === week).map(lecture => <li key={lecture.path}><Link href={lecture.path}>{lecture.title}</Link></li>)}</ul></section>)}</div><Footer /></div>;
}
