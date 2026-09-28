CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "translations_entityType_entityId_locale_field_key"
ON "translations"("entityType", "entityId", "locale", "field");

CREATE INDEX "translations_entityType_entityId_locale_idx"
ON "translations"("entityType", "entityId", "locale");