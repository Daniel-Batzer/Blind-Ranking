import { prisma } from "@/lib/prisma";
import type { CreateTopicInput } from "./topic.schema";

export function findTopicsByOwner(ownerId: string) {
  return prisma.topic.findMany({
    where: {
      ownerId: ownerId,
    },
    include: {
      rankingItems: true,
    },
  });
}

export function findTopicByIdAndOwner(topicId: string, ownerId: string) {
  return prisma.topic.findFirst({
    where: {
      id: topicId,
      ownerId: ownerId,
    },
  });
}

export function createTopic(ownerId: string, input: CreateTopicInput) {
  return prisma.topic.create({
    data: {
      ownerId,
      title: input.title,
      description: input.description,
      rankingItems: input.rankingItems
        ? {
            create: input.rankingItems.map((item) => ({
              text: item,
            })),
          }
        : undefined,
    },
  });
}
