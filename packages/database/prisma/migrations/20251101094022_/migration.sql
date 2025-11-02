-- AlterTable
ALTER TABLE "ChannelSetting" ADD COLUMN     "forwardResponseFromThread" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "forwardedResponseFromThread" BOOLEAN NOT NULL DEFAULT false;
