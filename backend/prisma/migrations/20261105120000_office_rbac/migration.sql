CREATE TYPE "Scope" AS ENUM ('OWN', 'TEAM', 'DEPARTMENT', 'ALL');
CREATE TYPE "OverrideEffect" AS ENUM ('GRANT', 'DENY');

ALTER TABLE "roles"
ADD COLUMN "level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isSystem" BOOLEAN NOT NULL DEFAULT false;

UPDATE "roles"
SET
  "level" = CASE LOWER("name")
    WHEN 'super_admin' THEN 100
    WHEN 'admin' THEN 80
    WHEN 'team_leader' THEN 60
    WHEN 'senior' THEN 40
    WHEN 'staff' THEN 20
    ELSE "level"
  END,
  "isSystem" = LOWER("name") IN ('super_admin', 'admin', 'team_leader', 'senior', 'staff');

CREATE INDEX "roles_level_idx" ON "roles"("level");

ALTER TABLE "permissions" ADD COLUMN "key" TEXT;
UPDATE "permissions" SET "key" = "name";
ALTER TABLE "permissions" ALTER COLUMN "key" SET NOT NULL;
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

ALTER TABLE "role_permissions"
ADD COLUMN "scope" "Scope" NOT NULL DEFAULT 'ALL';

CREATE TABLE "departments" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

CREATE TABLE "teams" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "departmentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");
CREATE INDEX "teams_departmentId_idx" ON "teams"("departmentId");
ALTER TABLE "teams" ADD CONSTRAINT "teams_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "users"
ADD COLUMN "teamId" TEXT,
ADD COLUMN "departmentId" TEXT,
ADD COLUMN "createdById" TEXT,
ADD COLUMN "permissionsVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
UPDATE "users" SET "permissionsVersion" = "tokenVersion";
UPDATE "users" SET "isActive" = ("status" = 'active');
CREATE INDEX "users_teamId_idx" ON "users"("teamId");
CREATE INDEX "users_departmentId_idx" ON "users"("departmentId");
CREATE INDEX "users_roleId_status_idx" ON "users"("roleId", "status");
CREATE INDEX "users_createdById_idx" ON "users"("createdById");
ALTER TABLE "users" ADD CONSTRAINT "users_teamId_fkey"
  FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey"
  FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "user_permission_overrides" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "permissionId" TEXT NOT NULL,
  "scope" "Scope",
  "effect" "OverrideEffect" NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "grantedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_permission_overrides_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_permission_overrides_userId_permissionId_key"
  ON "user_permission_overrides"("userId", "permissionId");
CREATE INDEX "user_permission_overrides_userId_expiresAt_idx"
  ON "user_permission_overrides"("userId", "expiresAt");
CREATE INDEX "user_permission_overrides_permissionId_idx"
  ON "user_permission_overrides"("permissionId");
CREATE INDEX "user_permission_overrides_grantedById_idx"
  ON "user_permission_overrides"("grantedById");
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_permissionId_fkey"
  FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_grantedById_fkey"
  FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "audit_logs" (
  "id" TEXT NOT NULL,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT,
  "before" JSONB,
  "after" JSONB,
  "ip" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_logs_actorId_createdAt_idx" ON "audit_logs"("actorId", "createdAt");
CREATE INDEX "audit_logs_targetType_targetId_createdAt_idx"
  ON "audit_logs"("targetType", "targetId", "createdAt");
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
