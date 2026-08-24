import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import { createRankingItemSchema } from "@/modules/content/ranking-item.schema";
import { createRankingItemForUser } from "@/modules/content/ranking-item.service";
import { getDevUser } from "@/modules/identity/dev-user.service";
import { z } from "zod";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  const body = await request.json();
  const checkedInput = createRankingItemSchema.safeParse(body);

  if (!checkedInput.success) {
    return Response.json(
      {
        error: "Invalid request body",
        details: z.flattenError(checkedInput.error),
      },
      { status: 400 },
    );
  }

  const { topicId } = await params;
  const user = await getDevUser();

  try {
    const rankingItem = await createRankingItemForUser(
      user.id,
      topicId,
      checkedInput.data,
    );

    return Response.json(rankingItem, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof NotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof ConflictError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    throw error;
  }
}
