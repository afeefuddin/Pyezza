/*
  Warnings:

  - Added the required column `scope` to the `Integration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "scope" TEXT NOT NULL;
