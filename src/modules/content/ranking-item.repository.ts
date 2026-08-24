import { prisma } from "@/lib/prisma";
import type { CreateRankingItemInput } from "./ranking-item.schema";

export function createRankingItem(
  topicId: string,
  input: CreateRankingItemInput,
) {
  return prisma.rankingItem.create({
    data: {
      topicId,
      text: input.text,
    },
  });
}

export function findRankingItemByTopicAndText(topicId: string, text: string) {
  return prisma.rankingItem.findFirst({
    where: {
      topicId,
      text,
    },
  });
}
