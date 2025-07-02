/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Validator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Websites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `websiteTicks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "websiteTicks" DROP CONSTRAINT "websiteTicks_validatorId_fkey";

-- DropForeignKey
ALTER TABLE "websiteTicks" DROP CONSTRAINT "websiteTicks_websiteId_fkey";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Validator";

-- DropTable
DROP TABLE "Websites";

-- DropTable
DROP TABLE "websiteTicks";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validators" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ip" TEXT NOT NULL,

    CONSTRAINT "validators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_ticks" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "validatorId" TEXT NOT NULL,
    "timeStamps" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "WebsiteStatus" NOT NULL,
    "latency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "website_ticks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "websites_userId_idx" ON "websites"("userId");

-- CreateIndex
CREATE INDEX "websites_userId_disabled_idx" ON "websites"("userId", "disabled");

-- CreateIndex
CREATE UNIQUE INDEX "validators_publicKey_key" ON "validators"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "validators_ip_key" ON "validators"("ip");

-- CreateIndex
CREATE INDEX "website_ticks_websiteId_timeStamps_idx" ON "website_ticks"("websiteId", "timeStamps");

-- CreateIndex
CREATE INDEX "website_ticks_validatorId_timeStamps_idx" ON "website_ticks"("validatorId", "timeStamps");

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_ticks" ADD CONSTRAINT "website_ticks_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_ticks" ADD CONSTRAINT "website_ticks_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "validators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
