import { ReviewDashboard } from "@/components/study/ReviewDashboard";
import { readCollection } from "@/lib/content";
export const metadata = { title: "복습 노트" };
export default function ReviewPage() {
  const documents = (["lectures", "practice", "assignments"] as const).flatMap(kind => readCollection(kind)).map(doc => ({ path: doc.path, title: doc.title, week: 'Week ' + String(doc.week).padStart(2, '0') }));
  return <ReviewDashboard documents={documents} />;
}
