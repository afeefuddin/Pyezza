-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "taggedMembers" TEXT[] DEFAULT ARRAY[]::TEXT[];
