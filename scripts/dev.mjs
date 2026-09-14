import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { watchWeeks } from "./sync-weeks.mjs";

const cleanup = watchWeeks(
  () => console.log("[weeks] 강의 파일 변경 반영 완료"),
  error => console.error("[weeks] 파일을 다시 저장해 주세요:", error.message),
);
const require = createRequire(import.meta.url);
const next = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", ...process.argv.slice(2)], { stdio: "inherit" });
next.on("exit", code => { cleanup(); process.exitCode = code ?? 0; });
next.on("error", error => { cleanup(); console.error(error); process.exitCode = 1; });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => { cleanup(); next.kill(signal); });
