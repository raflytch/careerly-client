import { Link } from "react-router";
import { useTransactions } from "@/services/queries/plan.query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import type { Transaction } from "@/@types/plan";

function formatPrice(amount: string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(amount));
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getStatusConfig(status: Transaction["status"]) {
  switch (status) {
    case "success":
      return {
        label: "Berhasil",
        variant: "default" as const,
        icon: CheckCircle2,
        className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
      };
    case "pending":
      return {
        label: "Menunggu",
        variant: "secondary" as const,
        icon: Clock,
        className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
      };
    case "failed":
      return {
        label: "Gagal",
        variant: "destructive" as const,
        icon: XCircle,
        className: "",
      };
    case "expired":
      return {
        label: "Kedaluwarsa",
        variant: "outline" as const,
        icon: AlertTriangle,
        className: "text-muted-foreground",
      };
  }
}

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions();

  const transactions = data?.data?.transactions ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Riwayat Transaksi
          </h2>
          <p className="text-muted-foreground">
            Lihat semua riwayat pembayaran kamu
          </p>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Riwayat Transaksi
          </h2>
          <p className="text-muted-foreground">
            Lihat semua riwayat pembayaran kamu
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/dashboard/plans">Lihat Paket</Link>
        </Button>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="mb-4 size-12 text-muted-foreground" />
            <CardTitle className="mb-1 text-lg">Belum Ada Transaksi</CardTitle>
            <CardDescription>
              Transaksi pembayaranmu akan muncul di sini
            </CardDescription>
            <Button asChild className="mt-4">
              <Link to="/dashboard/plans">Pilih Paket</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => {
                      const config = getStatusConfig(tx.status);
                      const StatusIcon = config.icon;

                      return (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">
                            {tx.order_id.split("-").slice(-1)[0]}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatPrice(tx.gross_amount)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {tx.payment_type?.replace("_", " ") ?? "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={config.variant}
                              className={config.className}
                            >
                              <StatusIcon className="mr-1 size-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(tx.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            {tx.status === "pending" && tx.redirect_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a
                                  href={tx.redirect_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Bayar
                                  <ExternalLink className="ml-1 size-3" />
                                </a>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3 md:hidden">
            {transactions.map((tx) => {
              const config = getStatusConfig(tx.status);
              const StatusIcon = config.icon;

              return (
                <Card key={tx.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {formatPrice(tx.gross_amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.created_at)}
                      </p>
                      <Badge
                        variant={config.variant}
                        className={config.className}
                      >
                        <StatusIcon className="mr-1 size-3" />
                        {config.label}
                      </Badge>
                    </div>
                    {tx.status === "pending" && tx.redirect_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={tx.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Bayar
                          <ExternalLink className="ml-1 size-3" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
