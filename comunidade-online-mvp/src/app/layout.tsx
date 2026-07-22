import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Outfit } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import { appConfig, apiUrl } from "@/lib/config";
import "./globals.css";

const bodyFont = DM_Sans({ variable: "--font-body", subsets: ["latin"] });
const displayFont = Outfit({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const serifFont = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Comunidade ArtesanatoInteligente®",
  description: "Comunidade online criada por Fernanda Sklovsky para artesãs que desejam crescer com estratégia, acolhimento e curadoria.",
};

async function getBootstrapUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader.includes("access_token=")) return null;
  try {
    const response = await fetch(apiUrl("/users/me"), { headers: { cookie: cookieHeader, accept: "application/json", "x-tenant-slug": appConfig.tenantSlug }, cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch { return null; }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getBootstrapUser();
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable} ${serifFont.variable}`} suppressHydrationWarning>
      <body className="font-sans text-foreground">
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}
