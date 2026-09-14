import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { readWeeks } from "./weeks";
import type { ContentDocument, ContentKind, LectureFrontmatter } from "@/types/content";

const positiveInteger = (value: unknown) => Number.isInteger(value) && Number(value) > 0;
const nonNegativeInteger = (value: unknown) => Number.isInteger(value) && Number(value) >= 0;

export function validateFrontmatter(data: Record<string, unknown>, file: string): LectureFrontmatter {
  const fail = (field: string): never => { throw new Error(`${file}: frontmatter '${field}' 값이 올바르지 않습니다.`); };
  if (typeof data.title !== "string" || !data.title.trim()) fail("title");
  if (typeof data.description !== "string") fail("description");
  if (!nonNegativeInteger(data.week)) fail("week");
  if (!positiveInteger(data.order)) fail("order");
  if (typeof data.published !== "boolean") fail("published");
  if (data.duration !== undefined && !positiveInteger(data.duration)) fail("duration");
  if (data.difficulty !== undefined && !["Beginner", "Intermediate", "Advanced"].includes(String(data.difficulty))) fail("difficulty");
  for (const field of ["tags", "objectives"]) {
    if (data[field] !== undefined && (!Array.isArray(data[field]) || !(data[field] as unknown[]).every(v => typeof v === "string" && v.trim()))) fail(field);
  }
  if (data.due !== undefined && (typeof data.due !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.due) || Number.isNaN(Date.parse(data.due)))) fail("due (YYYY-MM-DD 문자열)");
  if (data.submissionUrl !== undefined) {
    if (typeof data.submissionUrl !== "string") fail("submissionUrl");
    try { if (new URL(String(data.submissionUrl)).protocol !== "https:") fail("submissionUrl (HTTPS)"); }
    catch { fail("submissionUrl (HTTPS)"); }
  }
  // Only validated, serializable fields are exposed to the browser.
  return {
    title: data.title as string, description: data.description as string,
    week: data.week as number, order: data.order as number, published: data.published as boolean,
    ...(data.duration !== undefined && { duration: data.duration as number }),
    ...(data.difficulty !== undefined && { difficulty: data.difficulty as LectureFrontmatter["difficulty"] }),
    ...(data.tags !== undefined && { tags: data.tags as string[] }),
    ...(data.objectives !== undefined && { objectives: data.objectives as string[] }),
    ...(data.due !== undefined && { due: data.due as string }),
    ...(data.submissionUrl !== undefined && { submissionUrl: data.submissionUrl as string }),
  };
}

function walk(directory: string, filePattern: RegExp): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(target, filePattern);
    return entry.isFile() && filePattern.test(entry.name) ? [target] : [];
  });
}

export function readCollection(kind: ContentKind): ContentDocument[] {
  if (kind === "lectures") return readWeeks();
  const root = path.join(process.cwd(), "content");
  const directory = path.join(process.cwd(), "content", kind);
  const documents = walk(directory, kind === "practice" ? /\.md$/ : /\.mdx?$/).map(file => {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    const metadata = validateFrontmatter(data, path.relative(root, file));
    const slug = path.relative(directory, file).replace(/\.mdx?$/, "").split(path.sep);
    if (slug.some(part => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) throw new Error(`${file}: 소문자 영문, 숫자, 하이픈으로 파일명을 작성하세요.`);
    const expectedWeek = `week-${String(metadata.week).padStart(2, "0")}`;
    if (slug.length !== 1 || slug[0] !== expectedWeek) {
      throw new Error(`${file}: 파일 경로와 frontmatter의 week/order가 일치하지 않습니다.`);
    }
    // Practice files keep the .md extension but may use the trusted <Answer> toggle component.
    const format = kind === "practice" ? "mdx" as const : path.extname(file) === ".md" ? "md" as const : "mdx" as const;
    return { ...metadata, slug, path: `/${kind}/${slug.join("/")}`, kind, content, format };
  });
  const paths = new Set<string>();
  const positions = new Set<string>();
  for (const doc of documents) {
    const position = `${doc.week}/${doc.order}`;
    if (paths.has(doc.path) || positions.has(position)) throw new Error(`${kind}: 강의 경로 또는 week/order가 중복됩니다 (${doc.path}).`);
    paths.add(doc.path); positions.add(position);
  }
  return documents.filter(doc => doc.published).sort((a, b) => a.week - b.week || a.order - b.order);
}

export function getDocument(kind: ContentKind, slug: string[]) {
  // Resolve only from the published manifest; never read a user-supplied filesystem path.
  return readCollection(kind).find(doc => doc.slug.join("/") === slug.join("/"));
}

export function withoutBody({ content: _content, ...meta }: ContentDocument) {
  void _content;
  return meta;
}
