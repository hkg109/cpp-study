import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { LectureMeta } from "@/types/content";

export function PrevNextNavigation({ prev, next }: { prev?: LectureMeta; next?: LectureMeta }) {
  return <nav className="prev-next" aria-label="이전 및 다음 강의">
    {prev ? <Link href={prev.path}><span><ArrowLeft size={15} />이전 강의</span><strong>{prev.title}</strong></Link> : <div />}
    {next ? <Link href={next.path} className="next"><span>다음 강의<ArrowRight size={15} /></span><strong>{next.title}</strong></Link> : <Link href="/lectures" className="next"><span>커리큘럼으로<ArrowRight size={15} /></span><strong>전체 강의 살펴보기</strong></Link>}
  </nav>;
}
