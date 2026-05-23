"use client";

import { useEffect, useState } from "react";
import { adminClient, type AdminCarouselItem } from "@/lib/services/admin";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminCarouselPage() {
  const [items, setItems] = useState<AdminCarouselItem[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await adminClient.carousel({ page: 1, limit: 50 });
      setItems(data.items ?? []);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin • Carrossel" title="Gestão de carrossel" description="Banners, destaque e organização por ordem." />
      <Card>
        <CardHeader>
          <CardTitle>Novo item</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input placeholder="Título do banner" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button
            onClick={async () => {
              try {
                const created = (await adminClient.createCarousel({ title, sortOrder: items.length })) as { id: string };
                const data = await adminClient.carousel({ page: 1, limit: 50 });
                setItems(data.items ?? []);
                setTitle("");
                setMessage(`Criado: ${created.id}`);
              } catch (e) {
                setMessage(e instanceof Error ? e.message : "Falha ao criar item.");
              }
            }}
          >
            Adicionar
          </Button>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Status: {item.status} • Ordem: {item.sortOrder}</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await adminClient.updateCarousel(item.id, { title: item.title, status: item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" });
                    const data = await adminClient.carousel({ page: 1, limit: 50 });
                    setItems(data.items ?? []);
                  }}
                >
                  {item.status === "PUBLISHED" ? "Despublicar" : "Publicar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await adminClient.deleteCarousel(item.id);
                    const data = await adminClient.carousel({ page: 1, limit: 50 });
                    setItems(data.items ?? []);
                  }}
                >
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
