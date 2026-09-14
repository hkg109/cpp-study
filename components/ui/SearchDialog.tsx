"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { SearchEntry } from "@/types/content";
import { NOTE_TITLE_EVENT, NOTE_UPDATE_EVENT, PRACTICE_METADATA_EVENT } from "@/lib/note-draft";

export function SearchDialog({ entries, open, setOpen }: { entries: SearchEntry[]; open: boolean; setOpen: (open: boolean) => void }) {
  const [entryPatches, setEntryPatches] = useState<Record<string, Partial<SearchEntry>>>({});
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const liveEntries = useMemo(() => entries.map(entry => ({ ...entry, ...entryPatches[entry.path] })), [entries, entryPatches]);
  const fuse = useMemo(() => new Fuse(liveEntries, { keys: [{ name: "title", weight: 4 }, { name: "tags", weight: 3 }, { name: "description", weight: 2 }, { name: "body", weight: 1 }], threshold: 0.3, ignoreLocation: true }), [liveEntries]);
  const results = useMemo(() => query.trim() ? fuse.search(query.trim()).slice(0, 12).map(result => result.item) : liveEntries.slice(0, 8), [query, fuse, liveEntries]);
  useEffect(() => {
    const updateEntry = (path: string, patch: Partial<SearchEntry>) => {
      setEntryPatches(current => ({ ...current, [path]: { ...current[path], ...patch } }));
    };
    const syncBody = (event: Event) => {
      const { path, value } = (event as CustomEvent<{ path: string; value: string }>).detail;
      updateEntry(path, { body: value });
    };
    const syncTitle = (event: Event) => {
      const { path, title } = (event as CustomEvent<{ path: string; title: string }>).detail;
      updateEntry(path, { title });
    };
    const syncPracticeMetadata = (event: Event) => {
      const { path, title, description } = (event as CustomEvent<{ path: string; title: string; description: string }>).detail;
      updateEntry(path, { title, description });
    };
    window.addEventListener(NOTE_UPDATE_EVENT, syncBody);
    window.addEventListener(NOTE_TITLE_EVENT, syncTitle);
    window.addEventListener(PRACTICE_METADATA_EVENT, syncPracticeMetadata);
    return () => {
      window.removeEventListener(NOTE_UPDATE_EVENT, syncBody);
      window.removeEventListener(NOTE_TITLE_EVENT, syncTitle);
      window.removeEventListener(PRACTICE_METADATA_EVENT, syncPracticeMetadata);
    };
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(!open); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  useEffect(() => { if (open) document.getElementById(`search-result-${selected}`)?.scrollIntoView({ block: "nearest" }); }, [selected, open]);
  function close() { setOpen(false); setQuery(""); setSelected(0); }
  return <Dialog.Root open={open} onOpenChange={value => value ? setOpen(true) : close()}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="search-dialog" onOpenAutoFocus={event => { event.preventDefault(); input.current?.focus(); }}>
    <Dialog.Title className="sr-only">학습 자료 검색</Dialog.Title><Dialog.Description className="sr-only">제목, 태그와 본문으로 검색합니다. 방향키로 결과를 선택하고 Enter로 이동하세요.</Dialog.Description>
    <div className="search-input-row"><Search size={21} /><input ref={input} value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} placeholder="무엇을 배우고 싶나요?" aria-label="검색어" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="search-results" aria-activedescendant={results[selected] ? `search-result-${selected}` : undefined} onKeyDown={event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setSelected(index => Math.max(0, Math.min(results.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))); }
      if (event.key === "Enter" && results[selected]) { event.preventDefault(); router.push(results[selected].path); close(); }
    }} /><Dialog.Close asChild><button className="icon-button" aria-label="검색 닫기"><X size={20} /></button></Dialog.Close></div>
    <div className="search-results"><div className="nav-label">{query ? "SEARCH RESULTS" : "EXPLORE THE NOTES"}</div><p className="sr-only" role="status">{results.length}개의 검색 결과</p><ul id="search-results" role="listbox" aria-label="검색 결과">{results.map((entry, index) => <li id={`search-result-${index}`} key={entry.path} role="option" aria-selected={index === selected}><Link href={entry.path} onClick={close} className={`search-result ${index === selected ? "active" : ""}`} onMouseEnter={() => setSelected(index)} tabIndex={-1}><div><strong>{entry.title}</strong>{entry.description && <p>{entry.description}</p>}<span className="meta">{entry.kind === "lectures" ? "강의노트" : entry.kind === "practice" ? "실습" : "과제"} · Week {String(entry.week).padStart(2, "0")}</span></div><ArrowUpRight size={18} /></Link></li>)}</ul>{!results.length && <div className="empty-state">검색 결과가 없습니다.<p>다른 단어나 짧은 키워드로 검색해 보세요.</p></div>}</div>
    <div className="search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> 선택</span><span><kbd>Enter</kbd> 이동</span><span><kbd>Esc</kbd> 닫기</span></div>
  </Dialog.Content></Dialog.Portal></Dialog.Root>;
}
