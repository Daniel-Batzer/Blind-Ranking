-- CreateEnum
CREATE TYPE "content"."RankingItemStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "content"."RankingItem" ADD COLUMN     "status" "content"."RankingItemStatus" NOT NULL DEFAULT 'APPROVED';
