import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getResumeById } from "@/services/queries/resume.query";
import { Skeleton } from "@/components/ui/skeleton";
import ResumeForm from "@/modules/resume/components/ResumeForm";

export default function EditResumePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["resume", id],
    queryFn: () => getResumeById(id!),
    enabled: !!id,
  });

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
