import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminVideosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin • Vídeos"
        title="Gestão de vídeos"
        description="Operação de uploads Panda Video por aula (TUS) e validação de playback."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Panda por aula</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Use a tela de Videoaulas para selecionar uma aula e disparar upload/link do Panda.</p>
            <Link className="text-primary" href="/membros/videoaulas">
              Ir para Videoaulas
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Checklist operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1) Curso publicado</p>
            <p>2) Aula com status PUBLISHED</p>
            <p>3) pandaVideoId vinculado</p>
            <p>4) Entitlement concedido ao usuário para testar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

