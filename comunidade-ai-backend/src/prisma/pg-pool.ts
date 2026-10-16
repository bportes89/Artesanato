import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

function usesRelaxedSsl(connectionString: string) {
  if ((process.env.DATABASE_SSL_RELAXED ?? '').trim() === '1') return true;
  return /supabase\.co|pooler\.supabase\.com/i.test(connectionString);
}

/** Remove sslmode from URL so pg uses our ssl.rejectUnauthorized instead of verify-full. */
function stripSslModeFromConnectionString(connectionString: string) {
  const qIndex = connectionString.indexOf('?');
  if (qIndex < 0) return connectionString;

  const base = connectionString.slice(0, qIndex);
  const query = connectionString.slice(qIndex + 1);
  const params = new URLSearchParams(query);
  params.delete('sslmode');
  params.delete('sslaccept');
  params.delete('sslrootcert');
  const rest = params.toString();
  return rest ? `${base}?${rest}` : base;
}

export function createPgPool(connectionString: string) {
  const trimmed = connectionString.trim();
  if (!trimmed) {
    throw new Error('DATABASE_URL não configurado');
  }

  const relaxedSsl = usesRelaxedSsl(trimmed);
  const config: pg.PoolConfig = {
    connectionString: relaxedSsl ? stripSslModeFromConnectionString(trimmed) : trimmed,
  };

  if (relaxedSsl) {
    config.ssl = { rejectUnauthorized: false };
  }

  return new pg.Pool(config);
}

export function createPrismaPgAdapter(connectionString: string) {
  return new PrismaPg(createPgPool(connectionString));
}
