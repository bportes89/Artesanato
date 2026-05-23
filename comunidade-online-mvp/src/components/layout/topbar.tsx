"use client";
import { usePathname } from "next/navigation";
import { useSession } from "@/hooks/use-session";
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
              : pathname.startsWith("/membros/mentoria")
                ? "Mentoria"
                : pathname.startsWith("/membros/perfil")
                  ? "Meu perfil"
                  : pathname.startsWith("/membros/admin")
                    ? "Admin"
                    : "Área de membros";

  return (
    <header className="premium-surface rounded-[28px] bg-background/70 px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">Olá, {user?.name ?? "membro"}!</p>
    </header>
  );
}
