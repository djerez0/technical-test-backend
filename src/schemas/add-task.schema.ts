import { z } from "zod";

export const addTaskSchema = z.object({
  title: z.string().max(100).nonempty(),
  description: z.string().optional().nullable(),
});
