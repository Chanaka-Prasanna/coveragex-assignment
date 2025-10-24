import { INPUT_LENGTHS } from "@/utils/constants";
import { z } from "zod";

export const TaskSchema = z.object({
  title: z
    .string()
    .min(
      INPUT_LENGTHS.MIN_TITLE_LENGTH,
      `Title must be at least ${INPUT_LENGTHS.MIN_TITLE_LENGTH} characters`
    )
    .nonempty("Title is required"),
  description: z
    .string()
    .min(
      INPUT_LENGTHS.MIN_DESCRIPTION_LENGTH,
      `Description must be at least ${INPUT_LENGTHS.MIN_DESCRIPTION_LENGTH} characters`
    )
    .nonempty("Description is required"),
});

export type TaskInput = z.infer<typeof TaskSchema>;
