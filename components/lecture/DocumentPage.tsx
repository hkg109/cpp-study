import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { renderMDX } from "@/lib/mdx";
import { getPrevNextLecture } from "@/lib/lectures";
import type { ContentDocument } from "@/types/content";
import { PageTOC } from "@/components/layout/PageTOC";
import { Footer } from "@/components/layout/Footer";
import { LectureHeader } from "./LectureHeader";
import { LearningObjectives } from "./LearningObjectives";
import { ProgressCheck } from "./ProgressCheck";
import { PrevNextNavigation } from "./PrevNextNavigation";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { PrintLectureButton } from "./PrintLectureButton";

export async function DocumentPage({ document }: { document: ContentDocument }) {
  const { content, headings } = await renderMDX(document.content, document.format);
  const isLecture = document.kind === "lectures";
  const isEditable = process.env.NODE_ENV === "development" && (isLecture || document.kind === "practice");
  const label = isLecture ? "강의노트" : document.kind === "practice" ? "실습" : "과제";
  return <div className="document-grid"><article className="document-main">
    <div className="document-toolbar"><nav className="breadcrumb" aria-label="현재 위치"><Link href={`/${document.kind}`}>{label}</Link><ChevronRight size={13} /><span>Week {String(document.week).padStart(2, "0")}</span></nav>{isLecture && <PrintLectureButton title={document.title} />}</div>
    <LectureHeader lecture={document} hideDescription={isLecture} /><LearningObjectives objectives={document.objectives} />
    {document.kind === "assignments" && <div className="assignment-info"><div><span className="meta">제출 기한</span>{document.due ?? "멘토 공지 확인"}</div>{document.submissionUrl ? <a href={document.submissionUrl} target="_blank" rel="noopener noreferrer" className="button">과제 제출하기<ArrowUpRight size={16} /></a> : <span className="muted">제출 링크는 멘토가 안내합니다.</span>}</div>}
    {isEditable ? <MarkdownEditor path={document.path} filename={`${document.slug.at(-1) ?? "document"}.${document.kind === "practice" || document.format === "md" ? "md" : "mdx"}`} source={document.content}>{content}</MarkdownEditor> : <div className="prose">{content}</div>}
    {isLecture ? <><ProgressCheck slug={document.slug.join("/")} /><PrevNextNavigation {...getPrevNextLecture(document.slug)} /></> : <div className="prev-next"><Link href={`/${document.kind}`}><span>목록으로 돌아가기</span><strong>전체 {label} 보기</strong></Link></div>}
    <Footer />
  </article><PageTOC key={document.path} headings={headings} documentPath={isEditable ? document.path : undefined} format={document.format} /></div>;
}
