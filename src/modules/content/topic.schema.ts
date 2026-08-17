import { z } from "zod";

export const createTopicSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  rankingItems: z.array(z.string()),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;
