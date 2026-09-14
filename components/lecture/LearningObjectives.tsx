export function LearningObjectives({ objectives }: { objectives?: string[] }) {
  if (!objectives?.length) return null;
  return <section className="objectives" aria-label="학습 목표"><h2>이번 강의에서 배울 것</h2><ul>{objectives.map(objective => <li key={objective}><span aria-hidden="true">□</span>{objective}</li>)}</ul></section>;
}
