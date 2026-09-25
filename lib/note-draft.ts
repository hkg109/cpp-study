export const NOTE_STORAGE_PREFIX = "handsome-cpp-note-v2:";
export const NOTE_UPDATE_EVENT = "handsome-cpp-note-update";
export const NOTE_TITLE_EVENT = "handsome-cpp-title-update";
export const PRACTICE_METADATA_EVENT = "handsome-cpp-practice-metadata-update";
export const NOTE_FILE_STATUS_EVENT = "handsome-cpp-note-file-status";
export type NoteFileStatus = "saving" | "saved" | "error";

const saveTimers = new Map<string, ReturnType<typeof setTimeout>>();

function announceFileStatus(path: string, status: NoteFileStatus) {
  window.dispatchEvent(new CustomEvent(NOTE_FILE_STATUS_EVENT, { detail: { path, status } }));
}

function queueFileSave(path: string, payload: { content: string } | { title: string } | { title: string; description: string }, timerKey = path) {
  const [kind, week] = path.split("/").filter(Boolean);
  const validDocumentId = kind === "lectures" ? /^week-\d+(?:-\d+)?$/ : /^week-\d+$/;
  if (!week || !["lectures", "practice"].includes(kind) || !validDocumentId.test(week)) { announceFileStatus(path, "error"); return; }
  const previous = saveTimers.get(timerKey);
  if (previous) clearTimeout(previous);
  announceFileStatus(path, "saving");
  saveTimers.set(timerKey, setTimeout(async () => {
    saveTimers.delete(timerKey);
    try {
      const response = await fetch(`/api/admin/notes/${encodeURIComponent(week)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...payload }),
      });
      if (response.ok && "content" in payload) {
        try {
          const key = NOTE_STORAGE_PREFIX + path;
          if (localStorage.getItem(key) === payload.content) localStorage.removeItem(key);
        } catch { /* Saving the file succeeded; clearing the recovery draft is optional. */ }
      }
      announceFileStatus(path, response.ok ? "saved" : "error");
    } catch { announceFileStatus(path, "error"); }
  }, 650));
}

export function loadNoteDraft(path: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  try { return localStorage.getItem(NOTE_STORAGE_PREFIX + path) ?? fallback; }
  catch { return fallback; }
}

export function saveNoteDraft(path: string, value: string) {
  try { localStorage.setItem(NOTE_STORAGE_PREFIX + path, value); } catch { /* Keep the in-memory edit. */ }
  window.dispatchEvent(new CustomEvent(NOTE_UPDATE_EVENT, { detail: { path, value } }));
  queueFileSave(path, { content: value });
}

export function saveNoteTitle(path: string, title: string) {
  window.dispatchEvent(new CustomEvent(NOTE_TITLE_EVENT, { detail: { path, title } }));
  if (title.trim()) queueFileSave(path, { title }, `title:${path}`);
}

export interface PracticeMetadata { title: string; description: string }

export function savePracticeMetadata(path: string, metadata: PracticeMetadata) {
  window.dispatchEvent(new CustomEvent(PRACTICE_METADATA_EVENT, { detail: { path, ...metadata } }));
  if (metadata.title.trim()) queueFileSave(path, metadata, `metadata:${path}`);
}

export function removeNoteDraft(path: string, source: string) {
  try { localStorage.removeItem(NOTE_STORAGE_PREFIX + path); } catch { /* Keep the in-memory reset. */ }
  window.dispatchEvent(new CustomEvent(NOTE_UPDATE_EVENT, { detail: { path, value: source } }));
  queueFileSave(path, { content: source });
}
