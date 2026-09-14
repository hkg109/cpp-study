import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync, watch } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const weeksDirectory = path.join(project, "content/weeks");

export function loadWeekFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && /^week-\d+\.md$/i.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(entry => ({ name: entry.name, source: readFileSync(path.join(directory, entry.name), "utf8") }));
}

export function syncWeeks(directory = weeksDirectory, output = path.join(project, "lib/weeks.generated.json")) {
  mkdirSync(directory, { recursive: true });
  const files = loadWeekFiles(directory);
  const json = JSON.stringify(files, null, 2) + "\n";
  if (!existsSync(output) || readFileSync(output, "utf8") !== json) {
    writeFileSync(output, json);
    return true;
  }
  return false;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) syncWeeks();

export function watchWeeks(onChange, onError, directory = weeksDirectory, output = path.join(project, "lib/weeks.generated.json")) {
  syncWeeks(directory, output);
  let timer;
  const watcher = watch(directory, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { if (syncWeeks(directory, output)) onChange(); }
      catch (error) { onError(error); }
    }, 200);
  });
  return () => { clearTimeout(timer); watcher.close(); };
}
