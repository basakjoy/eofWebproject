ALTER TABLE "users"
  ALTER COLUMN "email" DROP NOT NULL,
  ADD COLUMN "username" TEXT,
  ADD COLUMN "adminPermissionsConfigured" BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
