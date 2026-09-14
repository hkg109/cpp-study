import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { revalidatePath } from "next/cache";

const MAX_NOTE_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request, { params }: { params: Promise<{ week: string }> }) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "존재하지 않는 API입니다." }, { status: 404 });
  }

  const hostname = new URL(request.url).hostname;
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "::1") {
    return Response.json({ error: "로컬 개발 환경에서만 저장할 수 있습니다." }, { status: 403 });
  }

  const { week } = await params;
  if (!/^week-\d{2,3}$/.test(week)) {
    return Response.json({ error: "올바르지 않은 강의 파일입니다." }, { status: 400 });
  }

  let body: { kind?: unknown; content?: unknown; title?: unknown; description?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ error: "요청 내용을 읽을 수 없습니다." }, { status: 400 }); }

  if (body.kind !== "lectures" && body.kind !== "practice") {
    return Response.json({ error: "수정할 수 없는 문서 종류입니다." }, { status: 400 });
  }
  const weeksDirectory = path.resolve(process.cwd(), "content", "weeks");
  if (body.kind === "practice") {
    const practiceDirectory = path.resolve(process.cwd(), "content", "practice");
    const target = path.resolve(practiceDirectory, `${week}.md`);
    if (path.dirname(target) !== practiceDirectory) return Response.json({ error: "저장 경로가 올바르지 않습니다." }, { status: 400 });
    try {
      const parsed = matter(await readFile(target, "utf8"));
      if (typeof body.title === "string" && typeof body.description === "string") {
        const title = body.title.trim();
        const description = body.description.trim();
        if (!title || title.length > 120) return Response.json({ error: "제목은 1~120자로 입력해 주세요." }, { status: 400 });
        if (description.length > 300) return Response.json({ error: "설명은 300자 이하로 입력해 주세요." }, { status: 400 });
        parsed.data.title = title;
        parsed.data.description = description;
      } else if (typeof body.content === "string" && Buffer.byteLength(body.content, "utf8") <= MAX_NOTE_BYTES) {
        parsed.content = body.content;
      } else {
        return Response.json({ error: "실습 내용이 올바르지 않거나 너무 큽니다." }, { status: 400 });
      }
      await writeFile(target, matter.stringify(parsed.content, parsed.data), "utf8");
      revalidatePath("/practice");
      revalidatePath(`/practice/${week}`);
      return Response.json({ saved: true, file: `content/practice/${week}.md` });
    } catch (error) {
      console.error("Failed to save practice document:", error);
      return Response.json({ error: "실습 파일을 저장하지 못했습니다." }, { status: 500 });
    }
  }
  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title || title.length > 120) return Response.json({ error: "제목은 1~120자로 입력해 주세요." }, { status: 400 });
    const titlesFile = path.resolve(weeksDirectory, "titles.json");
    try {
      const titles = JSON.parse(await readFile(titlesFile, "utf8")) as Record<string, string>;
      titles[week] = title;
      await writeFile(titlesFile, `${JSON.stringify(titles, null, 2)}\n`, "utf8");
      revalidatePath("/", "layout");
      return Response.json({ saved: true, file: "content/weeks/titles.json" });
    } catch (error) {
      console.error("Failed to save lecture title:", error);
      return Response.json({ error: "강의 제목을 저장하지 못했습니다." }, { status: 500 });
    }
  }
  if (typeof body.content !== "string" || Buffer.byteLength(body.content, "utf8") > MAX_NOTE_BYTES) {
    return Response.json({ error: "노트 내용이 올바르지 않거나 너무 큽니다." }, { status: 400 });
  }

  const target = path.resolve(weeksDirectory, `${week}.md`);
  if (path.dirname(target) !== weeksDirectory) {
    return Response.json({ error: "저장 경로가 올바르지 않습니다." }, { status: 400 });
  }

  try {
    await writeFile(target, body.content, "utf8");
    revalidatePath(`/lectures/${week}`);
    return Response.json({ saved: true, file: `content/weeks/${week}.md` });
  } catch (error) {
    console.error("Failed to save lecture note:", error);
    return Response.json({ error: "MD 파일을 저장하지 못했습니다." }, { status: 500 });
  }
}
