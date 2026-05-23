import Link from "next/link";

const nav = [
  { href: "/membros/admin", label: "Dashboard" },
  { href: "/membros/admin/usuarios", label: "Usuários" },
  { href: "/membros/admin/conteudos", label: "Conteúdos" },
  { href: "/membros/admin/videos", label: "Vídeos" },
  { href: "/membros/admin/ebooks", label: "Ebooks" },
  { href: "/membros/admin/compras", label: "Compras" },
  { href: "/membros/admin/mentoria", label: "Mentoria" },
  { href: "/membros/admin/notificacoes", label: "Notificações" },
  { href: "/membros/admin/artesas", label: "Artesãs" },
  { href: "/membros/admin/uploads", label: "Uploads" },
  { href: "/membros/admin/carrossel", label: "Carrossel" },
  { href: "/membros/admin/analytics", label: "Analytics" },
  { href: "/membros/admin/busca", label: "Busca" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="premium-surface rounded-[28px] p-4">
        <div className="flex flex-wrap gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

