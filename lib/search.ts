import { readCollection } from "./content";
import { markdownText } from "./markdown";
import type { SearchEntry } from "@/types/content";

export function getSearchIndex(): SearchEntry[] {
  return (["lectures", "practice"] as const).flatMap(kind =>
    readCollection(kind).map(doc => ({
      title: doc.title, description: doc.description, tags: doc.tags ?? [],
      body: markdownText(doc.content, doc.format), path: doc.path, week: doc.week, kind,
    })),
  );
}
