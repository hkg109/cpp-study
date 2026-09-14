"use client";

import { Download, Edit3, RotateCcw, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { expandSlashShortcut } from "@/lib/admin-markdown";
import { remarkDocumentHeadings } from "@/lib/markdown";
import { loadNoteDraft, NOTE_FILE_STATUS_EVENT, NOTE_UPDATE_EVENT, removeNoteDraft, saveNoteDraft, type NoteFileStatus } from "@/lib/note-draft";
import { useAdmin } from "./AdminContext";

export function MarkdownEditor({ path, filename, source, children }: { path: string; filename: string; source: string; children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(source);
  const [loaded, setLoaded] = useState(false);
  const [fileStatus, setFileStatus] = useState<NoteFileStatus | "idle">("idle");

  useEffect(() => {
    const syncDraft = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; value: string }>).detail;
      if (detail.path === path) { setValue(detail.value); setLoaded(true); }
    };
    window.addEventListener(NOTE_UPDATE_EVENT, syncDraft);
    const syncFileStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ path: string; status: NoteFileStatus }>).detail;
      if (detail.path === path) setFileStatus(detail.status);
    };
    window.addEventListener(NOTE_FILE_STATUS_EVENT, syncFileStatus);
    return () => {
      window.removeEventListener(NOTE_UPDATE_EVENT, syncDraft);
      window.removeEventListener(NOTE_FILE_STATUS_EVENT, syncFileStatus);
    };
  }, [path]);

  const beginEditing = () => {
    if (!loaded) { setValue(loadNoteDraft(path, source)); setLoaded(true); }
    setEditing(true);
  };

  const update = (next: string) => { setValue(next); saveNoteDraft(path, next); };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const expanded = expandSlashShortcut(event.target.value, event.target.selectionStart);
    if (expanded) {
      update(expanded.value);
      requestAnimationFrame(() => event.target.setSelectionRange(expanded.caret, expanded.caret));
      return;
    }
    update(event.target.value);
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
  };

  if (!isAdmin || !editing) return <div className={isAdmin ? "admin-editable-note" : undefined} onClick={isAdmin ? beginEditing : undefined}>
    {isAdmin && <button className="admin-edit-hint" onClick={beginEditing}><Edit3 size={15} />본문 눌러서 수정</button>}
    <div className="prose">{children}</div>
  </div>;

  return <section className="markdown-editor" aria-label="문서 편집기">
    <div className="editor-toolbar"><div><span className="admin-live-dot" />관리자 편집 중 <span className={`editor-saved ${fileStatus === "error" ? "error" : ""}`}><Save size={13} />{fileStatus === "saving" ? "MD 파일 저장 중…" : fileStatus === "saved" ? "MD 파일 저장됨" : fileStatus === "error" ? "MD 파일 저장 실패" : "MD 파일 자동 저장"}</span></div><div className="editor-toolbar-actions">
      <button onClick={download}><Download size={15} />MD 받기</button>
      <button onClick={() => { setValue(source); removeNoteDraft(path, source); }}><RotateCcw size={15} />원본 복원</button>
      <button onClick={() => setEditing(false)} aria-label="편집기 닫기"><X size={16} />닫기</button>
    </div></div>
    <div className="editor-grid">
      <div className="editor-input-pane"><div className="editor-pane-label">MARKDOWN</div><textarea value={value} spellCheck={false} onChange={onChange} aria-label="마크다운 노트 내용" /></div>
      <div className="editor-preview-pane"><div className="editor-pane-label">실시간 미리보기</div><div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm, remarkDocumentHeadings]} components={{ table: ({ children: tableChildren }) => <div className="table-scroll"><table>{tableChildren}</table></div> }}>{value}</ReactMarkdown></div></div>
    </div>
  </section>;
}
