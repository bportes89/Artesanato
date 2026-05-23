"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminClient } from "@/lib/services/admin";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminNewCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Conteúdos" title="Novo curso" description="Crie um curso para organizar módulos e aulas." />
      <Card>
        <CardHeader>
          <CardTitle>Dados do curso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Título do curso" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button
            onClick={async () => {
              try {
                await adminClient.createCourse({ title, description });
                router.push("/membros/admin/conteudos");
                router.refresh();
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Falha ao criar curso.");
              }
            }}
          >
            Criar curso
          </Button>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

