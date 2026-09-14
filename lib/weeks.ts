import fs from "node:fs";
import path from "node:path";
import generated from "./weeks.generated.json";
import { toString } from "mdast-util-to-string";
import { parseMarkdown } from "./markdown";
import type { ContentDocument } from "@/types/content";

export function loadWeekTitles(file = path.resolve(process.cwd(), "content", "weeks", "titles.json")): Record<string, string> {
  const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${file}: 강의 제목 파일은 JSON 객체여야 합니다.`);
  }
  return Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}

export function readWeeks(files: { name: string; source: string }[] = generated, titles?: Record<string, string>): ContentDocument[] {
  const resolvedTitles = titles ?? (files === generated ? loadWeekTitles() : {});
  const seen = new Set<number>();
  return files.map(({ name, source }) => {
    const week = Number(/^week-(\d+)\.md$/i.exec(name)![1]);
    if (!Number.isSafeInteger(week) || week < 0) throw new Error(`${name}: 주차는 0 이상의 정수여야 합니다.`);
    if (seen.has(week)) throw new Error(`${name}: ${week}주차 파일이 중복됩니다.`);
    seen.add(week);
    const tree = parseMarkdown(source, "md");
    const key = `week-${String(week).padStart(2, "0")}`;
    const title = resolvedTitles[key]?.trim() || `Week ${String(week).padStart(2, "0")} 강의노트`;
    const paragraph = tree.children.find(node => node.type === "paragraph");
    const description = paragraph ? toString(paragraph).replace(/\s+/g, " ").slice(0, 140) : `${week}주차 C++ 강의노트입니다.`;
    return { title, description, week, order: 1, published: true, slug: [`week-${String(week).padStart(2, "0")}`], path: `/lectures/week-${String(week).padStart(2, "0")}`, kind: "lectures" as const, content: source, format: "md" as const };
  }).sort((a, b) => a.week - b.week);
}
