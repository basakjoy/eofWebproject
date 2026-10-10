import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    transactionOptions: { maxWait: 5_000, timeout: 10_000 },
    log: [{ emit: 'event', level: 'query' }, 'error', 'warn'],
  });

const registerQueryListener = prisma.$on as unknown as (
  event: 'query',
  listener: (event: { duration: number; target: string }) => void
) => void;
registerQueryListener.call(prisma, 'query', (event) => {
  if (event.duration >= 500) {
    console.warn(JSON.stringify({ level: 'warn', event: 'slow_database_query', target: event.target, durationMs: event.duration }));
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
