import { Info, TriangleAlert } from "lucide-react";

export function Callout({ type = "info", children }: { type?: "info" | "warning"; children: React.ReactNode }) {
  return <aside className={`callout ${type}`} role="note">{type === "warning" ? <TriangleAlert size={18} /> : <Info size={18} />}<div><span className="callout-label">{type === "warning" ? "주의하세요" : "기억해 두세요"}</span>{children}</div></aside>;
}
