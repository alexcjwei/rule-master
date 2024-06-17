CREATE EXTENSION IF NOT EXISTS vector;
-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "file_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vector" vector NOT NULL,
    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "Document"
ADD CONSTRAINT "Document_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;