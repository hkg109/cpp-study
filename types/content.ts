export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ContentKind = "lectures" | "practice" | "assignments";

export interface LectureFrontmatter {
  title: string;
  description: string;
  week: number;
  order: number;
  duration?: number;
  difficulty?: Difficulty;
  tags?: string[];
  objectives?: string[];
  published: boolean;
  due?: string;
  submissionUrl?: string;
}

export interface LectureMeta extends LectureFrontmatter {
  slug: string[];
  path: string;
  kind: ContentKind;
}

export interface ContentDocument extends LectureMeta {
  content: string;
  format?: "md" | "mdx";
}

export interface Heading { id: string; text: string; level: number }
export interface SearchEntry {
  title: string;
  description: string;
  tags: string[];
  body: string;
  path: string;
  week: number;
  kind: ContentKind;
}
