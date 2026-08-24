import { TopicManager } from "@/components/content/topic-manager";
import { findTopicsForUser } from "@/modules/content/topic.service";
import { getDevUser } from "@/modules/identity/dev-user.service";

export default async function DashboardPage() {
  const user = await getDevUser();
  const topics = await findTopicsForUser(user.id);

  return (
    <main className="w-full px-8 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <h1 className="text-2xl font-bold">Topics</h1>

        <TopicManager topics={topics} />
      </div>
    </main>
  );
}
