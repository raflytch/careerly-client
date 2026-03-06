import { useState } from "react";
import { useNavigate, Link } from "react-router";
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
import { ArrowLeft, Loader2, RotateCcw, Mail } from "lucide-react";

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
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between border-r border-border bg-muted/30 p-10 lg:flex">
        <Link to="/" className="text-xl font-bold">
          Careerly
        </Link>
        <div className="space-y-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <RotateCcw className="size-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Pulihkan akunmu
            <br />
            yang telah dihapus
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Masukkan email yang terdaftar dan verifikasi dengan kode OTP untuk
            memulihkan akun.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Careerly
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-sm border-0 shadow-none lg:border lg:shadow-none">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-muted">
              <Mail className="size-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">
              {step === "email" ? "Restore Akun" : "Verifikasi OTP"}
            </CardTitle>
            <CardDescription>
              {step === "email"
                ? "Masukkan email akun yang ingin di-restore"
                : `Kode OTP telah dikirim ke ${email}`}
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
    </div>
  );
}
