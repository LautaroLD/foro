/*
  Warnings:

  - You are about to drop the `_LikeComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikeCommentUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikePost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikePostUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LikeComment" DROP CONSTRAINT "_LikeComment_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikeComment" DROP CONSTRAINT "_LikeComment_B_fkey";

-- DropForeignKey
ALTER TABLE "_LikeCommentUser" DROP CONSTRAINT "_LikeCommentUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikeCommentUser" DROP CONSTRAINT "_LikeCommentUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_LikePost" DROP CONSTRAINT "_LikePost_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikePost" DROP CONSTRAINT "_LikePost_B_fkey";

-- DropForeignKey
ALTER TABLE "_LikePostUser" DROP CONSTRAINT "_LikePostUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LikePostUser" DROP CONSTRAINT "_LikePostUser_B_fkey";

-- AlterTable
ALTER TABLE "LikeComment" ADD COLUMN     "commentId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "LikePost" ADD COLUMN     "postId" TEXT,
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_LikeComment";

-- DropTable
DROP TABLE "_LikeCommentUser";

-- DropTable
DROP TABLE "_LikePost";

-- DropTable
DROP TABLE "_LikePostUser";

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikePost" ADD CONSTRAINT "LikePost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeComment" ADD CONSTRAINT "LikeComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeComment" ADD CONSTRAINT "LikeComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
