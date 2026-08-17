import { ValidationError } from "@/lib/errors";
import { createTopic, findTopicsByOwner } from "./topic.repository";
import { CreateTopicInput } from "./topic.schema";

export async function createTopicForUser(
  ownerId: string,
  input: CreateTopicInput,
) {
  const title = input.title.trim();
  const description = input.description?.trim() || undefined;
  const rankingItems = input.rankingItems.map((item) => item.trim());

  if (!title) {
    throw new ValidationError("Title is required");
  }

  if (rankingItems.length !== 5) {
    throw new ValidationError("Exactly 5 ranking items are required");
  }

  if (rankingItems.some((item) => !item)) {
    throw new ValidationError("Ranking items cannot be empty");
  }

  const checkedInput: CreateTopicInput = {
    title,
    description,
    rankingItems,
  };

  return createTopic(ownerId, checkedInput);
}

export async function findTopicsForUser(userId: string) {
  return findTopicsByOwner(userId);
}
