import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { createPrismaPgAdapter } from '../src/prisma/pg-pool';

async function main() {
  const connectionString = (process.env.DATABASE_URL ?? '').trim();
  if (/supabase\.co|pooler\.supabase\.com/i.test(connectionString)) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  const prisma = new PrismaClient({ adapter: createPrismaPgAdapter(connectionString) });
  const slug = (process.env.DEFAULT_TENANT_SLUG ?? 'default').trim() || 'default';

  const tenant = await prisma.tenant.upsert({
    where: { slug },
    update: {},
    create: { slug, name: 'Comunidade AI' },
    select: { id: true, slug: true },
  });

  const adminRole = await prisma.role.upsert({
    where: { tenantId_key: { tenantId: tenant.id, key: 'ADMIN' } },
    update: { name: 'Admin' },
    create: { tenantId: tenant.id, key: 'ADMIN', name: 'Admin' },
    select: { id: true, key: true },
  });

  await prisma.role.upsert({
    where: { tenantId_key: { tenantId: tenant.id, key: 'MEMBER' } },
    update: { name: 'Member' },
    create: { tenantId: tenant.id, key: 'MEMBER', name: 'Member' },
    select: { id: true },
  });

  await prisma.role.upsert({
    where: { tenantId_key: { tenantId: tenant.id, key: 'MODERATOR' } },
    update: { name: 'Moderator' },
    create: { tenantId: tenant.id, key: 'MODERATOR', name: 'Moderator' },
    select: { id: true },
  });

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? 'admin@comunidade.ai').toLowerCase();
  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: adminEmail } },
    update: { name: 'Admin' },
    create: { tenantId: tenant.id, email: adminEmail, name: 'Admin', status: 'ACTIVE' },
    select: { id: true, email: true },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { tenantId: tenant.id, userId: admin.id, roleId: adminRole.id },
    select: { id: true },
  });

  const adminPassword = (process.env.SEED_ADMIN_PASSWORD ?? '').trim();
  if (adminPassword) {
    const cost = Number(process.env.BCRYPT_COST ?? 12);
    const passwordHash = await bcrypt.hash(adminPassword, Number.isFinite(cost) ? cost : 12);
    await prisma.userCredential.upsert({
      where: { userId: admin.id },
      update: { passwordHash },
      create: { userId: admin.id, passwordHash },
      select: { id: true },
    });
    console.log(`Admin pronto: ${admin.email} (senha via SEED_ADMIN_PASSWORD)`);
  } else {
    console.warn('SEED_ADMIN_PASSWORD não definido — admin criado sem senha. Use /cadastro ou defina a variável e rode o seed de novo.');
  }

  await prisma.communitySpace.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: 'Geral' } },
    update: { name: 'Geral', status: 'PUBLISHED' },
    create: { tenantId: tenant.id, name: 'Geral', description: 'Discussões gerais', status: 'PUBLISHED' },
    select: { id: true },
  });

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exitCode = 1;
});
