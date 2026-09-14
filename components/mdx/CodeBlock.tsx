"use client";

import { Children, isValidElement, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

function textContent(node: ReactNode): string {
  return Children.toArray(node).map(child => typeof child === "string" || typeof child === "number" ? String(child) : isValidElement<{ children?: ReactNode }>(child) ? textContent(child.props.children) : "").join("");
}

export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre"> & { "data-raw"?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(props["data-raw"] ?? textContent(children).replace(/\n$/, ""));
      setStatus("copied");
    } catch { setStatus("failed"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  return <div className="code-block"><button onClick={copy} className="copy-button" aria-label="코드 복사">{status === "copied" ? <Check size={13} /> : <Copy size={13} />}{status === "copied" ? "복사 완료" : "Copy"}</button><pre {...props}>{children}</pre><span className="sr-only" role="status">{status === "copied" ? "코드가 복사되었습니다." : ""}</span>{status === "failed" && <div className="code-feedback" role="status">복사할 수 없습니다. 코드를 선택해 직접 복사해 주세요.</div>}</div>;
}
