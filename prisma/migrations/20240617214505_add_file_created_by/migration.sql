-- AlterTable
ALTER TABLE "files" ADD COLUMN     "created_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
