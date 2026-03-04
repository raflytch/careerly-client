import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/queries/auth.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Selamat datang, {profile?.user.name}
        </h2>
        <p className="text-muted-foreground">
          Ini adalah halaman dashboard kamu
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {profile?.subscription?.plan?.display_name ?? "-"}
              </span>
              <Badge
                variant={
                  profile?.subscription?.status === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {profile?.subscription?.status ?? "-"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {profile?.usage?.find((u) => u.feature === "resume")?.count ?? 0}{" "}
              / {profile?.subscription?.plan?.max_resumes ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ATS Check</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {profile?.usage?.find((u) => u.feature === "ats_check")?.count ??
                0}{" "}
              / {profile?.subscription?.plan?.max_ats_checks ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
