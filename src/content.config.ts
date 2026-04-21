import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Alberto Munoz Gonzalez'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    category: z.enum([
      'fisioterapia-deportiva',
      'dolor-cronico',
      'rehabilitacion',
      'tecnicas',
      'prevencion',
      'nutricion',
      'consejos',
    ]).default('consejos'),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
