-- AlterTable
ALTER TABLE "ChannelSetting" ADD COLUMN     "reminderMessage" TEXT,
ADD COLUMN     "reminderOn" BOOLEAN NOT NULL DEFAULT false;
