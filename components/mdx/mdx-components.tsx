import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { Answer } from "./Answer";
import { CodeBlock } from "./CodeBlock";

export const mdxComponents: MDXComponents = {
  Callout, Answer, CodeBlock,
  // Completion is rendered exactly once by the lecture layout, including for older MDX files.
  ProgressCheck: () => null,
  pre: CodeBlock,
  table: ({ children, ...props }) => <div className="table-scroll" tabIndex={0} role="region" aria-label="학습 내용 표"><table {...props}>{children}</table></div>,
  a: ({ href, children, ...props }) => <a {...props} href={href} {...(href?.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>,
};
