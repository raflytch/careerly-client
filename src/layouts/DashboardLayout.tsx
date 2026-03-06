import { useEffect, useState } from "react";
import { Outlet, Navigate, NavLink, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/auth.store";
import { isTokenValid } from "@/lib/jwt";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  FileText,
  FileSearch,
  BrainCircuit,
  CreditCard,
  Receipt,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/resumes", label: "Resume", icon: FileText },
  { to: "/dashboard/ats-checks", label: "ATS Review", icon: FileSearch },
  { to: "/dashboard/interviews", label: "Interview", icon: BrainCircuit },
  { to: "/dashboard/plans", label: "Paket", icon: CreditCard },
  { to: "/dashboard/transactions", label: "Transaksi", icon: Receipt },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logoutStore = useAuthStore((state) => state.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !isTokenValid()) {
      logoutStore();
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, logoutStore, navigate]);

  if (!isAuthenticated || !isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logoutStore();
    navigate("/login", { replace: true });
  };

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        <span className="text-lg font-semibold">Careerly</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X className="size-4" />
        </Button>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Avatar className="size-8">
            <AvatarImage src={user?.avatar_url} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={handleLogout}>
                <LogOut className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Logout</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Separator orientation="vertical" className="h-6 md:hidden" />
          <h1 className="text-lg font-semibold">Careerly</h1>
        </header>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
