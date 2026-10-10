ALTER TABLE "transactions" ADD COLUMN "idempotencyKey" TEXT;
CREATE UNIQUE INDEX "transactions_userId_idempotencyKey_key" ON "transactions"("userId", "idempotencyKey");