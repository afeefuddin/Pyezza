/*
  Warnings:

  - The `daysOfWeek` column on the `ChannelSetting` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ChannelSetting" DROP COLUMN "daysOfWeek",
ADD COLUMN     "daysOfWeek" INTEGER[] DEFAULT ARRAY[0, 2, 4]::INTEGER[];
