import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getHeadings, remarkDocumentHeadings } from "./markdown";

function rehypeRawCode() {
  return (tree: Root) => {
    visit(tree, "element", node => {
      if (node.tagName !== "pre") return;
      const code = node.children.find(child => child.type === "element" && child.tagName === "code");
      if (code?.type === "element") node.properties["data-raw"] = code.children.filter(child => child.type === "text").map(child => child.value).join("").replace(/\n$/, "");
    });
  };
}

function rehypeDefaultLightCodeColors() {
  return (tree: Root) => {
    visit(tree, "element", node => {
      if (node.tagName !== "span" || typeof node.properties.style !== "string") return;
      const lightColor = /--shiki-light:([^;]+)/.exec(node.properties.style)?.[1];
      if (lightColor) node.properties.style += `;color:${lightColor}`;
    });
  };
}

export async function renderMDX(source: string, format: "md" | "mdx" = "mdx") {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      // Author-maintained repository content only. JavaScript expressions stay disabled.
      blockJS: true,
      mdxOptions: {
        format,
        remarkPlugins: [remarkGfm, remarkDocumentHeadings],
        rehypePlugins: [rehypeRawCode, [rehypePrettyCode, { theme: { light: "light-plus", dark: "dark-plus" }, keepBackground: false }], rehypeDefaultLightCodeColors],
      },
    },
  });
  return { content, headings: getHeadings(source, format) };
}
