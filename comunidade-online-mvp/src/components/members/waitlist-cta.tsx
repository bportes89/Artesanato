"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/stores/session-store";
import { hasJoinedWaitlist, type WaitlistTopic } from "@/lib/member-area";
import { usersService } from "@/lib/services/users";

type WaitlistCtaProps = {
  topic: WaitlistTopic;
  buttonLabel: string;
  successMessage?: string;
  className?: string;
};

export function WaitlistCta({
  topic,
  buttonLabel,
  successMessage = "Pronto! Você será imediatamente informada 💛",
  className,
}: WaitlistCtaProps) {
  const user = useSessionStore((state) => state.user);
  const setUser = useSessionStore((state) => state.setUser);
  const [message, setMessage] = useState<string | null>(hasJoinedWaitlist(user, topic) ? successMessage : null);
  const [loading, setLoading] = useState(false);

  const joined = hasJoinedWaitlist(user, topic);

  return (
    <div className={className}>
      <Button
        type="button"
        variant={joined ? "secondary" : "accent"}
        className="min-h-11 w-full"
        disabled={loading || joined}
        onClick={async () => {
          if (!user) return;
          setLoading(true);
          try {
            const response = await usersService.joinMemberWaitlist({ topic });
            setUser({ ...user, waitlists: response.waitlists });
            setMessage(successMessage);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Não foi possível registrar seu interesse agora.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {joined ? "Você já está na lista ✓" : loading ? "Registrando..." : buttonLabel}
      </Button>
      {message ? <p className="mt-3 text-sm text-[#1B2A3B]">{message}</p> : null}
    </div>
  );
}
