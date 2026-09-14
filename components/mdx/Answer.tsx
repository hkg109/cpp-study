export function Answer({ children }: { children: React.ReactNode }) {
  return <details className="answer"><summary><span className="answer-closed">정답 보기</span><span className="answer-open">정답 숨기기</span></summary><div>{children}</div></details>;
}
