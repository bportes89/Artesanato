"use client";

import { useActionState } from "react";

import { registerUser } from "@/lib/actions";

export default function CadastroForm() {
  const [state, formAction, pending] = useActionState(registerUser, null);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-3">
      <input
        name="name"
        placeholder="Seu nome (opcional)"
        className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-900 focus:ring-2"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="seuemail@exemplo.com"
        className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-900 focus:ring-2"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="Senha (mÃ­n. 8 caracteres)"
        className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none ring-zinc-900 focus:ring-2"
      />

      {state?.error ? (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900">{state.error}</div>
      ) : null}

      <button
        disabled={pending}
        className="mt-2 h-12 rounded-xl bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}

