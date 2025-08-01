-- CreateIndex
CREATE INDEX "idx_account_id" ON "Account"("id");

-- CreateIndex
CREATE INDEX "idx_account_user_id" ON "Account"("user_id");

-- CreateIndex
CREATE INDEX "idx_account_provider_provider_account_id" ON "Account"("provider", "provider_account_id");

-- CreateIndex
CREATE INDEX "idx_category_name" ON "Category"("name");

-- CreateIndex
CREATE INDEX "idx_category_slug" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "idx_comment_post_id" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "idx_comment_author_id" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "idx_comment_created_at" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "idx_file_post_id" ON "File"("postId");

-- CreateIndex
CREATE INDEX "idx_file_type" ON "File"("type");

-- CreateIndex
CREATE INDEX "idx_file_public_id" ON "File"("publicId");

-- CreateIndex
CREATE INDEX "idx_file_src" ON "File"("src");

-- CreateIndex
CREATE INDEX "idx_like_comment_comment_id" ON "LikeComment"("commentId");

-- CreateIndex
CREATE INDEX "idx_like_comment_user_id" ON "LikeComment"("userId");

-- CreateIndex
CREATE INDEX "idx_like_post_post_id" ON "LikePost"("postId");

-- CreateIndex
CREATE INDEX "idx_like_post_user_id" ON "LikePost"("userId");

-- CreateIndex
CREATE INDEX "idx_post_author_id" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "idx_post_title" ON "Post"("title");

-- CreateIndex
CREATE INDEX "idx_post_type_content" ON "Post"("typeContent");

-- CreateIndex
CREATE INDEX "idx_post_created_at" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "idx_session_session_token" ON "Session"("session_token");

-- CreateIndex
CREATE INDEX "idx_session_user_id" ON "Session"("user_id");

-- CreateIndex
CREATE INDEX "idx_session_expires" ON "Session"("expires");

-- CreateIndex
CREATE INDEX "idx_session_session_token_user_id" ON "Session"("session_token", "user_id");

-- CreateIndex
CREATE INDEX "idx_tag_name" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "idx_tag_slug" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_user_first_name" ON "User"("firstName");

-- CreateIndex
CREATE INDEX "idx_user_last_name" ON "User"("lastName");

-- CreateIndex
CREATE INDEX "idx_user_email_verified" ON "User"("email_verified");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "User"("id");

-- CreateIndex
CREATE INDEX "idx_verification_token_expires" ON "VerificationToken"("expires");

-- CreateIndex
CREATE INDEX "idx_verification_token_identifier" ON "VerificationToken"("identifier");
