import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { getDocument, readCollection, validateFrontmatter } from "../lib/content";
import { getAllLectures, getPrevNextLecture } from "../lib/lectures";
import { getHeadings, markdownText } from "../lib/markdown";
import { getSearchIndex } from "../lib/search";
import { parseProgress } from "../lib/progress";
import Fuse from "fuse.js";
import { readWeeks } from "../lib/weeks";
import { loadWeekFiles } from "../scripts/sync-weeks.mjs";

test("published manifest hides drafts from routes, navigation and search", () => {
  const lectures = getAllLectures();
  assert.deepEqual(lectures.map(doc => [doc.week, doc.order]), lectures.map(doc => [doc.week, doc.order]).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
  assert.ok(lectures.every(doc => doc.order >= 1));
  assert.ok(lectures.every(doc => doc.published));
  assert.equal(getDocument("lectures", ["week-02", "02-loop"]), undefined);
  assert.equal(getDocument("lectures", ["..", "..", "package"]), undefined);
  assert.ok(getSearchIndex().every(entry => !entry.path.endsWith("02-loop")));
});

test("plain Markdown is discovered without frontmatter or a React edit", () => {
  const root = mkdtempSync(path.join(tmpdir(), "cpp-study-content-test-"));
  try {
    mkdirSync(path.join(root, "weeks"), { recursive: true });
    writeFileSync(path.join(root, "weeks", "week-12.md"), '# 새 강의\n\n자동 반영되는 본문입니다.\n\n## 새로운 개념\n중괄호 {value}도 일반 텍스트입니다.');
    writeFileSync(path.join(root, "weeks", "README.md"), "강의 파일이 아님");
    const docs = readWeeks(loadWeekFiles(path.join(root, "weeks")), { "week-12": "별도로 설정한 제목" });
    assert.equal(docs.length, 1);
    assert.equal(docs[0].path, "/lectures/week-12");
    assert.equal(docs[0].title, "별도로 설정한 제목");
    assert.equal(docs[0].description, "자동 반영되는 본문입니다.");
    assert.equal(docs[0].format, "md");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("each practice Markdown file has five Korean levels and hidden example solutions", () => {
  const practices = readCollection("practice").filter(doc => doc.week <= 6);
  const levels = ["중하", "중", "중상", "상", "최상"];
  assert.deepEqual(practices.map(doc => doc.week), [0, 1, 2, 3, 4, 5, 6]);
  for (const practice of practices) {
    assert.equal(practice.format, "mdx");
    assert.equal(getHeadings(practice.content, "mdx").filter(heading => /^Q\d+\./.test(heading.text)).length, 5);
    for (const level of levels) assert.match(practice.content, new RegExp(`\\*\\*난이도:\\*\\* ${level}(?:\\r?\\n)`));
    assert.equal((practice.content.match(/<Answer>/g) ?? []).length, 5);
    assert.equal((practice.content.match(/using namespace std;/g) ?? []).length, 5);
  }
});

test("frontmatter rejects malformed values and unsafe submission protocols", () => {
  const valid = { title: "조건문", description: "소개", week: 2, order: 1, published: true };
  assert.equal(validateFrontmatter(valid, "fixture").week, 2);
  assert.equal(validateFrontmatter({ ...valid, week: 0 }, "fixture").week, 0);
  assert.equal(validateFrontmatter({ ...valid, description: "" }, "fixture").description, "");
  assert.throws(() => validateFrontmatter({ ...valid, published: "false" }, "fixture"), /published/);
  assert.throws(() => validateFrontmatter({ ...valid, week: -1 }, "fixture"), /week/);
  assert.throws(() => validateFrontmatter({ ...valid, tags: "C++" }, "fixture"), /tags/);
  assert.throws(() => validateFrontmatter({ ...valid, submissionUrl: "javascript:alert(1)" }, "fixture"), /submissionUrl/);
  assert.throws(() => validateFrontmatter({ ...valid, duration: -1 }, "fixture"), /duration/);
});

test("duplicate route and order fail loudly", () => {
  const root = mkdtempSync(path.join(tmpdir(), "cpp-study-duplicate-test-"));
  try {
    const directory = path.join(root, "weeks");
    mkdirSync(directory, { recursive: true });
    for (const name of ["week-1.md", "week-01-01.md"]) writeFileSync(path.join(directory, name), "# 중복 강의\n\n내용");
    assert.throws(() => readWeeks(loadWeekFiles(directory)), /중복/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("previous/next navigation crosses week boundaries and handles endpoints", context => {
  const lectures = getAllLectures();
  if (lectures.length < 2) { context.skip("At least two published weeks needed"); return; }
  assert.equal(getPrevNextLecture(lectures[0].slug).prev, undefined);
  assert.equal(getPrevNextLecture(lectures.at(-1)!.slug).next, undefined);
  const transition = lectures.findIndex((doc, index) => index > 0 && doc.week !== lectures[index - 1].week);
  assert.ok(transition > 0);
  assert.equal(getPrevNextLecture(lectures[transition - 1].slug).next?.path, lectures[transition].path);
});

test("TOC ignores code fences, handles Korean and disambiguates repeated headings", () => {
  const source = '# 제목\n\n## 조건문\n\n```cpp\n## not a heading\n```\n\n### `if` 사용\n\n## 조건문';
  assert.deepEqual(getHeadings(source).map(h => h.id), ["제목", "조건문", "if-사용", "조건문-1"]);
  assert.equal(getHeadings(source)[2].level, 4);
  assert.equal(markdownText("<Callout>실제 본문</Callout>"), "실제 본문");
});

test("search can find body-only Korean terms and code syntax", () => {
  const index = getSearchIndex();
  const search = new Fuse(index, { keys: ["title", "description", "tags", "body"], ignoreLocation: true, threshold: .3 });
  for (const entry of index) assert.ok(search.search(entry.title).some(result => result.item.path === entry.path));
  const body = markdownText("# 제목\n\n본문에만 있는 한글키워드와 {value}\n\n```cpp\nstd::cin >> value;\n```", "md");
  const bodySearch = new Fuse([{ body }], { keys: ["body"], ignoreLocation: true });
  assert.ok(bodySearch.search("한글키워드").length > 0);
  assert.ok(bodySearch.search("std::cin").length > 0);
});

test("malformed or stale progress does not break the application", () => {
  assert.deepEqual(parseProgress(null), {});
  assert.deepEqual(parseProgress("not json"), {});
  assert.deepEqual(parseProgress("[]"), {});
  assert.deepEqual(parseProgress('{"week-04":true}'), { "week-04": true });
  assert.deepEqual(parseProgress('{"week-00-02":true}'), { "week-00-02": true });
  assert.deepEqual(parseProgress('{"week-01/01-environment":true,"week-01/02-test":"yes","__proto__":true}'), { "week-01/01-environment": true });
});
