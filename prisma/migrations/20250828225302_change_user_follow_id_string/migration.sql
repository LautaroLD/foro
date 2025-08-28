/*
  Warnings:

  - The primary key for the `UserFollow` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UserFollow" DROP CONSTRAINT "UserFollow_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserFollow_id_seq";
