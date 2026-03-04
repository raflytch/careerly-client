import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import {
  requestDeleteOtp,
  resendDeleteOtp,
  verifyDeleteOtp,
} from "@/services/mutations/user.mutation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, Trash2 } from "lucide-react";

type Step = "confirm" | "otp";

export default function DeleteAccountDialog() {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("confirm");
  const [otp, setOtp] = useState("");

  const requestOtpMutation = useMutation({
    mutationFn: requestDeleteOtp,
    onSuccess: (response) => {
      toast.success(response.message);
      setStep("otp");
    },
    onError: () => {
      toast.error("Gagal mengirim OTP");
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: resendDeleteOtp,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: () => {
      toast.error("Gagal mengirim ulang OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (otpCode: string) => verifyDeleteOtp(otpCode),
    onSuccess: (response) => {
      toast.success(response.message);
      logoutStore();
      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("OTP tidak valid");
    },
  });

  const handleClose = () => {
    setOpen(false);
    setStep("confirm");
    setOtp("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
    >
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="size-4" />
          Hapus Akun
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle>Hapus Akun</DialogTitle>
              <DialogDescription>
                Apakah kamu yakin ingin menghapus akun? Semua data akan dihapus
                dan tidak dapat dikembalikan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => requestOtpMutation.mutate()}
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Ya, Hapus Akun"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Verifikasi OTP</DialogTitle>
              <DialogDescription>
                Masukkan kode OTP yang dikirim ke email kamu untuk konfirmasi
                penghapusan akun
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resendOtpMutation.mutate()}
                disabled={resendOtpMutation.isPending}
              >
                {resendOtpMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Kirim Ulang OTP"
                )}
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={() => verifyOtpMutation.mutate(otp)}
                disabled={verifyOtpMutation.isPending || otp.length < 6}
              >
                {verifyOtpMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Konfirmasi Hapus"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
