import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ebooksService } from "@/lib/services/ebooks";
export default async function EbooksPage() {
  const library = (await ebooksService.my()) ?? [];
  return <div className="space-y-6"><PageHeader eyebrow="Ebooks" title="Biblioteca premium" description="Baixe seus materiais e acompanhe o que já foi liberado pela plataforma." /><div className="grid gap-4 xl:grid-cols-2">{library.length ? library.map((item) => <Card key={item.ebook.id}><CardHeader><CardTitle>{item.ebook.title}</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">{item.ebook.description ?? 'Material complementar da comunidade.'}</p><a href={`/api/ebooks/${item.ebook.id}`} className="text-sm font-medium text-primary">Solicitar download</a></CardContent></Card>) : <div className="xl:col-span-2"><EmptyState title="Nenhum ebook liberado" description="Assim que um material for concedido, ele aparecerá aqui para download." /></div>}</div></div>;
}

