interface SlashShortcut { trigger: string; insert: string; caretOffset?: number }

const SLASH_SHORTCUTS: SlashShortcut[] = [
  { trigger: "/#", insert: "# " }, { trigger: "/##", insert: "## " }, { trigger: "/###", insert: "### " },
  { trigger: "/-", insert: "- " }, { trigger: "/1.", insert: "1. " }, { trigger: "/>", insert: "> " },
  { trigger: "/code", insert: "```cpp\n\n```", caretOffset: 7 },
  { trigger: "/bold", insert: "**굵은 글씨**", caretOffset: 2 },
  { trigger: "/italic", insert: "*기울임 글씨*", caretOffset: 1 },
  { trigger: "/link", insert: "[링크 텍스트](https://)", caretOffset: 1 },
  { trigger: "/table", insert: "| 제목 1 | 제목 2 |\n| --- | --- |\n| 내용 1 | 내용 2 |" },
  { trigger: "/hr", insert: "---\n" },
];

export function expandSlashShortcut(value: string, caret: number) {
  if (value[caret - 1] !== " ") return null;
  const beforeSpace = value.slice(0, caret - 1);
  const lineStart = beforeSpace.lastIndexOf("\n") + 1;
  const token = beforeSpace.slice(lineStart);
  const shortcut = SLASH_SHORTCUTS.find(item => item.trigger === token);
  if (!shortcut) return null;
  const next = value.slice(0, lineStart) + shortcut.insert + value.slice(caret);
  return { value: next, caret: lineStart + (shortcut.caretOffset ?? shortcut.insert.length) };
}
