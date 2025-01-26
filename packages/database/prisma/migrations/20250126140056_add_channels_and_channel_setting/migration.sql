/*
  Warnings:

  - You are about to drop the column `channelId` on the `Integration` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('socialsips', 'wouldyourather', 'spotlight', 'celebration');

-- AlterTable
ALTER TABLE "Integration" DROP COLUMN "channelId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ChannelSetting" (
    "id" SERIAL NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "timeOfday" INTEGER NOT NULL DEFAULT 36000,
    "channelId" INTEGER NOT NULL,
    "everyNWeek" INTEGER NOT NULL DEFAULT 1,
    "daysOfWeek" TEXT[] DEFAULT ARRAY['Monday', 'Wednesday', 'Friday']::TEXT[],

    CONSTRAINT "ChannelSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "channelId" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "integrationId" INTEGER NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSetting_channelId_key" ON "ChannelSetting"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_publicId_key" ON "Channel"("publicId");

-- AddForeignKey
ALTER TABLE "ChannelSetting" ADD CONSTRAINT "ChannelSetting_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
