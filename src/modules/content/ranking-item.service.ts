import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";

import type { CreateRankingItemInput } from "./ranking-item.schema";
import {
  createRankingItem,
  findRankingItemByTopicAndText,
} from "./ranking-item.repository";
import { findTopicByIdAndOwner } from "./topic.repository";

export async function createRankingItemForUser(
  userId: string,
  topicId: string,
  input: CreateRankingItemInput,
) {
  const text = input.text.trim();

  if (!text) {
    throw new ValidationError("Ranking item text cannot be empty");
  }

  const topic = await findTopicByIdAndOwner(topicId, userId);

  if (!topic) {
    throw new NotFoundError("Topic not found");
  }

  const existingItem = await findRankingItemByTopicAndText(topicId, text);
  if (existingItem) {
    throw new ConflictError("Ranking item already exists in this topic");
  }

  return createRankingItem(topicId, { text });
}
