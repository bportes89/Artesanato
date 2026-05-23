"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingService } from "@/lib/services/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/page-header";
export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ goal: "", experience: "", whatsapp: "" });
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const state = await onboardingService.get();
        if (!active) return;
        const data = (state?.data ?? {}) as { goal?: unknown; experience?: unknown; whatsapp?: unknown };
        setForm({
          goal: typeof data.goal === "string" ? data.goal : "",
          experience: typeof data.experience === "string" ? data.experience : "",
          whatsapp: typeof data.whatsapp === "string" ? data.whatsapp : "",
        });
        setCompletedAt(typeof state?.completedAt === "string" ? state.completedAt : null);
      } catch (err) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "";
        setError(msg === "Unauthorized" ? "Sua sessão expirou. Entre novamente para ver/salvar suas respostas." : "Não foi possível carregar suas respostas.");
      } finally {
        if (!active) return;
        setLoadingState(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Onboarding" title="Seu primeiro acesso" description="Conte um pouco sobre seu momento para personalizarmos trilhas, comunidade e mentoria." />
      <Card>
        <CardHeader>
          <CardTitle>Configuração inicial</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 lg:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError(null);
              setMessage(null);
              try {
                await onboardingService.progress({ step: 0, data: form });
                if (!completedAt) {
                  await onboardingService.complete();
                  router.push("/membros");
                  router.refresh();
                  return;
                }
                setMessage("Respostas atualizadas.");
              } catch (err) {
                setError(err instanceof Error ? err.message : "Falha ao salvar onboarding.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loadingState ? (
              <div className="lg:col-span-2">
                <p className="text-sm text-muted-foreground">Carregando suas respostas...</p>
              </div>
            ) : null}
            <Input placeholder="Seu principal objetivo" value={form.goal} onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value }))} required />
            <Input placeholder="Seu WhatsApp" value={form.whatsapp} onChange={(event) => setForm((current) => ({ ...current, whatsapp: event.target.value }))} />
            <div className="lg:col-span-2">
              <Textarea placeholder="Como a comunidade pode te ajudar agora?" value={form.experience} onChange={(event) => setForm((current) => ({ ...current, experience: event.target.value }))} required />
            </div>
            {message ? (
              <div className="lg:col-span-2">
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
            ) : null}
            {error ? (
              <div className="lg:col-span-2">
                <p className="text-sm text-destructive">{error}</p>
                {error.includes("Entre novamente") ? (
                  <a href="/login" className="mt-2 inline-flex text-sm font-medium text-primary hover:text-primary/80">
                    Ir para o login
                  </a>
                ) : null}
              </div>
            ) : null}
            <div className="lg:col-span-2 flex justify-end">
              <Button disabled={loading || loadingState}>{loading ? "Salvando..." : completedAt ? "Salvar respostas" : "Concluir onboarding"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
