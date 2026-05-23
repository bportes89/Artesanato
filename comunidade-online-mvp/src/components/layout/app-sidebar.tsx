"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, CalendarDays, Crown, LayoutDashboard, Leaf, LogOut, MessageCircleHeart, Shield, Tv, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { authService } from "@/lib/services/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const items = [
  { href: "/membros", label: "Início", icon: LayoutDashboard },
  { href: "/membros/curadoria", label: "Curadoria", icon: Crown },
  { href: "/membros/videoaulas", label: "Videoaulas", icon: Tv },
  { href: "/membros/ebooks", label: "Ebooks", icon: BookOpen },
  { href: "/membros/comunidade", label: "Comunidade", icon: MessageCircleHeart },
  { href: "/membros/mentoria", label: "Mentoria", icon: CalendarDays },
  { href: "/membros/admin", label: "Admin", icon: Shield },
  { href: "/membros/perfil", label: "Meu perfil", icon: UserCircle2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = useSession();
  const router = useRouter();

  return (
    <aside className="hidden h-[calc(100vh-3rem)] w-[280px] shrink-0 flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,hsl(var(--premium-sidebar-from)),hsl(var(--premium-sidebar-to)))] text-white shadow-premium lg:sticky lg:top-6 lg:flex">
      <Link href="/" className="px-6 pt-6">
        <p className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight">
          <span>Fernanda</span>
          <Leaf className="h-6 w-6 text-accent" />
          <span>Sklovsky</span>
        </p>
        <p className="mt-1 text-xs text-white/60">Área de membros</p>
      </Link>

      <div className="mt-6 px-6">
        <div className="flex items-center gap-3 rounded-[22px] bg-white/5 px-4 py-4 ring-1 ring-white/10">
          <Avatar className="h-11 w-11 border-white/10 bg-white/10">
            <AvatarFallback className="bg-white/10 text-white" name={user?.name} />
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name ?? "Membro"}</p>
            <p className="truncate text-xs text-white/60">{user?.email ?? ""}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 px-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                active && "bg-white/10 text-white ring-1 ring-white/10",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          onClick={async () => {
            await authService.logout();
            router.push("/login");
            router.refresh();
          }}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
