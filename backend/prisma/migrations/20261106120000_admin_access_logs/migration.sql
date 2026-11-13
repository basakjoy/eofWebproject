CREATE TYPE "AdminSessionExitReason" AS ENUM ('LOGOUT', 'TIMEOUT', 'TOKEN_EXPIRED', 'FORCED');

ALTER TABLE "refresh_tokens" ADD COLUMN "sessionId" TEXT;
CREATE INDEX "refresh_tokens_sessionId_idx" ON "refresh_tokens"("sessionId");

CREATE TABLE "admin_sessions" (
  "id" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "logoutAt" TIMESTAMP(3),
  "exitReason" "AdminSessionExitReason",
  CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "admin_sessions_adminId_loginAt_idx" ON "admin_sessions"("adminId", "loginAt");
CREATE INDEX "admin_sessions_logoutAt_lastSeenAt_idx" ON "admin_sessions"("logoutAt", "lastSeenAt");

CREATE TABLE "page_visits" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "path" VARCHAR(512) NOT NULL,
  "enteredAt" TIMESTAMP(3) NOT NULL,
  "exitedAt" TIMESTAMP(3) NOT NULL,
  "durationSec" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "page_visits_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "page_visits_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "admin_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "page_visits_sessionId_idx" ON "page_visits"("sessionId");
CREATE INDEX "page_visits_sessionId_enteredAt_idx" ON "page_visits"("sessionId", "enteredAt");

CREATE TABLE "admin_activities" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "adminId" TEXT NOT NULL,
  "action" VARCHAR(160) NOT NULL,
  "target" VARCHAR(512),
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "admin_activities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "admin_activities_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "admin_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "admin_activities_sessionId_idx" ON "admin_activities"("sessionId");
CREATE INDEX "admin_activities_adminId_createdAt_idx" ON "admin_activities"("adminId", "createdAt");
