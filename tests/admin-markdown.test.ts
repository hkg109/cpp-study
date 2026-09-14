import assert from "node:assert/strict";
import test from "node:test";
import { expandSlashShortcut } from "../lib/admin-markdown";

test("exact slash shortcuts expand without opening recommendations", () => {
  assert.deepEqual(expandSlashShortcut("/# ", 3), { value: "# ", caret: 2 });
  assert.equal(expandSlashShortcut("문장 /# ", 6), null);
});
