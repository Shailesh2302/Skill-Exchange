import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 Characters"),
});
