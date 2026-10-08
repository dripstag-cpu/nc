// Content collection for the page copy.
// Source of truth: ../content/copy/<pagina>.md (the copywriters' folder, outside the git repo).
// `npm run sync-copy` mirrors it into src/content/copy/, which is committed so Vercel can build.
// The id is the file name without .md (e.g. "home", "verblijf-glampingtent"); the frontmatter
// `slug` holds the URL path ("/", "/verblijf/glampingtent/").
// The raw markdown (entry.body) is parsed with src/lib/copy.ts; see CLAUDE.md.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const copy = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: process.env.COPY_DIR ?? './src/content/copy',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    status: z.string(),
  }),
});

export const collections = { copy };
