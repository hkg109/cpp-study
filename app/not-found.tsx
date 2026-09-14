import Link from "next/link";
export default function NotFound() {
  return <div className="index-page empty-state"><span className="eyebrow">404 / NOT FOUND</span><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 변경되었거나 아직 공개되지 않은 학습 자료입니다.</p><Link href="/lectures" className="button primary">강의 목록으로 돌아가기</Link></div>;
}
