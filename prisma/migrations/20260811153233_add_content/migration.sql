-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "content";

-- CreateTable
CREATE TABLE "content"."Topic" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content"."RankingItem" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "topicId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RankingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Topic_ownerId_title_key" ON "content"."Topic"("ownerId", "title");

-- AddForeignKey
ALTER TABLE "content"."Topic" ADD CONSTRAINT "Topic_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "identity"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content"."RankingItem" ADD CONSTRAINT "RankingItem_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "content"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
