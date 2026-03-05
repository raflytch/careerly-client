import { useParams, useNavigate } from "react-router";
import { useResumeById } from "@/services/queries/resume.query";
import { Skeleton } from "@/components/ui/skeleton";
import ResumeForm from "@/modules/resume/components/ResumeForm";

export default function EditResumePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useResumeById(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError || !data?.data) {
    navigate("/dashboard/resumes", { replace: true });
    return null;
  }

  return <ResumeForm resume={data.data} />;
}
