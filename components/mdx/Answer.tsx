export function Answer({ children }: { children: React.ReactNode }) {
  return <details className="answer"><summary><span className="answer-closed">정답 코드 보기</span><span className="answer-open">정답 코드 숨기기</span></summary><div>{children}</div></details>;
}
