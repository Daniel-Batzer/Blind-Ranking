import {
  createTopicForUser,
  findTopicsForUser,
} from "@/modules/content/topic.service";
import { createTopicSchema } from "@/modules/content/topic.schema";
import { getDevUser } from "@/modules/identity/dev-user.service";
import { ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
  const body = await request.json();
  const checkedInput = createTopicSchema.safeParse(body);

  if (!checkedInput.success) {
    return Response.json(
      {
        error: "Invalid request body",
        details: checkedInput.error.flatten(),
      },
      { status: 400 },
    );
  }

  const user = await getDevUser();

  try {
    const topic = await createTopicForUser(user.id, checkedInput.data);
    return Response.json(topic, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    throw error;
  }
}

export async function GET() {
  const user = await getDevUser();
  const topics = await findTopicsForUser(user.id);

  return Response.json(topics, { status: 200 });
}
