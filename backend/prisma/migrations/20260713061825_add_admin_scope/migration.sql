/*
  Warnings:

  - You are about to drop the column `name` on the `signals` table. All the data in the column will be lost.
  - You are about to drop the column `targetPrice` on the `signals` table. All the data in the column will be lost.
  - Added the required column `pair` to the `signals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminScope" AS ENUM ('SIGNAL_ADMIN', 'CONTENT_ADMIN', 'SUPER_ADMIN');

-- AlterTable
ALTER TABLE "_UserWithdrawalAccountToWithdrawal" ADD CONSTRAINT "_UserWithdrawalAccountToWithdrawal_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserWithdrawalAccountToWithdrawal_AB_unique";

-- AlterTable
ALTER TABLE "signals" DROP COLUMN "name",
DROP COLUMN "targetPrice",
ADD COLUMN     "direction" TEXT,
ADD COLUMN     "entryPrice" TEXT,
ADD COLUMN     "pair" TEXT NOT NULL,
ADD COLUMN     "reliability" TEXT,
ADD COLUMN     "stopLoss" TEXT,
ADD COLUMN     "takeProfit" TEXT,
ADD COLUMN     "takeProfit1" TEXT,
ADD COLUMN     "takeProfit2" TEXT,
ADD COLUMN     "takeProfit3" TEXT,
ADD COLUMN     "timeframe" TEXT,
ALTER COLUMN "strength" DROP NOT NULL,
ALTER COLUMN "source" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "adminScope" "AdminScope",
ADD COLUMN     "adminScopeGrantedAt" TIMESTAMP(3),
ADD COLUMN     "adminScopeGrantedBy" TEXT;

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
