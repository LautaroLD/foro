/*
  Warnings:

  - Made the column `postId` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicId` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_postId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "postId" SET NOT NULL,
ALTER COLUMN "publicId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
