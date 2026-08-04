/**
 * Importa curadoria (URLs prontas) e ebooks locais para produção.
 * Uso:
 *   set ADMIN_EMAIL=... & set ADMIN_PASSWORD=... & node scripts/import-conteudo-prod.mjs
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const API_BASE = (process.env.API_BASE_URL ?? "https://artesanato-backend.onrender.com").replace(/\/$/, "");
const API = `${API_BASE}/api`;
const TENANT = process.env.TENANT_SLUG ?? "default";
const EMAIL = process.env.ADMIN_EMAIL ?? "";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ROOT = path.resolve("conteudo-cliente");

if (!EMAIL || !PASSWORD) {
  console.error("Defina ADMIN_EMAIL e ADMIN_PASSWORD");
  process.exit(1);
}

/** @type {Map<string, string>} */
const jar = new Map();

function storeCookies(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const line of raw) {
    const part = line.split(";")[0];
    const i = part.indexOf("=");
    if (i > 0) jar.set(part.slice(0, i).trim(), part.slice(i + 1).trim());
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function api(method, pathname, { body, json = true } = {}) {
  const headers = {
    "x-tenant-slug": TENANT,
    accept: "application/json",
  };
  if (cookieHeader()) headers.cookie = cookieHeader();
  const csrf = jar.get("csrf_token");
  if (csrf && method !== "GET") headers["x-csrf-token"] = csrf;

  let payload;
  if (body !== undefined) {
    headers["content-type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${API}${pathname}`, { method, headers, body: payload });
  storeCookies(res);
  const text = await res.text();
  let data = text;
  if (json && text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    throw new Error(`${method} ${pathname} -> ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

function parseCuradoriaXlsx(xlsxPath) {
  const tmpZip = path.join(process.env.TEMP ?? "/tmp", "import-curadoria.zip");
  const tmpDir = path.join(process.env.TEMP ?? "/tmp", "import-curadoria-xlsx");
  fs.copyFileSync(xlsxPath, tmpZip);
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -Path '${tmpZip.replace(/'/g, "''")}' -DestinationPath '${tmpDir.replace(/'/g, "''")}' -Force"`,
    { stdio: "pipe" },
  );

  const base = path.join(tmpDir, "xl");
  const ss = fs.readFileSync(path.join(base, "sharedStrings.xml"), "utf8");
  const strings = [...ss.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) =>
    m[1]
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"'),
  );

  function parseSheet(file) {
    const xml = fs.readFileSync(path.join(base, "worksheets", file), "utf8");
    const rows = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)];
    return rows.map((rm) => {
      const row = {};
      for (const c of [...rm[1].matchAll(/<c r="([A-Z]+)(\d+)"([^>]*)>(?:<v>([\s\S]*?)<\/v>)?/g)]) {
        row[c[1]] = (c[3] ?? "").includes('t="s"') ? strings[Number(c[4] ?? 0)] ?? c[4] : c[4];
      }
      return row;
    });
  }

  const tagMap = {
    "01 · Como Precificar": "Como Precificar",
    "02 · Técnicas de Vendas": "Técnicas de Vendas",
    "03 · Como Usar o Canva": "Como Usar o Canva",
    "04 · Legislação do Artesanato": "Legislação do Artesanato",
    "05 · Aulas Gratuitas Fernanda": "Aulas Gratuitas da Fernanda",
    "06 · Redes Sociais": "Redes Sociais",
    "07 · Embalagem e Apresentação": "Embalagem e Apresentação",
    "08 · Marketplaces e E-commerce": "Marketplaces e E-commerce",
  };

  const wb = fs.readFileSync(path.join(base, "workbook.xml"), "utf8");
  const sheets = [...wb.matchAll(/name="([^"]+)" sheetId="(\d+)"/g)].map((m) => ({ name: m[1], id: Number(m[2]) }));
  const items = [];

  for (let i = 2; i <= 9; i++) {
    const sheetName = sheets.find((s) => s.id === i)?.name ?? `sheet${i}`;
    const tag = tagMap[sheetName] ?? sheetName;
    for (const row of parseSheet(`sheet${i}.xml`)) {
      const title = row.B?.trim();
      const urlOrFile = row.D?.trim();
      const description = row.E?.trim();
      if (!title || title === "Título do Conteúdo" || title.startsWith("Sigla para")) continue;
      const isPlaceholder =
        !urlOrFile ||
        urlOrFile.includes("COLE_LINK") ||
        urlOrFile.includes("COLE_PERFIL") ||
        urlOrFile.includes("canva.com/templates/COLE") ||
        (/\.pdf$/i.test(urlOrFile) && !urlOrFile.startsWith("http"));
      if (isPlaceholder) continue;
      let url = urlOrFile;
      if (!/^https?:\/\//i.test(url)) continue;
      items.push({ title, url, tag, description: description || undefined });
    }
  }
  return items;
}

async function uploadPdf(filePath, filename) {
  const stat = fs.statSync(filePath);
  const init = await api("POST", "/uploads/init", {
    body: {
      filename,
      mimeType: "application/pdf",
      sizeBytes: stat.size,
      purpose: "EBOOK_FILE",
    },
  });

  const buf = fs.readFileSync(filePath);
  const put = await fetch(init.uploadUrl, {
    method: "PUT",
    headers: { "content-type": "application/pdf", ...(init.headers ?? {}) },
    body: buf,
  });
  if (!put.ok) throw new Error(`Upload R2 falhou (${put.status}) para ${filename}`);

  await api("POST", "/uploads/complete", { body: { uploadSessionId: init.uploadSessionId } });

  const fileId = init.fileObjectId;
  if (!fileId) {
    const uploads = await api("GET", "/admin/uploads");
    const match = (uploads.items ?? []).find((u) => u.id === init.uploadSessionId) ?? uploads.items?.[0];
    if (!match?.file?.id) throw new Error(`fileId não encontrado após upload de ${filename}`);
    return match.file.id;
  }
  return fileId;
}

async function main() {
  console.log("API:", API);
  await api("GET", "/auth/csrf");
  await api("POST", "/auth/login", { body: { email: EMAIL, password: PASSWORD } });
  const me = await api("GET", "/users/me");
  console.log("Logado como:", me.email, "| roles:", (me.roles ?? []).map((r) => r.key).join(", "));

  const xlsx = path.join(ROOT, "01 Curadoria-20260804T221001Z-1-001", "01 Curadoria", "MASTER_Curadoria_ArtesanatoInteligente.xlsx");
  if (fs.existsSync(xlsx)) {
    const items = parseCuradoriaXlsx(xlsx);
    console.log(`\nCuradoria: ${items.length} itens com URL pronta`);
    let ok = 0;
    for (const item of items) {
      try {
        await api("POST", "/admin/curation", {
          body: { ...item, status: "PUBLISHED" },
        });
        ok++;
        console.log("  +", item.title);
      } catch (e) {
        console.warn("  !", item.title, "-", e.message);
      }
    }
    console.log(`Curadoria publicada: ${ok}/${items.length}`);
  }

  const ebooks = [
    {
      file: path.join(ROOT, "03 Ebooks-20260804T221047Z-1-001", "03 Ebooks", "EBOOK FOTOGRAFIA.pdf"),
      title: "Guia de Fotografia para Artesãs",
      description: "Fotografe suas peças com celular, luz natural e enquadramento profissional.",
    },
    {
      file: path.join(ROOT, "03 Ebooks-20260804T221047Z-1-001", "03 Ebooks", "Ebook MODA & CROCHE.pdf"),
      title: "Moda & Crochê",
      description: "Ebook da Fernanda Sklovsky sobre moda e crochê aplicados ao artesanato.",
    },
  ];

  console.log("\nEbooks:");
  for (const ebook of ebooks) {
    if (!fs.existsSync(ebook.file)) {
      console.warn("  ! Arquivo ausente:", ebook.file);
      continue;
    }
    try {
      console.log("  Upload:", ebook.title, "...");
      const fileId = await uploadPdf(ebook.file, path.basename(ebook.file));
      const created = await api("POST", "/admin/ebooks", {
        body: { title: ebook.title, description: ebook.description, fileId },
      });
      await api("POST", `/admin/ebooks/${created.id}/publish`, { body: { published: "true" } });
      console.log("  + Publicado:", ebook.title, `(id: ${created.id})`);

      if (ebook.title.includes("Fotografia")) {
        try {
          await api("POST", "/admin/entitlements/grant", {
            body: { userId: me.id, resourceType: "EBOOK", resourceId: created.id, sourceRef: "beta-import" },
          });
          console.log("  + Entitlement concedido ao admin (download ainda pode exigir libraryItem)");
        } catch (e) {
          console.warn("  ! entitlement:", e.message);
        }
      }
    } catch (e) {
      console.warn("  !", ebook.title, "-", e.message);
    }
  }

  const curation = await api("GET", "/content/curation");
  const pubEbooks = await api("GET", "/ebooks");
  console.log("\nResumo produção:");
  console.log("  Curadoria visível:", curation.length, "itens");
  console.log("  Ebooks publicados:", pubEbooks.length, "itens");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
