export const PROGRESS_KEY = "cpp-study-progress";
export type Progress = Record<string, boolean>;

export function parseProgress(raw: string | null): Progress {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) =>
      /^week-\d+(?:\/[a-z0-9-]+)?$/.test(key) && typeof value === "boolean",
    ));
  } catch { return {}; }
}
