import { readCollection, withoutBody } from "@/lib/content";
import { Footer } from "@/components/layout/Footer";
import { ResourceList } from "./ResourceList";

export function ResourceIndex({ kind }: { kind: "practice" | "assignments" }) {
  const docs = readCollection(kind);
  const practice = kind === "practice";
  return <div className="index-page"><header className="page-title"><span className="eyebrow">{practice ? "LEARN BY DOING" : "PUT IT TOGETHER"}</span><h1>{practice ? "실습 문제" : "주차별 과제"}</h1><p>{practice ? "직접 쓰고, 실행하고, 고치면서 이해해 보세요." : "배운 내용을 연결해 하나의 프로그램으로 완성합니다."}</p><span className="meta">{docs.length}개의 {practice ? "실습" : "과제"}</span></header><ResourceList docs={docs.map(withoutBody)} practice={practice} /><Footer /></div>;
}
