import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function TransactionSuccessPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <CheckCircle2 className="mb-4 size-16 text-emerald-500" />
          <h2 className="text-2xl font-bold">Pembayaran Berhasil!</h2>
          <p className="mt-2 text-muted-foreground">
            Terima kasih! Paketmu sudah aktif dan siap digunakan.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Redirect otomatis dalam {countdown} detik...
          </p>
          <Button asChild className="mt-6">
            <Link to="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
