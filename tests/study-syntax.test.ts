import test from "node:test";
import assert from "node:assert/strict";
import { visit } from "unist-util-visit";
import { parseMarkdown, getHeadings } from "../lib/markdown";

test("learning syntax supports callouts, colors, blanks, quizzes and cards", () => {
  const tree = parseMarkdown(
    "## ==blue:포인터==\n\n==중요== {{주소}}\n\n> [!DEFINITION]\n> 정의입니다.\n\n> [!QUIZ]\n> 질문?\n\n<!-- separate -->\n\n> [!FLASHCARD]\n> Q: 질문\n> A: 답변", "md");
  const rendered = JSON.stringify(tree);
  for (const feature of ["study-mark-blue", "study-mark-yellow", "study-blank", "study-callout-definition", "study-quiz", "study-flashcard", "data-card-result"]) assert.ok(rendered.includes(feature), feature);
  assert.equal(getHeadings("## ==blue:포인터==", "md")[0].text, "포인터");
});

test("code examples preserve literal study syntax and C++ braces", () => {
  const tree = parseMarkdown("`==value== {{value}}`\n\n```cpp\nint a[2][2] = {{1,2},{3,4}};\n```", "md");
  assert.equal(JSON.stringify(tree).includes("study-blank"), false);
  assert.equal(JSON.stringify(tree).includes("study-mark"), false);
});

test("quiz answers render a disclosure with three results tied to the question", () => {
  const tree = parseMarkdown("> [!QUIZ]\n> 질문\n\n> [!ANSWER]\n> 정답", "md");
  const [quiz, answer] = tree.children;
  assert.equal(answer.data?.hName, "details");
  const id = quiz.data?.hProperties?.["data-quiz-id"];
  assert.ok(id);
  assert.equal(answer.data?.hProperties?.["data-quiz-id"], id);
  const results: unknown[] = [];
  visit(tree, node => {
    const result = node.data?.hProperties?.["data-quiz-result"];
    if (result) results.push(result);
  });
  assert.deepEqual(results, ["correct", "unsure", "wrong"]);
});

test("paragraph anchors survive unrelated insertions and distinguish duplicates", () => {
  const ids = (source: string) => {
    const result: string[] = [];
    visit(parseMarkdown(source, "md"), "paragraph", node => { result.push(String(node.data?.hProperties?.["data-block-id"])); });
    return result;
  };
  const original = ids("기존 문단\n\n기존 문단");
  assert.notEqual(original[0], original[1]);
  assert.deepEqual(ids("추가 문단\n\n기존 문단\n\n기존 문단").slice(1), original);
});
