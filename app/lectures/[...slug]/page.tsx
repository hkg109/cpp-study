import { notFound } from "next/navigation";
import { getAllLectures, getLectureBySlug } from "@/lib/lectures";
import { DocumentPage } from "@/components/lecture/DocumentPage";

interface Props { params: Promise<{ slug: string[] }> }
export const dynamicParams = false;
export const generateStaticParams = () => getAllLectures().map(lecture => ({ slug: lecture.slug }));
export async function generateMetadata({ params }: Props) {
  const lecture = getLectureBySlug((await params).slug);
  if (!lecture) notFound();
  return { title: lecture.title, description: lecture.description };
}
export default async function LecturePage({ params }: Props) {
  const lecture = getLectureBySlug((await params).slug);
  if (!lecture) notFound();
  return <DocumentPage document={lecture} />;
}
