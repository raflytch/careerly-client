import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useTransactionStatus } from "@/services/queries/plan.query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, XCircle } from "lucide-react";

export default function TransactionPendingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transaction_id");
  const { data } = useTransactionStatus(transactionId ?? undefined);

  const status = data?.data?.status;

  useEffect(() => {
    if (status === "success") {
      navigate("/dashboard/transactions/success", { replace: true });
    }
  }, [status, navigate]);

  if (!transactionId) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <XCircle className="mb-4 size-16 text-red-500" />
            <h2 className="text-2xl font-bold">Transaksi Tidak Ditemukan</h2>
            <p className="mt-2 text-muted-foreground">
              ID transaksi tidak valid atau tidak ditemukan.
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard/plans">Lihat Paket</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "failed" || status === "expired") {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <XCircle className="mb-4 size-16 text-red-500" />
            <h2 className="text-2xl font-bold">
              {status === "expired"
                ? "Transaksi Kedaluwarsa"
                : "Pembayaran Gagal"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {status === "expired"
                ? "Waktu pembayaran telah habis. Silakan buat transaksi baru."
                : "Pembayaran tidak berhasil. Silakan coba lagi."}
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard/plans">Lihat Paket</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center py-10 text-center">
          <div className="relative mb-4">
            <Clock className="size-16 text-amber-500" />
            <Loader2 className="absolute -right-1 -bottom-1 size-6 animate-spin text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Menunggu Pembayaran</h2>
          <p className="mt-2 text-muted-foreground">
            Silakan selesaikan pembayaranmu. Halaman ini akan otomatis
            diperbarui saat pembayaran dikonfirmasi.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Memeriksa status pembayaran...
          </div>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
