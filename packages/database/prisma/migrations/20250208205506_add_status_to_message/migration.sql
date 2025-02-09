-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'CANCELLED', 'SENT');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "status" "MessageStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "MessageTemplate" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
