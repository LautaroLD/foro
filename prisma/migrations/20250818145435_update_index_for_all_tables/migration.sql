-- DropIndex
DROP INDEX "idx_account_id";

-- DropIndex
DROP INDEX "idx_account_provider_provider_account_id";

-- DropIndex
DROP INDEX "idx_category_name";

-- DropIndex
DROP INDEX "idx_category_slug";

-- DropIndex
DROP INDEX "idx_session_session_token";

-- DropIndex
DROP INDEX "idx_tag_name";

-- DropIndex
DROP INDEX "idx_tag_slug";

-- DropIndex
DROP INDEX "idx_user_email";

-- DropIndex
DROP INDEX "idx_user_id";

-- CreateIndex
CREATE INDEX "idx_comment_post_created_at" ON "Comment"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_like_post_post_user" ON "LikePost"("postId", "userId");

-- CreateIndex
CREATE INDEX "idx_post_type_created_at" ON "Post"("typeContent", "createdAt");

-- CreateIndex
CREATE INDEX "idx_post_author_created_at" ON "Post"("authorId", "createdAt");
