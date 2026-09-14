import { ResourceIndex } from "@/components/lecture/ResourceIndex";
export const metadata = { title: "주차별 과제", description: "C++ 스터디 과제와 제출 안내를 확인하세요." };
export default function AssignmentsPage() { return <ResourceIndex kind="assignments" />; }
