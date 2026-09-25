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
  const seen = new Set<string>();
  return files.map(({ name, source }) => {
    const match = /^week-(\d+)(?:-(\d+))?\.md$/i.exec(name);
    if (!match) throw new Error(`${name}: 강의 파일명은 week-주차.md 또는 week-주차-강의번호.md 형식이어야 합니다.`);
    const week = Number(match[1]);
    const hasExplicitOrder = match[2] !== undefined;
    const order = hasExplicitOrder ? Number(match[2]) : 1;
    if (!Number.isSafeInteger(week) || week < 0) throw new Error(`${name}: 주차는 0 이상의 정수여야 합니다.`);
    if (!Number.isSafeInteger(order) || order < 1) throw new Error(`${name}: 강의 번호는 1 이상의 정수여야 합니다.`);
    const position = `${week}/${order}`;
    if (seen.has(position)) throw new Error(`${name}: ${week}주차 ${order}번 강의 파일이 중복됩니다.`);
    seen.add(position);
    const tree = parseMarkdown(source, "md");
    const weekKey = `week-${String(week).padStart(2, "0")}`;
    const key = hasExplicitOrder ? `${weekKey}-${String(order).padStart(2, "0")}` : weekKey;
    const title = resolvedTitles[key]?.trim()
      || (order === 1 ? resolvedTitles[weekKey]?.trim() : undefined)
      || (hasExplicitOrder
        ? `Week ${String(week).padStart(2, "0")} · Lecture ${String(order).padStart(2, "0")}`
        : `Week ${String(week).padStart(2, "0")} 강의노트`);
    const paragraph = tree.children.find(node => node.type === "paragraph");
    const description = paragraph ? toString(paragraph).replace(/\s+/g, " ").slice(0, 140) : `${week}주차 ${order}번 C++ 강의노트입니다.`;
    return { title, description, week, order, published: true, slug: [key], path: `/lectures/${key}`, kind: "lectures" as const, content: source, format: "md" as const };
  }).sort((a, b) => a.week - b.week || a.order - b.order);
}
