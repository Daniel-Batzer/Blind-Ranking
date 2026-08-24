import { z } from "zod";

export const createRankingItemSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Ranking item text is required")
    .max(200, "Ranking item text must not exceed 200 characters"),
});

export type CreateRankingItemInput = z.infer<typeof createRankingItemSchema>;
