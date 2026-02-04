// zodSchemasName.ts
import { z } from "zod";

export const nameSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(20, "名前は20文字以内で入力してください"),
});

export type NameFormData = z.infer<typeof nameSchema>;