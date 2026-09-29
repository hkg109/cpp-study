"use client";

import { Bookmark, BookOpenText, Highlighter, MessageSquareText, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { listStudyRecords, removeStudyRecord, saveStudyRecord, type QuizResult, type StudyColor, type StudyRecord } from "@/lib/study-store";

type SelectionInfo = { blockId: string; text: string; startOffset: number; endOffset: number; x: number; y: number };
const colors: StudyColor[] = ["yellow", "blue", "red", "green", "purple"];

function textRange(block: Element, start: number, end: number) {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let offset = 0, startSet = false, node: Node | null;
  while ((node = walker.nextNode())) {
    const next = offset + (node.textContent?.length ?? 0);
    if (!startSet && start <= next) { range.setStart(node, Math.max(0, start - offset)); startSet = true; }
    if (startSet && end <= next) { range.setEnd(node, Math.max(0, end - offset)); return range; }
    offset = next;
  }
  return undefined;
}

export function StudyWorkspace({ documentPath, children }: { documentPath: string; children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [selection, setSelection] = useState<SelectionInfo>();
  const [memoSelection, setMemoSelection] = useState<SelectionInfo>();
  const [memoText, setMemoText] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState("");

  const reload = useCallback(async () => setRecords(await listStudyRecords(documentPath)), [documentPath]);
  useEffect(() => {
    let cancelled = false;
    void listStudyRecords(documentPath).then(next => { if (!cancelled) setRecords(next); });
    return () => { cancelled = true; };
  }, [documentPath]);
  useEffect(() => {
    const id = "cpp-study-highlight-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = "::highlight(cpp-yellow){background:#fde04799}::highlight(cpp-blue){background:#60a5fa70}::highlight(cpp-red){background:#f8717170}::highlight(cpp-green){background:#4ade8070}::highlight(cpp-purple){background:#c084fc70}";
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const highlights = (CSS as typeof CSS & { highlights?: Map<string, Highlight> }).highlights;
    if (!highlights || !rootRef.current) return;
    for (const color of colors) highlights.delete(`cpp-${color}`);
    for (const color of colors) {
      const ranges = records.filter(record => record.type === "highlight" && record.color === color).flatMap(record => {
        let block = rootRef.current?.querySelector(`[data-block-id="${CSS.escape(record.blockId)}"]`);
        if (!block && record.selectedText) block = [...(rootRef.current?.querySelectorAll("[data-block-id]") ?? [])].find(candidate => candidate.textContent?.includes(record.selectedText!)) ?? null;
        const range = block && record.startOffset !== undefined && record.endOffset !== undefined ? textRange(block, record.startOffset, record.endOffset) : undefined;
        return range ? [range] : [];
      });
      if (ranges.length) highlights.set(`cpp-${color}`, new Highlight(...ranges));
    }
    return () => { for (const color of colors) highlights.delete(`cpp-${color}`); };
  }, [records]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll(".has-study-memo,.has-study-bookmark").forEach(element => element.classList.remove("has-study-memo", "has-study-bookmark"));
    root.querySelectorAll<HTMLButtonElement>("[data-quiz-result]").forEach(button => { button.classList.remove("selected"); button.setAttribute("aria-pressed", "false"); });
    root.querySelectorAll<HTMLButtonElement>("[data-card-result]").forEach(button => { button.classList.remove("selected"); button.setAttribute("aria-pressed", "false"); });
    for (const record of records) {
      if (record.type === "memo" || record.type === "bookmark") root.querySelector(`[data-block-id="${CSS.escape(record.blockId)}"]`)?.classList.add(`has-study-${record.type}`);
      if (record.type === "quiz" && record.quizResult) {
        const button = root.querySelector<HTMLButtonElement>(`[data-quiz-id="${CSS.escape(record.blockId)}"][data-quiz-result="${record.quizResult}"]`);
        button?.classList.add("selected"); button?.setAttribute("aria-pressed", "true");
      }
      if (record.type === "flashcard" && record.quizResult) {
        const button = root.querySelector<HTMLButtonElement>(`[data-card-id="${CSS.escape(record.blockId)}"][data-card-result="${record.quizResult}"]`);
        button?.classList.add("selected"); button?.setAttribute("aria-pressed", "true");
      }
    }
  }, [records]);

  useEffect(() => {
    const blockId = new URLSearchParams(window.location.search).get("studyBlock");
    if (blockId) setTimeout(() => rootRef.current?.querySelector(`[data-block-id="${CSS.escape(blockId)}"], [data-quiz-id="${CSS.escape(blockId)}"], [data-card-id="${CSS.escape(blockId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  }, []);

  const captureSelection = () => {
    const selected = window.getSelection();
    if (!selected || selected.isCollapsed || !selected.rangeCount || !rootRef.current) { setSelection(undefined); return; }
    const range = selected.getRangeAt(0);
    const startElement = range.startContainer.parentElement;
    const endElement = range.endContainer.parentElement;
    const block = startElement?.closest<HTMLElement>("[data-block-id]");
    if (!block || block !== endElement?.closest("[data-block-id]") || !rootRef.current.contains(block)) { setSelection(undefined); return; }
    const before = document.createRange(); before.selectNodeContents(block); before.setEnd(range.startContainer, range.startOffset);
    const through = document.createRange(); through.selectNodeContents(block); through.setEnd(range.endContainer, range.endOffset);
    const rect = range.getBoundingClientRect();
    setSelection({ blockId: block.dataset.blockId!, text: selected.toString().trim(), startOffset: before.toString().length, endOffset: through.toString().length, x: rect.left + rect.width / 2, y: rect.top });
    setActiveBlockId(block.dataset.blockId!);
  };

  const addHighlight = async (color: StudyColor) => {
    if (!selection?.text) return;
    const now = new Date().toISOString();
    await saveStudyRecord({ id: crypto.randomUUID(), documentPath, blockId: selection.blockId, type: "highlight", selectedText: selection.text, startOffset: selection.startOffset, endOffset: selection.endOffset, color, createdAt: now, updatedAt: now });
    window.getSelection()?.removeAllRanges(); setSelection(undefined); await reload(); setPanelOpen(true);
  };

  const openMemoDialog = () => {
    if (!selection?.text) return;
    setMemoSelection(selection);
    setMemoText("");
    setSelection(undefined);
    window.getSelection()?.removeAllRanges();
  };

  const closeMemoDialog = () => { setMemoSelection(undefined); setMemoText(""); };

  const saveMemo = async () => {
    const memo = memoText.trim();
    if (!memoSelection || !memo) return;
    const now = new Date().toISOString();
    await saveStudyRecord({ id: crypto.randomUUID(), documentPath, blockId: memoSelection.blockId, type: "memo", selectedText: memoSelection.text, startOffset: memoSelection.startOffset, endOffset: memoSelection.endOffset, memo, createdAt: now, updatedAt: now });
    closeMemoDialog();
    await reload();
    setPanelOpen(true);
  };

  const addBookmark = async () => {
    if (!activeBlockId || records.some(record => record.type === "bookmark" && record.blockId === activeBlockId)) return;
    const block = rootRef.current?.querySelector(`[data-block-id="${CSS.escape(activeBlockId)}"]`);
    const now = new Date().toISOString();
    await saveStudyRecord({ id: crypto.randomUUID(), documentPath, blockId: activeBlockId, type: "bookmark", selectedText: block?.textContent?.trim().slice(0, 120), createdAt: now, updatedAt: now });
    await reload(); setPanelOpen(true);
  };

  const setQuizResult = async (quizId: string, result: QuizResult) => {
    const id = `quiz:${documentPath}:${quizId}`;
    const previous = records.find(record => record.id === id);
    const now = new Date().toISOString();
    await saveStudyRecord({ id, documentPath, blockId: quizId, type: "quiz", quizResult: result, createdAt: previous?.createdAt ?? now, updatedAt: now });
    await reload();
  };

  const setCardResult = async (cardId: string, result: QuizResult) => {
    const id = `flashcard:${documentPath}:${cardId}`;
    const previous = records.find(record => record.id === id);
    const now = new Date().toISOString();
    await saveStudyRecord({ id, documentPath, blockId: cardId, type: "flashcard", quizResult: result, createdAt: previous?.createdAt ?? now, updatedAt: now });
    await reload();
  };

  const handleClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const resultButton = target.closest<HTMLButtonElement>("[data-quiz-result]");
    if (resultButton) { void setQuizResult(resultButton.dataset.quizId!, resultButton.dataset.quizResult as QuizResult); return; }
    const cardButton = target.closest<HTMLButtonElement>("[data-card-result]");
    if (cardButton) { void setCardResult(cardButton.dataset.cardId!, cardButton.dataset.cardResult as QuizResult); return; }
    const blank = target.closest<HTMLButtonElement>(".study-blank");
    if (blank) { blank.classList.toggle("revealed"); blank.setAttribute("aria-expanded", String(blank.classList.contains("revealed"))); return; }
    const block = target.closest<HTMLElement>("[data-block-id]");
    if (block) setActiveBlockId(block.dataset.blockId ?? "");
  };

  const remove = async (id: string) => { await removeStudyRecord(id); await reload(); };
  const jump = (record: StudyRecord) => rootRef.current?.querySelector(`[data-block-id="${CSS.escape(record.blockId)}"], [data-quiz-id="${CSS.escape(record.blockId)}"], [data-card-id="${CSS.escape(record.blockId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  return <div ref={rootRef} className="study-workspace" onMouseUp={captureSelection} onTouchEnd={() => setTimeout(captureSelection, 0)} onClick={handleClick}>
    <div className="study-floating-actions"><button type="button" onClick={() => setPanelOpen(true)}><BookOpenText size={16} />학습 도구{records.length > 0 && <span>{records.length}</span>}</button><button type="button" disabled={!activeBlockId} onClick={addBookmark} title="마지막으로 선택한 문단 북마크"><Bookmark size={16} />북마크</button></div>
    <div data-study-content>{children}</div>
    {selection && <div className="selection-toolbar" style={{ left: selection.x, top: selection.y }} role="toolbar" aria-label="선택 영역 학습 도구">{colors.map(color => <button key={color} className={`selection-color ${color}`} aria-label={`${color} 형광펜`} onClick={() => void addHighlight(color)} />)}<button aria-label="메모 추가" onClick={openMemoDialog}><MessageSquareText size={15} /></button><button aria-label="선택 메뉴 닫기" onClick={() => setSelection(undefined)}><X size={15} /></button></div>}
    {memoSelection && <><button type="button" className="memo-dialog-overlay" onClick={closeMemoDialog} aria-label="메모 작성 취소" /><section className="memo-dialog" role="dialog" aria-modal="true" aria-labelledby="memo-dialog-title" aria-describedby="memo-dialog-description" onKeyDown={event => { if (event.key === "Escape") closeMemoDialog(); if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); void saveMemo(); } }}>
      <header><div className="memo-dialog-icon"><MessageSquareText size={18} /></div><div><span>STUDY MEMO</span><h2 id="memo-dialog-title">메모 남기기</h2></div><button type="button" onClick={closeMemoDialog} aria-label="메모 작성 창 닫기"><X size={18} /></button></header>
      <p id="memo-dialog-description">선택한 문장에 생각, 질문 또는 암기할 내용을 기록하세요.</p>
      <blockquote>{memoSelection.text}</blockquote>
      <label htmlFor="study-memo">메모 내용</label>
      <textarea id="study-memo" autoFocus maxLength={500} value={memoText} onChange={event => setMemoText(event.target.value)} placeholder="예: 시험 전에 상태 변화 방향을 다시 확인하기" />
      <div className="memo-dialog-footer"><span>{memoText.length} / 500 · Ctrl(⌘) + Enter로 저장</span><div><button type="button" className="memo-cancel" onClick={closeMemoDialog}>취소</button><button type="button" className="memo-save" disabled={!memoText.trim()} onClick={() => void saveMemo()}>메모 저장</button></div></div>
    </section></>}
    <aside className={`study-panel${panelOpen ? " open" : ""}`} aria-hidden={!panelOpen} inert={!panelOpen}><header><div><strong>학습 도구</strong><span>이 브라우저에 자동 저장됩니다.</span></div><button onClick={() => setPanelOpen(false)} aria-label="학습 패널 닫기"><X size={18} /></button></header><div className="study-panel-content">
      {records.length === 0 ? <p className="study-empty"><Highlighter size={20} />문장을 드래그해 형광펜이나 메모를 남기고, 문단을 선택해 북마크하세요.</p> : records.map(record => <article key={record.id} className={`study-record ${record.type}`}><button className="study-record-main" onClick={() => jump(record)}><span>{record.type === "highlight" ? `${record.color} 형광펜` : record.type === "memo" ? "메모" : record.type === "bookmark" ? "북마크" : `${record.type === "flashcard" ? "카드" : "문제"}: ${record.quizResult === "correct" ? "맞음" : record.quizResult === "unsure" ? "헷갈림" : "틀림"}`}</span>{record.selectedText && <q>{record.selectedText}</q>}{record.memo && <p>{record.memo}</p>}</button><button className="study-record-delete" onClick={() => void remove(record.id)} aria-label="학습 기록 삭제"><Trash2 size={14} /></button></article>)}
    </div></aside><button className={`study-panel-overlay${panelOpen ? " open" : ""}`} onClick={() => setPanelOpen(false)} aria-label="학습 패널 닫기" />
  </div>;
}
