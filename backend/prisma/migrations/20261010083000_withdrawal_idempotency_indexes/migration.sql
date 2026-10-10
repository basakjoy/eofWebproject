ALTER TABLE "withdrawals" ADD COLUMN "idempotencyKey" TEXT;
CREATE UNIQUE INDEX "withdrawals_userId_idempotencyKey_key" ON "withdrawals"("userId", "idempotencyKey");
CREATE INDEX "withdrawals_status_createdAt_idx" ON "withdrawals"("status", "createdAt");
CREATE INDEX "withdrawals_userId_createdAt_idx" ON "withdrawals"("userId", "createdAt");
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");
CREATE INDEX "notifications_userId_read_createdAt_idx" ON "notifications"("userId", "read", "createdAt");