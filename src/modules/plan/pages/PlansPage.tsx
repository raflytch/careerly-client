import { usePlans } from "@/services/queries/plan.query";
import { useUserProfile } from "@/services/queries/auth.query";
import { useCreateTransaction } from "@/services/mutations/plan.mutation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Loader2, Sparkles, ShieldCheck } from "lucide-react";

function formatPrice(price: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(price));
}

export default function PlansPage() {
  const { data, isLoading } = usePlans();
  const { data: profileData } = useUserProfile();
  const createTransaction = useCreateTransaction();

  const plans = data?.data?.plans ?? [];
  const currentPlanId = profileData?.data?.subscription?.plan_id;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pilih Paket</h2>
          <p className="text-muted-foreground">
            Tingkatkan akunmu untuk akses fitur premium
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pilih Paket</h2>
        <p className="text-muted-foreground">
          Tingkatkan akunmu untuk akses fitur premium
        </p>
      </div>

      {currentPlanId && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <ShieldCheck className="size-5 text-primary" />
            <p className="text-sm">
              Paket aktif:{" "}
              <span className="font-semibold">
                {profileData?.data?.subscription?.plan?.display_name}
              </span>
              {" · Berlaku hingga "}
              <span className="font-medium">
                {new Date(
                  profileData!.data.subscription.end_date,
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">Belum ada paket tersedia</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const isPro =
              plan.name.toLowerCase().includes("pro") ||
              plan.name.toLowerCase().includes("premium");
            const isCurrentPlan = plan.id === currentPlanId;

            return (
              <Card
                key={plan.id}
                className={
                  isCurrentPlan
                    ? "relative border-primary"
                    : isPro
                      ? "relative border-primary shadow-md"
                      : "relative"
                }
              >
                {isCurrentPlan && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 left-1/2 -translate-x-1/2"
                  >
                    <ShieldCheck className="mr-1 size-3" />
                    Paket Aktif
                  </Badge>
                )}
                {!isCurrentPlan && isPro && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Sparkles className="mr-1 size-3" />
                    Populer
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.display_name}</CardTitle>
                  <CardDescription>
                    {plan.duration_days} hari akses
                  </CardDescription>
                  <p className="mt-2 text-3xl font-bold">
                    {formatPrice(plan.price)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-500" />
                      {plan.max_resumes} Resume
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-500" />
                      {plan.max_ats_checks} ATS Review
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-emerald-500" />
                      {plan.max_interviews} Interview
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={
                      isCurrentPlan
                        ? "secondary"
                        : isPro
                          ? "default"
                          : "outline"
                    }
                    disabled={isCurrentPlan || createTransaction.isPending}
                    onClick={() =>
                      createTransaction.mutate({ plan_id: plan.id })
                    }
                  >
                    {isCurrentPlan ? (
                      "Paket Saat Ini"
                    ) : createTransaction.isPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Pilih Paket"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
