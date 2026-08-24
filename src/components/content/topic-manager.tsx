"use client";

import type { RankingItemStatus } from "@/generated/prisma/enums";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useRouter } from "next/navigation";

import {
  createTopicSchema,
  type CreateTopicInput,
} from "@/modules/content/topic.schema";

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics.length > 0 ? topics[0].id : null,
  );

  const form = useForm<CreateTopicInput>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: "",
      description: "",
      rankingItems: [],
    },
  });

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId);

  async function handleCreateTopic(data: CreateTopicInput) {
    setCreateError(null);

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
        setCreateError(createdTopic.error ?? "Could not create topic");
        return;
      }

      setSelectedTopicId(createdTopic.id);

      form.reset();
      setDialogOpen(false);
      router.refresh();
    } catch {
      setCreateError("Could not create topic");
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2">
        <Select
          value={selectedTopicId ?? undefined}
          onValueChange={setSelectedTopicId}
        >
          <SelectTrigger className="w-[420px]">
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              onSubmit={form.handleSubmit(handleCreateTopic)}
            >
              <div className="space-y-2">
                <Label htmlFor="topic-title">Title</Label>
                <Input
                  id="topic-title"
                  placeholder="Enter a title"
                  {...form.register("title")}
                  aria-invalid={!!form.formState.errors.title}
                />

                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic-description">Description</Label>
                <Textarea
                  id="topic-description"
                  placeholder="Enter a description"
                  {...form.register("description")}
                  aria-invalid={!!form.formState.errors.description}
                  className="min-w-0 field-sizing-fixed resize-y"
                />

                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {createError && (
                <p className="text-sm text-destructive">{createError}</p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setCreateError(null);
                    setDialogOpen(false);
                  }}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Creating..." : "Create"}
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

          <Button variant="outline">+ Add item</Button>
        </div>
      )}
    </div>
  );
}
