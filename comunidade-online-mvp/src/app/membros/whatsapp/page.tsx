import { requireUser } from "@/lib/auth";

export default async function WhatsAppPage() {
  await requireUser();

  const groupUrl = process.env.WHATSAPP_GROUP_URL ?? "";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">WhatsApp</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Entre no grupo para receber avisos e participar das conversas.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {groupUrl ? (
          <div className="space-y-4">
            <div className="text-sm text-zinc-700">
              Clique para entrar no grupo (vocÃª serÃ¡ direcionado ao WhatsApp).
            </div>
            <a
              className="inline-flex h-12 items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800"
              href={groupUrl}
              target="_blank"
              rel="noreferrer"
            >
              Entrar no grupo
            </a>
          </div>
        ) : (
          <div className="text-sm text-zinc-700">
            Link do grupo ainda nÃ£o configurado. Defina WHATSAPP_GROUP_URL no arquivo .env.
          </div>
        )}
      </section>
    </div>
  );
}

