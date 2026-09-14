import { getDocument, readCollection, withoutBody } from "./content";

export const getAllLectures = () => readCollection("lectures").map(withoutBody);
export const getLectureBySlug = (slug: string[]) => getDocument("lectures", slug);
export const getLecturesByWeek = (week: number) => getAllLectures().filter(lecture => lecture.week === week);
export const getWeeks = () => [...new Set(getAllLectures().map(lecture => lecture.week))];
export function getPrevNextLecture(slug: string[]) {
  const lectures = getAllLectures();
  const index = lectures.findIndex(lecture => lecture.slug.join("/") === slug.join("/"));
  return index < 0 ? { prev: undefined, next: undefined } : { prev: lectures[index - 1], next: lectures[index + 1] };
}
