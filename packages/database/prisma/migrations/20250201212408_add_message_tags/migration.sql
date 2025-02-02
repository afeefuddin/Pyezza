-- CreateEnum
CREATE TYPE "MessageTemplateTags" AS ENUM ('fun', 'hypothetical', 'food', 'cars', 'games', 'aspirational');

-- AlterTable
ALTER TABLE "MessageTemplate" ADD COLUMN     "topic" "MessageTemplateTags"[],
ALTER COLUMN "gif" DROP NOT NULL;
