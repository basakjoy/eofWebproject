import { Prisma } from '@prisma/client';
import { PermissionSubject, Scope } from './permissions.types';

export const scopeToPrismaWhere = (
  scope: Scope,
  actor: Pick<PermissionSubject, 'id' | 'teamId' | 'departmentId'>
): Prisma.UserWhereInput => {
  if (scope === 'ALL') return {};
  if (scope === 'OWN') return { id: actor.id };
  if (scope === 'TEAM') {
    return actor.teamId ? { teamId: actor.teamId } : { id: { in: [] } };
  }
  return actor.departmentId ? { departmentId: actor.departmentId } : { id: { in: [] } };
};
