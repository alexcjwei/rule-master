-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "embedding" vector NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
