/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_file_id_fkey";

-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "file_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
