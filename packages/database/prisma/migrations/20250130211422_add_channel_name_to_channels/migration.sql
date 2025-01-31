-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "channelName" TEXT,
ALTER COLUMN "channelId" DROP NOT NULL;
