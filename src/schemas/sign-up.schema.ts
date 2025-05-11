import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3).max(20).nonempty(),
  password: z.string().min(6).nonempty(),
});
