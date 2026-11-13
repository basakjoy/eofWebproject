import { PrismaClient } from '@prisma/client';
import { permissionDefinitions, permissionMatrix, systemRoles } from '../src/modules/rbac/permissions.config';
import { PermissionKey, roleNames } from '../src/modules/rbac/permissions.types';

const prisma = new PrismaClient();

const run = async (): Promise<void> => {
  const permissions = new Map<PermissionKey, string>();
  for (const definition of permissionDefinitions) {
    const [resource, action] = definition.key.split(':');
    const permission = await prisma.permission.upsert({
      where: { key: definition.key },
      update: {
        name: definition.key,
        description: definition.description,
        resource,
        action,
      },
      create: {
        name: definition.key,
        key: definition.key,
        description: definition.description,
        resource,
        action,
      },
      select: { id: true },
    });
    permissions.set(definition.key, permission.id);
  }

  const roles = new Map<string, { id: string; level: number; isSystem: boolean }>();
  const rolesWithChangedPolicy = new Set<string>();
  for (const definition of systemRoles) {
    const previous = await prisma.role.findUnique({
      where: { name: definition.name },
      select: { id: true, level: true, isSystem: true },
    });
    const role = await prisma.role.upsert({
      where: { name: definition.name },
      update: {
        description: definition.description,
        level: definition.level,
        isSystem: true,
      },
      create: {
        name: definition.name,
        description: definition.description,
        level: definition.level,
        isSystem: true,
      },
      select: { id: true, level: true, isSystem: true },
    });
    roles.set(definition.name, role);
    if (previous && (previous.level !== role.level || previous.isSystem !== role.isSystem)) {
      rolesWithChangedPolicy.add(role.id);
    }
  }

  const officePermissionIds = [...permissions.values()];
  for (const definition of systemRoles) {
    const role = roles.get(definition.name);
    if (!role) throw new Error(`Seeded role is missing: ${definition.name}`);
    const desired = permissionMatrix[definition.name];
    const desiredIds = new Set(
      Object.keys(desired).map((key) => permissions.get(key as PermissionKey)).filter((id): id is string => Boolean(id))
    );
    const existing = await prisma.rolePermission.findMany({
      where: { roleId: role.id, permissionId: { in: officePermissionIds } },
      select: { id: true, permissionId: true, scope: true },
    });
    const existingByPermission = new Map(existing.map((entry) => [entry.permissionId, entry]));
    let mappingsChanged = rolesWithChangedPolicy.has(role.id);

    for (const entry of existing) {
      if (!desiredIds.has(entry.permissionId)) {
        await prisma.rolePermission.delete({ where: { id: entry.id } });
        mappingsChanged = true;
      }
    }

    for (const [permissionKey, scope] of Object.entries(desired)) {
      if (!scope) continue;
      const permissionId = permissions.get(permissionKey as PermissionKey);
      if (!permissionId) throw new Error(`Seeded permission is missing: ${permissionKey}`);
      const existingMapping = existingByPermission.get(permissionId);
      if (existingMapping?.scope === scope) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: { scope },
        create: { roleId: role.id, permissionId, scope },
      });
      mappingsChanged = true;
    }

    if (mappingsChanged) {
      await prisma.user.updateMany({
        where: { roleId: role.id },
        data: { permissionsVersion: { increment: 1 } },
      });
    }
  }

  const usersToAssign = await prisma.user.findMany({
    where: {
      OR: [
        { roleId: null },
        { role: { in: [...roleNames, 'user', 'investor'] } },
        { adminScope: 'SUPER_ADMIN' },
      ],
    },
    select: { id: true, role: true, roleId: true, adminScope: true },
  });
  for (const user of usersToAssign) {
    const roleName = user.adminScope === 'SUPER_ADMIN'
      ? 'super_admin'
      : roleNames.includes(user.role as (typeof roleNames)[number]) ? user.role : 'staff';
    const role = roles.get(roleName);
    if (!role) throw new Error(`Default RBAC role is missing: ${roleName}`);
    if (user.roleId !== role.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { roleId: role.id, permissionsVersion: { increment: 1 } },
      });
    }
  }
};

run()
  .catch((error: unknown) => {
    console.error('RBAC seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
