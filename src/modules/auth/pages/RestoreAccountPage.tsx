import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useRequestRestoreOtp,
  useResendRestoreOtp,
  useVerifyRestoreOtp,
} from "@/services/mutations/auth.mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, Loader2 } from "lucide-react";

type Step = "email" | "otp";

export default function RestoreAccountPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const requestOtpMutation = useRequestRestoreOtp(() => setStep("otp"));
  const resendOtpMutation = useResendRestoreOtp();
  const verifyOtpMutation = useVerifyRestoreOtp(() =>
    navigate("/login", { replace: true }),
  );

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    requestOtpMutation.mutate(email);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtpMutation.mutate({ email, otp });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Restore Akun</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Masukkan email akun yang ingin di-restore"
              : "Masukkan kode OTP yang dikirim ke email kamu"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Kirim OTP"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                <ArrowLeft className="size-4" />
                Kembali ke Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Label>Kode OTP</Label>
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
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtpMutation.isPending || otp.length < 6}
              >
                {verifyOtpMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Verifikasi"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => resendOtpMutation.mutate(email)}
                disabled={resendOtpMutation.isPending}
              >
                {resendOtpMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Kirim Ulang OTP"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
              >
                <ArrowLeft className="size-4" />
                Ganti Email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
