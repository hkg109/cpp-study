import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { loadWeekTitles, readWeeks } from "../lib/weeks";
import { getHeadings } from "../lib/markdown";
import { syncWeeks, watchWeeks, loadWeekFiles } from "../scripts/sync-weeks.mjs";

const readFixture = (root: string) => readWeeks(loadWeekFiles(path.join(root, "weeks")));

test("week manifest reflects additions, edits and deletions and sorts numerically", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-weeks-test-"));
  try {
    const directory = path.join(root, "weeks");
    const output = path.join(root, "generated.json");
    fs.mkdirSync(directory);
    assert.deepEqual(readFixture(root), []);
    fs.writeFileSync(path.join(directory, "week-10.md"), "# 열 번째\n\n첫 내용");
    fs.writeFileSync(path.join(directory, "week-2.md"), "제목 없는 내용");
    syncWeeks(directory, output);
    assert.equal(syncWeeks(directory, output), false);
    assert.deepEqual(readFixture(root).map(doc => doc.week), [2, 10]);
    assert.equal(readFixture(root)[0].title, "Week 02 강의노트");
    assert.equal(readWeeks([{ name: "week-3.md", source: "# 본문 제목" }], { "week-03": "별도 강의 제목" })[0].title, "별도 강의 제목");
    fs.writeFileSync(path.join(directory, "week-10.md"), "# 변경된 제목\n\n수정한 본문");
    assert.equal(syncWeeks(directory, output), true);
    assert.match(fs.readFileSync(output, "utf8"), /수정한 본문/);
    fs.unlinkSync(path.join(directory, "week-2.md"));
    syncWeeks(directory, output);
    assert.equal(JSON.parse(fs.readFileSync(output, "utf8")).length, 1);
    fs.writeFileSync(path.join(directory, "week-0.md"), "# 시작 전 안내");
    assert.deepEqual(readFixture(root).map(doc => doc.week), [0, 10]);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("plain Markdown keeps every body heading and ignores fenced headings", () => {
  const source = '# 강의 제목\n\n## 소개\n\n# 함수\n\n## 함수 호출\n\n```cpp\n# 가짜 제목\n```\n\n# 재귀\n\n## 기저 조건';
  assert.deepEqual(getHeadings(source, "md").map(h => [h.text, h.level]), [["강의 제목", 2], ["소개", 3], ["함수", 2], ["함수 호출", 3], ["재귀", 2], ["기저 조건", 3]]);
});

test("week titles are read fresh from disk on every request", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-titles-test-"));
  const file = path.join(root, "titles.json");
  try {
    fs.writeFileSync(file, JSON.stringify({ "week-01": "처음 제목" }));
    assert.equal(loadWeekTitles(file)["week-01"], "처음 제목");
    fs.writeFileSync(file, JSON.stringify({ "week-01": "바뀐 제목" }));
    assert.equal(loadWeekTitles(file)["week-01"], "바뀐 제목");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("development watcher automatically rebuilds the manifest after saving a file", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cpp-watch-test-"));
  const directory = path.join(root, "weeks");
  const output = path.join(root, "manifest.json");
  let stop = () => {};
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await new Promise<void>((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error("File change was not detected")), 5000);
      stop = watchWeeks(resolve, reject, directory, output);
      fs.writeFileSync(path.join(directory, "week-4.md"), "# 새 주차\n\n자동 업데이트");
    });
    assert.match(fs.readFileSync(output, "utf8"), /자동 업데이트/);
  } finally { clearTimeout(timeout); stop(); fs.rmSync(root, { recursive: true, force: true }); }
});
