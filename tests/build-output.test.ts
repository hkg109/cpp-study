import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { readCollection } from "../lib/content";
import { getHeadings } from "../lib/markdown";

const serverDir = path.join(process.cwd(), ".next/server/app");
const hasBuild = existsSync(path.join(process.cwd(), ".next/BUILD_ID"));

test("static production HTML includes MDX features, one H1, real TOC ids and no drafts", { skip: !hasBuild && "Run npm run build first" }, (context) => {
  if (!existsSync(path.join(serverDir, "lectures/week-00.html"))) {
    context.skip("Routes are rendered dynamically from editable local files");
    return;
  }
  for (const kind of ["lectures", "practice", "assignments"] as const) {
    for (const doc of readCollection(kind)) {
      const html = readFileSync(path.join(serverDir, `${doc.path.slice(1)}.html`), "utf8");
      assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, doc.path);
      for (const heading of getHeadings(doc.content, doc.format)) assert.ok(html.includes(`id="${heading.id}"`), `${doc.path}: ${heading.id}`);
      assert.ok(html.includes("<title>"));
      assert.ok(!html.includes("반복문 (준비 중)"));
      if (kind === "lectures") assert.equal((html.match(/class="completion-box"/g) ?? []).length, 1);
    }
  }
  const example = readFileSync(path.join(serverDir, "practice/week-01.html"), "utf8");
  assert.ok(example.includes("data-line-numbers"));
  assert.ok(example.includes("data-raw="));
  assert.ok(example.includes("number_sign.cpp"));
  assert.match(example, /<details class="answer">/);
  const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
  assert.equal(manifest.routes["/lectures/week-02/02-loop"], undefined);
  assert.equal(manifest.routes["/lectures/week-01/01-environment"], undefined);
  for (const doc of readCollection("lectures")) assert.ok(manifest.routes[doc.path]);
  assert.equal(manifest.dynamicRoutes["/lectures/[...slug]"].fallback, false);
});
