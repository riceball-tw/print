import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

const socialSchema = z.object({
  name: z.string(),
  url: z.url(),
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

export const collections = { config };
