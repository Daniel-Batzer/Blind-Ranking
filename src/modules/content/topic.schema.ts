import { z } from "zod";

export const createTopicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  rankingItems: z
    .array(z.string().trim().min(1, "Ranking item cannot be empty"))
    .optional(),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
