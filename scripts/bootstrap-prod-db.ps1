# Cria schema + tenant/admin em um Postgres novo (Supabase ou Render).
# Uso (PowerShell):
#   $env:DATABASE_URL = "postgresql://..."   # preferir Direct connection no Supabase para db push
#   $env:SEED_ADMIN_EMAIL = "admin1@comunidade.ai"
#   $env:SEED_ADMIN_PASSWORD = "sua-senha-forte"
#   .\scripts\bootstrap-prod-db.ps1

$ErrorActionPreference = "Stop"
if (-not $env:DATABASE_URL) {
  Write-Error "Defina DATABASE_URL (connection string do Postgres novo)."
}

$backend = Join-Path $PSScriptRoot "..\comunidade-ai-backend"
Push-Location $backend
try {
  npm run prisma:generate
  if ($LASTEXITCODE -ne 0) { throw "prisma:generate falhou" }
  npm run prisma:push
  if ($LASTEXITCODE -ne 0) { throw "prisma:push falhou" }
  npm run prisma:seed
  if ($LASTEXITCODE -ne 0) { throw "prisma:seed falhou" }
  Write-Host ""
  Write-Host "OK: banco inicializado. Proximo passo: atualizar DATABASE_URL no Render e redeploy."
  Write-Host "Depois teste: https://artesanato-backend.onrender.com/api/auth/csrf (header x-tenant-slug: default)"
} finally {
  Pop-Location
}
