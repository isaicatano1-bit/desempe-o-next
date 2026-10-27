-- AlterEnum
ALTER TYPE "ReservationStatus" ADD VALUE IF NOT EXISTS 'IN_PROCESS';

-- AlterTable
ALTER TABLE "Reservation"
    ADD COLUMN "expiresAt" TIMESTAMP(3),
    ADD COLUMN "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_idempotencyKey_key"
    ON "Reservation"("userId", "idempotencyKey")
    WHERE "idempotencyKey" IS NOT NULL;

-- CreateIndex
CREATE INDEX "Reservation_userId_startAt_idx"
    ON "Reservation"("userId", "startAt");

CREATE INDEX "Reservation_spaceId_startAt_idx"
    ON "Reservation"("spaceId", "startAt");

CREATE INDEX "Reservation_status_startAt_idx"
    ON "Reservation"("status", "startAt");

CREATE INDEX "Reservation_spaceId_status_startAt_idx"
    ON "Reservation"("spaceId", "status", "startAt");

CREATE INDEX "Reservation_spaceId_expiresAt_idx"
    ON "Reservation"("spaceId", "expiresAt");
