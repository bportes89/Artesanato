"use client";
import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload } from "@/hooks/use-upload";
export function UploadPanel() {
  const [message, setMessage] = useState<string | null>(null);
  const upload = useFileUpload();
  return <Card><CardHeader><CardTitle>Upload de materiais</CardTitle></CardHeader><CardContent className="space-y-4"><label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-border bg-secondary/40 px-6 py-10 text-center"><UploadCloud className="h-8 w-8 text-primary" /><div><p className="font-medium">Enviar imagem, PDF ou material extra</p><p className="text-sm text-muted-foreground">Arquivos vão direto para R2 com URL assinada.</p></div><input type="file" className="hidden" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setMessage(null); try { await upload.mutateAsync({ file, purpose: file.type === 'application/pdf' ? 'EBOOK' : 'IMAGE' }); setMessage('Upload concluído com sucesso.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha no upload.'); } }} /></label>{upload.isPending ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Enviando arquivo...</div> : null}{message ? <p className="text-sm text-muted-foreground">{message}</p> : null}<Button variant="secondary" className="w-full">Abrir biblioteca</Button></CardContent></Card>;
}

