"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  HandHeart,
  LayoutDashboard,
  LogOut,
  MessageCircleHeart,
  PlayCircle,
  Shield,
  SunMedium,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";
import { authService } from "@/lib/services/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getWelcomeGreeting, isAdminUser } from "@/lib/member-area";

const items = [
  { href: "/membros", label: "Início", icon: LayoutDashboard },
  { href: "/membros/curadoria", label: "Curadoria", icon: SunMedium },
  { href: "/membros/videoaulas", label: "Videoaulas", icon: PlayCircle },
  { href: "/membros/guardias-do-oficio", label: "Guardiãs do Ofício", icon: HandHeart },
  { href: "/membros/ebooks", label: "Ebooks", icon: BookOpen },
  { href: "/membros/livro", label: "Livro", icon: BookMarked },
  { href: "/membros/comunidade", label: "Comunidade", icon: MessageCircleHeart },
  { href: "/membros/diagnostico-consultoria", label: "Diagnóstico & Consultoria", icon: ArrowUpRight },
  { href: "/membros/workshops", label: "Workshops", icon: CalendarDays },
  { href: "/membros/perfil", label: "Meu perfil", icon: UserCircle2 },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const user = useSession();
  const router = useRouter();
  const canSeeAdmin = isAdminUser(user);
  const navItems = canSeeAdmin ? [...items, { href: "/membros/admin", label: "Admin", icon: Shield }] : items;

  return (
    <aside className="w-full shrink-0 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#1B2A3B,#24384d)] text-white shadow-premium lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[320px]">
      <Link href="/" className="block px-6 pt-6">
        <p className="flex items-center gap-2 font-display text-[1.7rem] font-semibold tracking-tight">
          <span>Fernanda</span>
          <SunMedium className="h-5 w-5 text-[#F5A623]" />
          <span>Sklovsky</span>
        </p>
        <p className="mt-1 font-serif-accent text-lg italic text-[#F1E8DC]">ArtesanatoInteligente®</p>
      </Link>

      <div className="mt-6 px-6">
        <div className="flex items-center gap-3 rounded-[24px] bg-white/8 px-4 py-4 ring-1 ring-white/12">
          <Avatar className="h-12 w-12 border-white/10 bg-white/10">
            <AvatarFallback className="bg-white/10 text-white" name={user?.name} />
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-[#F1E8DC]">{user?.name ?? "Artesã"}</p>
            <p className="truncate text-sm text-white/70">{user?.email ?? ""}</p>
            <p className="mt-1 text-sm text-[#9DD4B5]">{getWelcomeGreeting(user)}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 grid gap-1 px-4 pb-4 lg:flex lg:flex-1 lg:flex-col lg:overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-[18px] px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                active && "bg-white/14 text-white ring-1 ring-white/10",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-5">
        <button
          type="button"
          className="flex min-h-11 w-full items-center gap-3 rounded-[18px] px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          onClick={async () => {
            await authService.logout();
            router.push("/login");
            router.refresh();
          }}
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}
