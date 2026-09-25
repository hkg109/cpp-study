"use client";

import { FileDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type PrintTheme = "light" | "dark";

interface PrintState {
  title: string;
  answerStates: boolean[];
}

export function PrintLectureButton({ title }: { title: string }) {
  const { resolvedTheme } = useTheme();
  const printState = useRef<PrintState | null>(null);
  const choseTheme = useRef(false);
  const [theme, setTheme] = useState<PrintTheme>("light");

  useEffect(() => {
    if (!choseTheme.current && resolvedTheme) setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  const preparePrint = useCallback(() => {
    if (printState.current) return;
    const answers = [...document.querySelectorAll<HTMLDetailsElement>("details.answer")];
    printState.current = { title: document.title, answerStates: answers.map(answer => answer.open) };

    for (const answer of answers) answer.open = true;
    document.documentElement.classList.add("printing-document", `print-theme-${theme}`);
    document.title = `${title.replace(/[\\/:*?"<>|]/g, "-")} - Handsome C++`;
  }, [theme, title]);

  const restorePage = useCallback(() => {
    const state = printState.current;
    if (!state) return;
    const answers = [...document.querySelectorAll<HTMLDetailsElement>("details.answer")];
    answers.forEach((answer, index) => { answer.open = state.answerStates[index] ?? false; });
    document.title = state.title;
    document.documentElement.classList.remove("printing-document", "print-theme-light", "print-theme-dark");
    printState.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("beforeprint", preparePrint);
    window.addEventListener("afterprint", restorePage);
    return () => {
      window.removeEventListener("beforeprint", preparePrint);
      window.removeEventListener("afterprint", restorePage);
      restorePage();
    };
  }, [preparePrint, restorePage]);

  const print = () => {
    preparePrint();
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };

  return <div className="document-print-controls">
    <label className="sr-only" htmlFor="lecture-print-theme">PDF 테마</label>
    <select
      id="lecture-print-theme"
      className="document-print-theme"
      value={theme}
      onChange={event => {
        choseTheme.current = true;
        setTheme(event.target.value as PrintTheme);
      }}
      aria-label="PDF 테마 선택"
    >
      <option value="light">기본 PDF</option>
      <option value="dark">다크 PDF</option>
    </select>
    <button type="button" className="document-print-button" onClick={print} aria-label="선택한 테마로 강의노트를 PDF로 저장">
      <FileDown size={15} />
      PDF로 저장
    </button>
  </div>;
}
