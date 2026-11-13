import 'dotenv/config';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const email = 'princeandy248@gmail.com';
const demoName = 'Prince Andy 248';
const demoUsername = 'princeandy248_demo';
const demoPlan = 'TEST DATA - NOT REAL FUNDS';
const demoIdempotencyKey = 'synthetic-investor-demo-2026-11';
const configuredPassword = process.env.DEMO_INVESTOR_PASSWORD;

const run = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'production' || process.env.ALLOW_SYNTHETIC_INVESTOR_SEED !== 'true') {
    throw new Error('Set ALLOW_SYNTHETIC_INVESTOR_SEED=true in a non-production environment to continue.');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be configured.');
  }
  if (configuredPassword && configuredPassword.length < 10) {
    throw new Error('DEMO_INVESTOR_PASSWORD must contain at least 10 characters.');
  }

  const databaseHost = new URL(process.env.DATABASE_URL).hostname;
  if (!['localhost', '127.0.0.1', '::1'].includes(databaseHost)) {
    throw new Error('Synthetic investor data can only be created in a local database.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, username: true },
  });
  if (existingUser) {
    if (existingUser.name !== demoName || existingUser.username !== demoUsername) {
      throw new Error('That email already belongs to a non-demo profile; no data was changed.');
    }

    const existingDemoInvestment = await prisma.investment.findFirst({
      where: { userId: existingUser.id, plan: demoPlan, amount: 10_000 },
      select: { id: true },
    });
    if (!existingDemoInvestment) {
      throw new Error('The demo account exists without its marked test investment; no data was changed.');
    }

    if (configuredPassword) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: await bcrypt.hash(configuredPassword, 12) },
      });
      console.info('Password updated for the verified local synthetic investor profile.');
      return;
    }

    console.info('Synthetic investor profile is already present; no changes made.');
    return;
  }

  const password = await bcrypt.hash(configuredPassword || randomUUID(), 12);
  const userId = randomUUID();
  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        id: userId,
        name: demoName,
        username: demoUsername,
        email,
        password,
        role: 'investor',
        status: 'active',
        isActive: true,
      },
    });

    const investment = await tx.investment.create({
      data: {
        id: randomUUID(),
        userId,
        amount: 10_000,
        plan: demoPlan,
        status: 'active',
        roi: 0,
      },
    });

    await tx.transaction.create({
      data: {
        id: randomUUID(),
        userId,
        idempotencyKey: demoIdempotencyKey,
        type: 'investment',
        amount: 10_000,
        description: 'SYNTHETIC TEST DATA ONLY - no funds received or invested',
        status: 'completed',
        metadata: JSON.stringify({ synthetic: true, investmentId: investment.id }),
      },
    });
  });

  console.info('Created a clearly labeled local demo investor with a $10,000 synthetic investment.');
};

run()
  .catch((error: unknown) => {
    console.error('Unable to seed demo investor:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
