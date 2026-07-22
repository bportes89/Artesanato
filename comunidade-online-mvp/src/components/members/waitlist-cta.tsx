"use client";

import { useEffect, useState } from "react";
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
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  const joined = hasJoinedWaitlist(user, topic);

  useEffect(() => {
    if (joined) {
      setMessage(successMessage);
      setMessageTone("success");
    }
  }, [joined, successMessage]);

  return (
    <div className={className}>
      <Button
        type="button"
        variant={joined ? "secondary" : "accent"}
        className="min-h-11 w-full"
        disabled={loading || joined}
        onClick={async () => {
          setLoading(true);
          setMessage(null);
          setMessageTone("success");
          try {
            const currentUser = user ?? (await usersService.meClient());
            if (!user) setUser(currentUser);

            const response = await usersService.joinMemberWaitlist({ topic });
            setUser({ ...currentUser, waitlists: response.waitlists });
            setMessage(successMessage);
            setMessageTone("success");
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Não foi possível registrar seu interesse agora.");
            setMessageTone("error");
          } finally {
            setLoading(false);
          }
        }}
      >
        {joined ? "Você já está na lista ✓" : loading ? "Registrando..." : buttonLabel}
      </Button>
      {message ? (
        <p className={`mt-3 text-sm ${messageTone === "success" ? "text-[#1B2A3B]" : "text-[#D4542A]"}`} aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
