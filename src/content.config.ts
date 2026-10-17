import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const socialSchema = z.object({
  name: z.string(),
  url: z.url(),
});

// Trimmed-down version of web-dong-blog's post schema. MVP only:
// no icon, no themeColor, no series.
const postSchema = z.object({
  isDraft: z.boolean().default(true),
  headline: z.string(),
  subHeadline: z.string(),
  excerpt: z.string(),
  category: z.string().default("unsorted"),
  publishDate: z.date(),
  lastModifiedDate: z.date().optional(),
});

const navigationItemSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const config = defineCollection({
  loader: file("src/data/config.yml"),
  schema: z.object({
    brand: z.object({
      name: z.string(),
      description: z.string(),
      copyright: z.string(),
      socials: z.array(socialSchema),
    }),
    navigation: z.array(navigationItemSchema),
  }),
});

// Turn "hello-world/index.md" into "hello-world".
const legacySlug = ({ entry }: { entry: string }) =>
  entry.replace(/\.[^/.]+$/, "").replace(/\/index$/, "");

export const collections = {
  config,
  post: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/post",
      generateId: legacySlug,
    }),
    schema: postSchema,
  }),
};
