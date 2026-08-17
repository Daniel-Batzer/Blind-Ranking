import { createTopic } from "./topic.repository";
import { CreateTopicInput } from "./topic.types";

export async function createTopicForUser(
  ownerId: string,
  input: CreateTopicInput,
) {
  const title = input.title.trim();
  const description = input.description?.trim() || undefined;
  const rankingItems = input.rankingItems.map((item) => item.trim());

  if (!title) {
    throw new Error("Title is required");
  }

  if (rankingItems.length !== 5) {
    throw new Error("Exactly 5 ranking items are required");
  }

  if (rankingItems.some((item) => !item)) {
    throw new Error("Ranking items cannot be empty");
  }

  const checkedInput: CreateTopicInput = {
    title,
    description,
    rankingItems,
  };

  return createTopic(ownerId, checkedInput);
}
