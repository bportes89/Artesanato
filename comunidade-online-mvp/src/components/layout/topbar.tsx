"use client";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { getDashboardGreeting, getWelcomeGreeting } from "@/lib/member-area";
export function Topbar() {
  const user = useSession();
  const pathname = usePathname();

  const title =
    pathname === "/"
      ? "Início"
      : pathname === "/login"
        ? "Entrar"
        : pathname === "/cadastro"
          ? "Criar conta"
          : pathname === "/esqueci-senha"
            ? "Recuperação"
            : pathname === "/redefinir-senha"
              ? "Nova senha"
              : pathname === "/membros"
                ? "Início"
      : pathname.startsWith("/membros/curadoria")
        ? "Curadoria"
        : pathname.startsWith("/membros/videoaulas")
          ? "Videoaulas"
          : pathname.startsWith("/membros/ebooks")
            ? "Ebooks"
            : pathname.startsWith("/membros/comunidade")
              ? "Comunidade"
              : pathname.startsWith("/membros/guardias-do-oficio")
                ? "Guardiãs do Ofício"
                : pathname.startsWith("/membros/livro")
                  ? "Livro"
                  : pathname.startsWith("/membros/diagnostico-consultoria")
                    ? "Diagnóstico & Consultoria"
                    : pathname.startsWith("/membros/workshops")
                      ? "Workshops"
                      : pathname.startsWith("/membros/mentoria")
                        ? "Diagnóstico & Consultoria"
                : pathname.startsWith("/membros/perfil")
                  ? "Meu perfil"
                  : pathname.startsWith("/membros/admin")
                    ? "Admin"
                    : "Área de membros";

  const greeting = pathname === "/membros" ? getDashboardGreeting(user) : getWelcomeGreeting(user);

  return (
    <header className="rounded-[28px] border border-[#1B2A3B]/10 bg-[#F1E8DC] px-6 py-5 shadow-premium">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-[#D4542A]">{title}</p>
      <p className="mt-2 text-xl font-semibold text-[#1B2A3B] md:text-[1.75rem]">{greeting}</p>
    </header>
  );
}
