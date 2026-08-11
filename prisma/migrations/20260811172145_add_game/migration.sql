-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "game";

-- CreateEnum
CREATE TYPE "game"."GameSessionStatus" AS ENUM ('LOBBY', 'ACTIVE', 'REVEAL', 'FINISHED');

-- CreateTable
CREATE TABLE "game"."GameSession" (
    "id" UUID NOT NULL,
    "hostUserId" UUID NOT NULL,
    "topicId" UUID NOT NULL,
    "status" "game"."GameSessionStatus" NOT NULL DEFAULT 'LOBBY',
    "joinCode" TEXT NOT NULL,
    "currentPosition" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game"."SessionItem" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "sourceRankingItemId" UUID,
    "text" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SessionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game"."SessionParticipant" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "displayName" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game"."Ranking" (
    "id" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "sessionItemId" UUID NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameSession_joinCode_key" ON "game"."GameSession"("joinCode");

-- CreateIndex
CREATE UNIQUE INDEX "SessionItem_sessionId_position_key" ON "game"."SessionItem"("sessionId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "SessionItem_sessionId_sourceRankingItemId_key" ON "game"."SessionItem"("sessionId", "sourceRankingItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionParticipant_sessionId_userId_key" ON "game"."SessionParticipant"("sessionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_participantId_rank_key" ON "game"."Ranking"("participantId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_participantId_sessionItemId_key" ON "game"."Ranking"("participantId", "sessionItemId");

-- AddForeignKey
ALTER TABLE "game"."GameSession" ADD CONSTRAINT "GameSession_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "identity"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."GameSession" ADD CONSTRAINT "GameSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "content"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."SessionItem" ADD CONSTRAINT "SessionItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "game"."GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."SessionItem" ADD CONSTRAINT "SessionItem_sourceRankingItemId_fkey" FOREIGN KEY ("sourceRankingItemId") REFERENCES "content"."RankingItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."SessionParticipant" ADD CONSTRAINT "SessionParticipant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "game"."GameSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."SessionParticipant" ADD CONSTRAINT "SessionParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "identity"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."Ranking" ADD CONSTRAINT "Ranking_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "game"."SessionParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game"."Ranking" ADD CONSTRAINT "Ranking_sessionItemId_fkey" FOREIGN KEY ("sessionItemId") REFERENCES "game"."SessionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add check constraints for valid blind ranking positions
ALTER TABLE "game"."SessionItem"
ADD CONSTRAINT "SessionItem_position_check"
CHECK ("position" BETWEEN 1 AND 5);

ALTER TABLE "game"."Ranking"
ADD CONSTRAINT "Ranking_rank_check"
CHECK ("rank" BETWEEN 1 AND 5);
