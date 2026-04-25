import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    status: z.enum(['draft', 'provisional', 'stable']).optional(),
    updated: z.coerce.date().optional(),
    // Set to false on locale stubs that have no localized body yet.
    // The doc renderer falls back to the English counterpart and shows
    // a "translation in progress" banner.
    translated: z.boolean().optional().default(true),
  }),
});

export const collections = { docs };
