/*
  Warnings:

  - A unique constraint covering the columns `[topicId,text]` on the table `RankingItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RankingItem_topicId_text_key" ON "content"."RankingItem"("topicId", "text");
