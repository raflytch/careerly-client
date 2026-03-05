import { useRef, useState } from "react";
import { useUserProfile } from "@/services/queries/auth.query";
import { useUpdateProfile } from "@/services/mutations/user.mutation";
import { useAuthStore } from "@/stores/auth.store";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Loader2 } from "lucide-react";
import DeleteAccountDialog from "@/modules/dashboard/components/DeleteAccountDialog";

export default function ProfilePage() {
  const setUser = useAuthStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useUserProfile();
  const profile = data?.data;

  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.user.name);
    setInitialized(true);
  }

  const mutation = useUpdateProfile();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    mutation.mutate(formData, {
      onSuccess: () => {
        if (profile) {
          setUser({
            ...profile.user,
            name,
            avatar_url: avatarPreview ?? profile.user.avatar_url,
          });
        }
        setAvatarFile(null);
        setAvatarPreview(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-muted-foreground">Kelola informasi profil kamu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>Update nama dan foto profil kamu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-20">
                  <AvatarImage
                    src={avatarPreview ?? profile?.user.avatar_url}
                  />
                  <AvatarFallback className="text-lg">
                    {profile?.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground shadow-sm hover:bg-primary/90"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="size-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="space-y-1">
                <p className="font-medium">{profile?.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.user.email}
                </p>
                <Badge variant="secondary">{profile?.user.role}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.user.email ?? ""} disabled />
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {profile?.subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Detail langganan kamu saat ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <Badge>{profile.subscription.plan?.display_name}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                variant={
                  profile.subscription.status === "active"
                    ? "default"
                    : "secondary"
                }
              >
                {profile.subscription.status}
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Berakhir pada
              </span>
              <span className="text-sm">
                {new Date(profile.subscription.end_date).toLocaleDateString(
                  "id-ID",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zona Bahaya</CardTitle>
          <CardDescription>
            Aksi ini tidak dapat dibatalkan setelah dikonfirmasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}
