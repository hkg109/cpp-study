import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Root } from "mdast";
import type { Heading } from "@/types/content";

export function parseMarkdown(source: string, format: "md" | "mdx" = "mdx"): Root {
  const parser = unified().use(remarkParse).use(remarkGfm);
  if (format === "mdx") parser.use(remarkMdx);
  return parser.parse(source);
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
