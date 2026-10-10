CREATE TABLE "profit_distributions" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "profitPercent" DECIMAL(5,2) NOT NULL,
    "investmentCount" INTEGER NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profit_distributions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "profit_distributions_period_key" ON "profit_distributions"("period");

ALTER TABLE "investments" ALTER COLUMN "roi" TYPE DECIMAL(15,2);