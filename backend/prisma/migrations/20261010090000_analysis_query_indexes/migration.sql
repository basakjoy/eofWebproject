CREATE INDEX "analysis_status_createdAt_idx" ON "analysis"("status", "createdAt");
CREATE INDEX "analysis_createdBy_createdAt_idx" ON "analysis"("createdBy", "createdAt");
CREATE INDEX "analysis_comments_analysisId_createdAt_idx" ON "analysis_comments"("analysisId", "createdAt");
CREATE INDEX "analysis_comments_userId_createdAt_idx" ON "analysis_comments"("userId", "createdAt");