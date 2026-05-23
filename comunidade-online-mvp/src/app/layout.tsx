import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/components/providers";
import { appConfig, apiUrl } from "@/lib/config";
import "./globals.css";

const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
const serif = Cormorant_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
export const metadata: Metadata = { title: "Fernanda Sklovsky", description: "Plataforma premium de cursos, curadoria, ebooks, comunidade e mentoria." };

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
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body className="font-sans text-foreground">
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}

