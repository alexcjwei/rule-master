/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `files` will be added. If there are existing duplicate values, this will fail.
  - Made the column `key` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "files" ALTER COLUMN "key" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "files_key_key" ON "files"("key");
