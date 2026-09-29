export type StudyColor = "yellow" | "blue" | "red" | "green" | "purple";
export type QuizResult = "correct" | "unsure" | "wrong";

export interface StudyRecord {
  id: string;
  documentPath: string;
  blockId: string;
  type: "highlight" | "memo" | "bookmark" | "quiz" | "flashcard";
  selectedText?: string;
  startOffset?: number;
  endOffset?: number;
  color?: StudyColor;
  memo?: string;
  quizResult?: QuizResult;
  createdAt: string;
  updatedAt: string;
}

const DB_NAME = "cpp-study-data";
const STORE_NAME = "study-records";

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("documentPath", "documentPath");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function listStudyRecords(documentPath: string): Promise<StudyRecord[]> {
  if (typeof indexedDB === "undefined") return [];
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).index("documentPath").getAll(documentPath);
    request.onsuccess = () => resolve(request.result as StudyRecord[]);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export async function listAllStudyRecords(): Promise<StudyRecord[]> {
  if (typeof indexedDB === "undefined") return [];
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StudyRecord[]);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export async function saveStudyRecord(record: StudyRecord) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function removeStudyRecord(id: string) {
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}
