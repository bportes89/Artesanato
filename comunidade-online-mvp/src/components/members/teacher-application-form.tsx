"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/hooks/use-session";
import { usersService } from "@/lib/services/users";

function formatWhatsApp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function TeacherApplicationForm() {
  const user = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [city, setCity] = useState("");
  const [technique, setTechnique] = useState("");
  const [experience, setExperience] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(
    () => [name, city, technique, experience, whatsapp].every((field) => field.trim().length >= 2),
    [city, experience, name, technique, whatsapp],
  );

  if (!open && !submitted) {
    return (
      <Button type="button" variant="outline" className="min-h-11 w-full" onClick={() => setOpen(true)}>
        Quero me candidatar como professora
      </Button>
    );
  }

  if (submitted) {
    return <p className="text-sm text-[#1B2A3B]">{message}</p>;
  }

  return (
    <Card className="border border-[#D4542A]/15 bg-white/85">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-[#1B2A3B]">Candidatura de professora</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" />
        <Input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Sua cidade" />
        <Input value={technique} onChange={(event) => setTechnique(event.target.value)} placeholder="Técnica que você domina" />
        <Textarea
          value={experience}
          onChange={(event) => setExperience(event.target.value)}
          placeholder="Há quanto tempo você domina essa técnica?"
          className="min-h-[110px]"
        />
        <Input
          value={whatsapp}
          onChange={(event) => setWhatsapp(formatWhatsApp(event.target.value))}
          placeholder="Seu WhatsApp"
          inputMode="numeric"
        />
        {message ? <p className="text-sm text-[#1B2A3B]">{message}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="min-h-11 flex-1"
            disabled={loading || !canSubmit}
            onClick={async () => {
              setLoading(true);
              try {
                await usersService.createTeacherApplication({
                  name: name.trim(),
                  city: city.trim(),
                  technique: technique.trim(),
                  experience: experience.trim(),
                  whatsapp: whatsapp.trim(),
                });
                setMessage("Sua candidatura foi enviada para a Fernanda. Obrigada por compartilhar seu saber.");
                setSubmitted(true);
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Não foi possível enviar sua candidatura agora.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Enviando..." : "Enviar candidatura"}
          </Button>
          <Button type="button" variant="ghost" className="min-h-11 flex-1" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
