import { notFound } from "next/navigation";
import { getDocument, readCollection } from "@/lib/content";
import { DocumentPage } from "@/components/lecture/DocumentPage";
interface Props { params: Promise<{ week: string }> }
export const dynamicParams = true;
export const generateStaticParams = () => readCollection("practice").map(doc => ({ week: doc.slug[0] }));
export async function generateMetadata({ params }: Props) {
  const doc = getDocument("practice", [(await params).week]);
  if (!doc) notFound();
  return { title: doc.title, description: doc.description };
}
export default async function PracticeWeek({ params }: Props) {
  const doc = getDocument("practice", [(await params).week]);
  if (!doc) notFound();
  return <DocumentPage document={doc} />;
}
