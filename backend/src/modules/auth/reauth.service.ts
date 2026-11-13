import bcrypt from 'bcryptjs';
import { prisma } from '../../database';
import { writeAuditLog } from '../audit/audit.service';

export interface PasswordConfirmationContext {
  actorId: string;
  passwordConfirm?: string;
  action: string;
  targetType: string;
  targetId?: string;
  ip?: string;
}

export const verifyPasswordConfirmation = async (
  context: PasswordConfirmationContext
): Promise<boolean> => {
  const actor = await prisma.user.findUnique({
    where: { id: context.actorId },
    select: { password: true, status: true, isActive: true },
  });
  const confirmed = Boolean(
    actor &&
    actor.status === 'active' &&
    actor.isActive &&
    context.passwordConfirm &&
    await bcrypt.compare(context.passwordConfirm, actor.password)
  );
  if (!confirmed) {
    await writeAuditLog({
      actorId: context.actorId,
      action: 'REAUTHENTICATION_FAILED',
      targetType: context.targetType,
      targetId: context.targetId,
      after: { attemptedAction: context.action },
      ip: context.ip,
    });
  }
  return confirmed;
};
