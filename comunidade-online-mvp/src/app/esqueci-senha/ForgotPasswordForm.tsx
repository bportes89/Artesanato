"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset } from "@/lib/actions";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  return (
    <div className="mt-6">
      <form action={formAction} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          placeholder="seuemail@exemplo.com"
          className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-900 focus:ring-2"
        />
        <button
          disabled={pending}
          className="mt-2 h-12 rounded-xl bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {pending ? "Gerando link..." : "Gerar link de redefiniÃ§Ã£o"}
        </button>
      </form>

      {state ? (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800">
          {state.resetUrl ? (
            <div className="space-y-2">
              <div>Link gerado (MVP sem envio de e-mail):</div>
              <Link className="font-medium text-zinc-950 hover:underline" href={state.resetUrl}>
                {state.resetUrl}
              </Link>
            </div>
          ) : (
            <div>
              Se existir uma conta com esse e-mail, vocÃª verÃ¡ um link de redefiniÃ§Ã£o aqui.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

