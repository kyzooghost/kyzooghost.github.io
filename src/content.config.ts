import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

import { WORK_TYPE_VALUES } from './content/types';

const URL_PROTOCOL = {
  http: 'http:',
  https: 'https:',
} as const;

const httpUrl = z.url().refine((value) => {
  try {
    const protocol = new URL(value).protocol;
    return protocol === URL_PROTOCOL.http || protocol === URL_PROTOCOL.https;
  } catch {
    return false;
  }
}, 'URL must use http:// or https://.');

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    type: z.enum(WORK_TYPE_VALUES),
    featured: z.boolean(),
    draft: z.boolean(),
    externalUrl: httpUrl.optional(),
    tags: z.array(z.string()).optional(),
    canonicalUrl: httpUrl.optional(),
  }),
});

export const collections = { work };
