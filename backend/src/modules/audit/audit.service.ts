import { Prisma } from '@prisma/client';
import { prisma } from '../../database';

export interface AuditEvent {
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  before?: Prisma.InputJsonValue | null;
  after?: Prisma.InputJsonValue | null;
  ip?: string | null;
}

export const writeAuditLog = async (
  event: AuditEvent,
  client: Prisma.TransactionClient | typeof prisma = prisma
): Promise<void> => {
  await client.auditLog.create({
    data: {
      actorId: event.actorId ?? null,
      action: event.action,
      targetType: event.targetType,
      targetId: event.targetId ?? null,
      before: event.before ?? Prisma.JsonNull,
      after: event.after ?? Prisma.JsonNull,
      ip: event.ip ?? null,
    },
  });
};
