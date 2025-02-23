/*
  Warnings:

  - You are about to drop the `_UserLikesComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserLikesPosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserLikesComments" DROP CONSTRAINT "_UserLikesComments_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikesComments" DROP CONSTRAINT "_UserLikesComments_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikesPosts" DROP CONSTRAINT "_UserLikesPosts_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikesPosts" DROP CONSTRAINT "_UserLikesPosts_B_fkey";

-- DropTable
DROP TABLE "_UserLikesComments";

-- DropTable
DROP TABLE "_UserLikesPosts";

-- CreateTable
CREATE TABLE "LikePost" (
    "id" TEXT NOT NULL,

    CONSTRAINT "LikePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeComment" (
    "id" TEXT NOT NULL,

    CONSTRAINT "LikeComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LikePost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LikePost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LikePostUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LikePostUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LikeCommentUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LikeCommentUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LikeComment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LikeComment_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LikePost_B_index" ON "_LikePost"("B");

-- CreateIndex
CREATE INDEX "_LikePostUser_B_index" ON "_LikePostUser"("B");

-- CreateIndex
CREATE INDEX "_LikeCommentUser_B_index" ON "_LikeCommentUser"("B");

-- CreateIndex
CREATE INDEX "_LikeComment_B_index" ON "_LikeComment"("B");

-- AddForeignKey
ALTER TABLE "_LikePost" ADD CONSTRAINT "_LikePost_A_fkey" FOREIGN KEY ("A") REFERENCES "LikePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikePost" ADD CONSTRAINT "_LikePost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikePostUser" ADD CONSTRAINT "_LikePostUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LikePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikePostUser" ADD CONSTRAINT "_LikePostUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeCommentUser" ADD CONSTRAINT "_LikeCommentUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LikeComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeCommentUser" ADD CONSTRAINT "_LikeCommentUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeComment" ADD CONSTRAINT "_LikeComment_A_fkey" FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeComment" ADD CONSTRAINT "_LikeComment_B_fkey" FOREIGN KEY ("B") REFERENCES "LikeComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
