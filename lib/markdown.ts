import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Blockquote, Parent, PhrasingContent, Root, RootContent, Text } from "mdast";
import type { Properties } from "hast";
import type { Heading } from "@/types/content";

const CALLOUTS = {
  DEFINITION: { type: "definition", label: "정의" },
  EXAM: { type: "exam", label: "시험 포인트" },
  CAUTION: { type: "caution", label: "주의" },
  EXAMPLE: { type: "example", label: "예시" },
  ADVANCED: { type: "advanced", label: "심화" },
} as const;
const BLOCK_TYPES = new Set(["heading", "paragraph", "blockquote", "list", "table"]);

function stableHash(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function setProperties(node: RootContent, properties: Properties, hName?: string) {
  node.data = { ...node.data, ...(hName ? { hName } : {}), hProperties: { ...node.data?.hProperties, ...properties } };
}

function transformHighlights(tree: Root) {
  visit(tree, "text", (node: Text, index, parent: Parent | undefined) => {
    if (index === undefined || !parent || parent.type === "inlineCode" || parent.type === "code") return;
    const expression = /==(?:(yellow|blue|red|green|purple):)?([^=\n]+)==/g;
    if (!expression.test(node.value)) return;
    expression.lastIndex = 0;
    const children: PhrasingContent[] = [];
    let cursor = 0;
    for (const match of node.value.matchAll(expression)) {
      const offset = match.index ?? 0;
      if (offset > cursor) children.push({ type: "text", value: node.value.slice(cursor, offset) });
      const color = match[1] ?? "yellow";
      children.push({
        type: "emphasis",
        children: [{ type: "text", value: match[2] }],
        data: { hName: "mark", hProperties: { className: ["study-mark", `study-mark-${color}`], "data-highlight-color": color } },
      });
      cursor = offset + match[0].length;
    }
    if (cursor < node.value.length) children.push({ type: "text", value: node.value.slice(cursor) });
    parent.children.splice(index, 1, ...children as RootContent[]);
    return index + children.length;
  });
}

function transformBlanks(tree: Root) {
  visit(tree, "text", (node: Text, index, parent: Parent | undefined) => {
    if (index === undefined || !parent || parent.type === "inlineCode" || parent.type === "code") return;
    const expression = /\{\{([^{}\n]+)\}\}/g;
    if (!expression.test(node.value)) return;
    expression.lastIndex = 0;
    const children: PhrasingContent[] = [];
    let cursor = 0;
    for (const match of node.value.matchAll(expression)) {
      const offset = match.index ?? 0;
      if (offset > cursor) children.push({ type: "text", value: node.value.slice(cursor, offset) });
      children.push({ type: "emphasis", children: [{ type: "text", value: match[1] }], data: { hName: "button", hProperties: { type: "button", className: ["study-blank"], "data-blank-answer": match[1], "aria-label": "빈칸 정답 확인", "aria-expanded": "false" } } });
      cursor = offset + match[0].length;
    }
    if (cursor < node.value.length) children.push({ type: "text", value: node.value.slice(cursor) });
    parent.children.splice(index, 1, ...children as RootContent[]);
    return index + children.length;
  });
}

function transformCallouts(tree: Root) {
  visit(tree, "blockquote", (node: Blockquote) => {
    const first = node.children[0];
    if (first?.type !== "paragraph") return;
    const marker = first.children[0];
    if (marker?.type !== "text") return;
    const match = /^\[!(DEFINITION|EXAM|CAUTION|EXAMPLE|ADVANCED)\](?:\s*\n?|\s+)/.exec(marker.value);
    if (!match) return;
    const callout = CALLOUTS[match[1] as keyof typeof CALLOUTS];
    marker.value = marker.value.slice(match[0].length);
    if (!marker.value && first.children.length === 1) node.children.shift();
    setProperties(node, {
      className: ["study-callout", `study-callout-${callout.type}`],
      role: "note",
      "data-study-callout": callout.type,
      "data-callout-label": callout.label,
    }, "aside");
  });
}

function removeBlockMarker(node: Blockquote, type: "QUIZ" | "ANSWER") {
  const first = node.children[0];
  if (first?.type !== "paragraph") return false;
  const marker = first.children[0];
  if (marker?.type !== "text") return false;
  const match = new RegExp(`^\\[!${type}\\]\\s*`).exec(marker.value);
  if (!match) return false;
  marker.value = marker.value.slice(match[0].length);
  if (!marker.value && first.children.length === 1) node.children.shift();
  return true;
}

function transformQuizzes(tree: Root) {
  for (let index = 0; index < tree.children.length; index += 1) {
    const quiz = tree.children[index];
    if (quiz.type !== "blockquote" || !removeBlockMarker(quiz, "QUIZ")) continue;
    const quizId = `quiz-${stableHash(toString(quiz))}`;
    setProperties(quiz, { className: ["study-quiz"], "data-quiz-id": quizId, "data-callout-label": "확인 문제" }, "section");
    const answer = tree.children[index + 1];
    if (answer?.type !== "blockquote" || !removeBlockMarker(answer, "ANSWER")) continue;
    const summary = { type: "paragraph", children: [{ type: "text", value: "정답 확인" }], data: { hName: "summary", hProperties: { className: ["study-answer-summary"] } } } as RootContent;
    const controls = { type: "paragraph", children: ([
      ["correct", "맞음"], ["unsure", "헷갈림"], ["wrong", "틀림"],
    ] as const).map(([result, label]) => ({ type: "emphasis", children: [{ type: "text", value: label }], data: { hName: "button", hProperties: { type: "button", "data-quiz-id": quizId, "data-quiz-result": result } } })), data: { hName: "div", hProperties: { className: ["study-quiz-results"] } } } as RootContent;
    answer.children.unshift(summary as never);
    answer.children.push(controls as never);
    setProperties(answer, { className: ["study-answer"], "data-quiz-id": quizId }, "details");
  }
}

function transformFlashcards(tree: Root) {
  for (const node of tree.children) {
    if (node.type !== "blockquote") continue;
    const raw = toString(node);
    const match = /^\[!FLASHCARD\]\s*Q:\s*(.+?)\s+A:\s*([\s\S]+)$/i.exec(raw);
    if (!match) continue;
    const cardId = `card-${stableHash(`${match[1]}:${match[2]}`)}`;
    node.children = [
      { type: "paragraph", children: [{ type: "text", value: match[1].trim() }], data: { hName: "summary", hProperties: { className: ["study-flashcard-question"] } } },
      { type: "paragraph", children: [{ type: "text", value: match[2].trim() }], data: { hProperties: { className: ["study-flashcard-answer"] } } },
      { type: "paragraph", children: (["wrong", "unsure", "correct"] as const).map(result => ({ type: "emphasis", children: [{ type: "text", value: result === "wrong" ? "모름" : result === "unsure" ? "헷갈림" : "알고 있음" }], data: { hName: "button", hProperties: { type: "button", "data-card-id": cardId, "data-card-result": result } } })), data: { hName: "div", hProperties: { className: ["study-card-results"] } } },
    ] as never;
    setProperties(node, { className: ["study-flashcard"], "data-card-id": cardId }, "details");
  }
}

function assignBlockIds(tree: Root) {
  const occurrences = new Map<string, number>();
  visit(tree, node => {
    if (!BLOCK_TYPES.has(node.type)) return;
    const content = toString(node).replace(/\s+/g, " ").trim();
    if (!content) return;
    const base = `${node.type}-${stableHash(`${node.type}:${content}`)}`;
    const count = (occurrences.get(base) ?? 0) + 1;
    occurrences.set(base, count);
    setProperties(node as RootContent, { "data-block-id": count === 1 ? base : `${base}-${count}` });
  });
}

export function remarkStudySyntax() {
  return (tree: Root) => {
    transformHighlights(tree);
    transformBlanks(tree);
    transformQuizzes(tree);
    transformFlashcards(tree);
    transformCallouts(tree);
    assignBlockIds(tree);
  };
}

export function parseMarkdown(source: string, format: "md" | "mdx" = "mdx"): Root {
  const parser = unified().use(remarkParse).use(remarkGfm);
  if (format === "mdx") parser.use(remarkMdx);
  parser.use(remarkStudySyntax);
  return parser.runSync(parser.parse(source)) as Root;
}

function normalizeHeadings(tree: Root) {
  let inSection = false;
  for (const node of tree.children) {
    if (node.type !== "heading") continue;
    if (node.depth === 1) { node.depth = 2; inSection = true; }
    else if (inSection) node.depth = Math.min(node.depth + 1, 6) as typeof node.depth;
  }
}

export function getHeadings(source: string, format: "md" | "mdx" = "mdx"): Heading[] {
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();
  const tree = parseMarkdown(source, format);
  normalizeHeadings(tree);
  visit(tree, "heading", node => {
    if (node.depth >= 2 && node.depth <= 4) {
      const text = toString(node);
      headings.push({ id: slugger.slug(text), text, level: node.depth });
    }
  });
  return headings;
}

export function remarkDocumentHeadings() {
  return (tree: Root) => {
    const slugger = new GithubSlugger();
    // The page header already owns the document's H1.
    normalizeHeadings(tree);
    visit(tree, "heading", node => {
      if (node.depth >= 2 && node.depth <= 4) {
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id: slugger.slug(toString(node)) } };
      }
    });
  };
}

export function markdownText(source: string, format: "md" | "mdx" = "mdx") {
  const values: string[] = [];
  visit(parseMarkdown(source, format), node => {
    if (node.type === "text" || node.type === "inlineCode" || node.type === "code") values.push(node.value);
  });
  return values.join(" ").replace(/\s+/g, " ").trim();
}
