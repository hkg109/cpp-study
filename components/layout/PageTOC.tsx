"use client";

import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/types/content";
import { getHeadings } from "@/lib/markdown";
import { NOTE_UPDATE_EVENT } from "@/lib/note-draft";

export function PageTOC({ headings, documentPath, format = "mdx" }: { headings: Heading[]; documentPath?: string; format?: "md" | "mdx" }) {
  const [liveHeadings, setLiveHeadings] = useState(headings);
  const [active, setActive] = useState(headings[0]?.id ?? "");
  const tocRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!documentPath) return;
    const syncHeadings = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; value: string }>).detail;
      if (detail.path === documentPath) setLiveHeadings(getHeadings(detail.value, format));
    };
    window.addEventListener(NOTE_UPDATE_EVENT, syncHeadings);
    return () => window.removeEventListener(NOTE_UPDATE_EVENT, syncHeadings);
  }, [documentPath, format]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        let current = liveHeadings[0]?.id ?? "";
        for (const heading of liveHeadings) {
          const element = document.getElementById(heading.id);
          if (element && element.getBoundingClientRect().top <= 150) current = heading.id;
        }
        setActive(current);
      });
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); };
  }, [liveHeadings]);
  useEffect(() => {
    const container = tocRef.current;
    const link = container?.querySelector<HTMLElement>(`[data-heading-id="${CSS.escape(active)}"]`);
    if (!container || !link) return;
    const top = link.offsetTop;
    const bottom = top + link.offsetHeight;
    if (top < container.scrollTop + 42) container.scrollTo({ top: Math.max(0, top - 42) });
    else if (bottom > container.scrollTop + container.clientHeight - 24) container.scrollTo({ top: bottom - container.clientHeight + 24 });
  }, [active]);
  return <aside ref={tocRef} className="page-toc"><nav aria-label="이 페이지의 목차"><p className="nav-label">ON THIS PAGE</p>{liveHeadings.map(heading => <a key={heading.id} href={`#${heading.id}`} data-heading-id={heading.id} className={`${heading.level >= 3 ? "nested" : ""} level-${heading.level} ${heading.id === active ? "active" : ""}`} aria-current={heading.id === active ? "location" : undefined}>{heading.text}</a>)}</nav><div className="toc-bottom"><span>C++ STUDY NOTES</span><p>조금씩, 확실하게.</p></div></aside>;
}
