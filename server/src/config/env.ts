import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),

  CLIENT_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),

  GEMINI_API_KEY: z
    .string()
    .min(1, "GEMINI_API_KEY is required."),

  GEMINI_MODEL: z
    .string()
    .min(1)
    .default("gemini-2.5-flash"),

  AI_BATCH_SIZE: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(20),

  AI_MAX_RETRIES: z.coerce
    .number()
    .int()
    .min(0)
    .max(5)
    .default(3),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors,
  );

  throw new Error("Invalid environment configuration.");
}

export const env = parsed.data;