import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .nonempty("Title is required"),
  description: z
    .string()
    .min(15, "Description must be at least 15 characters")
    .nonempty("Description is required"),
});

export type TaskInput = z.infer<typeof TaskSchema>;
