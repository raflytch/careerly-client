import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useTransactionStatus } from "@/services/queries/plan.query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

function getTransactionId(searchParams: URLSearchParams) {
  const orderId = searchParams.get("order_id");
  const txId = searchParams.get("transaction_id");

  if (txId) return txId;

  const stored = localStorage.getItem("pending_transaction_id");
  if (stored) return stored;

  if (orderId) return orderId;

  return null;
}

export default function TransactionCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [transactionId] = useState(() => getTransactionId(searchParams));
  const { data, isLoading } = useTransactionStatus(transactionId ?? undefined);

  const status = data?.data?.status;
  const midtransStatus = searchParams.get("transaction_status");

  useEffect(() => {
    if (status === "success") {
      localStorage.removeItem("pending_transaction_id");
    }
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        navigate("/dashboard/transactions", { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
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
              Tidak dapat menemukan data transaksi.
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard/plans">Lihat Paket</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || (!status && !midtransStatus)) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <Loader2 className="mb-4 size-16 animate-spin text-muted-foreground" />
            <h2 className="text-2xl font-bold">Memverifikasi Pembayaran</h2>
            <p className="mt-2 text-muted-foreground">
              Sedang mengecek status pembayaranmu...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
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
              Mengalihkan ke halaman transaksi...
            </p>
            <Button asChild className="mt-6">
              <Link to="/dashboard/transactions">Lihat Transaksi</Link>
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
            Pembayaranmu sedang diproses. Halaman ini akan otomatis diperbarui.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Memeriksa status pembayaran...
          </div>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/dashboard/transactions">Lihat Transaksi</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
