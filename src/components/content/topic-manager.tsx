"use client";

import type { RankingItemStatus } from "@/generated/prisma/enums";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import {
  createTopicSchema,
  type CreateTopicInput,
} from "@/modules/content/topic.schema";
import {
  createRankingItemSchema,
  type CreateRankingItemInput,
} from "@/modules/content/ranking-item.schema";

export type TopicDTO = {
  id: string;
  title: string;
  description: string | null;
  rankingItems: {
    id: string;
    text: string;
    status: RankingItemStatus;
  }[];
};

export type TopicManagerProps = {
  topics: TopicDTO[];
};

export function TopicManager({ topics }: TopicManagerProps) {
  const router = useRouter();

  // Topic dialog state
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [createTopicError, setCreateTopicError] = useState<string | null>(null);

  // Ranking item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [createItemError, setCreateItemError] = useState<string | null>(null);

  // Selected topic
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics.length > 0 ? topics[0].id : null,
  );

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);

  // Topic form
  const topicForm = useForm<CreateTopicInput>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: "",
      description: "",
      rankingItems: [],
    },
  });

  // Ranking item form
  const rankingItemForm = useForm<CreateRankingItemInput>({
    resolver: zodResolver(createRankingItemSchema),
    defaultValues: {
      text: "",
    },
  });

  async function handleCreateTopic(data: CreateTopicInput) {
    setCreateTopicError(null);

    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const createdTopic = await response.json();

      if (!response.ok) {
        setCreateTopicError(createdTopic.error ?? "Could not create topic");
        return;
      }

      setSelectedTopicId(createdTopic.id);

      topicForm.reset();
      setTopicDialogOpen(false);

      router.refresh();
    } catch {
      setCreateTopicError("Could not create topic");
    }
  }

  async function handleCreateRankingItem(data: CreateRankingItemInput) {
    if (!selectedTopicId) {
      setCreateItemError("No topic selected");
      return;
    }

    setCreateItemError(null);

    try {
      const response = await fetch(`/api/topics/${selectedTopicId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const createdItem = await response.json();

      if (!response.ok) {
        setCreateItemError(
          createdItem.error ?? "Could not create ranking item",
        );
        return;
      }

      rankingItemForm.reset();
      setItemDialogOpen(false);

      router.refresh();
    } catch {
      setCreateItemError("Could not create ranking item");
    }
  }

  function handleTopicDialogChange(open: boolean) {
    setTopicDialogOpen(open);

    if (!open) {
      topicForm.reset();
      setCreateTopicError(null);
    }
  }

  function handleItemDialogChange(open: boolean) {
    setItemDialogOpen(open);

    if (!open) {
      rankingItemForm.reset();
      setCreateItemError(null);
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <Select
          value={selectedTopicId ?? undefined}
          onValueChange={setSelectedTopicId}
        >
          <SelectTrigger className="w-105">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>

          <SelectContent>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Create Topic */}
        <Dialog open={topicDialogOpen} onOpenChange={handleTopicDialogChange}>
          <DialogTrigger asChild>
            <Button size="icon">+</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Topic</DialogTitle>
              <DialogDescription>
                Create a new topic for your blind rankings.
              </DialogDescription>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={topicForm.handleSubmit(handleCreateTopic)}
            >
              <div className="space-y-2">
                <Label htmlFor="topic-title">Title</Label>

                <Input
                  id="topic-title"
                  placeholder="Enter a title"
                  {...topicForm.register("title")}
                  aria-invalid={!!topicForm.formState.errors.title}
                />

                {topicForm.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {topicForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic-description">Description</Label>

                <Textarea
                  id="topic-description"
                  placeholder="Enter a description"
                  {...topicForm.register("description")}
                  aria-invalid={!!topicForm.formState.errors.description}
                  className="min-w-0 field-sizing-fixed resize-y"
                />

                {topicForm.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {topicForm.formState.errors.description.message}
                  </p>
                )}
              </div>

              {createTopicError && (
                <p className="text-sm text-destructive">{createTopicError}</p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleTopicDialogChange(false)}
                  disabled={topicForm.formState.isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={topicForm.formState.isSubmitting}
                >
                  {topicForm.formState.isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedTopic && (
        <div className="w-full space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{selectedTopic.title}</h2>

            {selectedTopic.description && (
              <p className="text-muted-foreground">
                {selectedTopic.description}
              </p>
            )}
          </div>

          <div className="w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {selectedTopic.rankingItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.text}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Create Ranking Item */}
          <Dialog open={itemDialogOpen} onOpenChange={handleItemDialogChange}>
            <DialogTrigger asChild>
              <Button variant="outline">+ Add Item</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Ranking Item</DialogTitle>

                <DialogDescription>
                  Add a new ranking item to &quot;
                  {selectedTopic.title}&quot;.
                </DialogDescription>
              </DialogHeader>

              <form
                className="space-y-4"
                onSubmit={rankingItemForm.handleSubmit(handleCreateRankingItem)}
              >
                <div className="space-y-2">
                  <Label htmlFor="item-text">Item Text</Label>

                  <Textarea
                    id="item-text"
                    placeholder="Enter content for the item"
                    {...rankingItemForm.register("text")}
                    aria-invalid={!!rankingItemForm.formState.errors.text}
                    className="min-w-0 field-sizing-fixed resize-y"
                  />

                  {rankingItemForm.formState.errors.text && (
                    <p className="text-sm text-destructive">
                      {rankingItemForm.formState.errors.text.message}
                    </p>
                  )}
                </div>

                {createItemError && (
                  <p className="text-sm text-destructive">{createItemError}</p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleItemDialogChange(false)}
                    disabled={rankingItemForm.formState.isSubmitting}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={rankingItemForm.formState.isSubmitting}
                  >
                    {rankingItemForm.formState.isSubmitting
                      ? "Adding..."
                      : "Add Item"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
