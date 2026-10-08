// Load and parse the copy for one page by file name (without .md). Use in page frontmatter:
//   const copy = await pageCopy('home');
import { getEntry } from 'astro:content';
import { parseCopy, type ParsedCopy } from './copy';

export interface PageCopy extends ParsedCopy {
  meta: { slug: string; title: string; description: string; h1: string; status: string };
}

export async function pageCopy(slug: string): Promise<PageCopy> {
  const entry = await getEntry('copy', slug);
  if (!entry) throw new Error(`Copy not found: src/content/copy/${slug}.md (run npm run sync-copy)`);
  return { ...parseCopy(entry.body ?? ''), meta: entry.data };
}

/** Optional variant for pages that may be built before their copy exists. */
export async function maybePageCopy(slug: string): Promise<PageCopy | undefined> {
  const entry = await getEntry('copy', slug);
  return entry ? { ...parseCopy(entry.body ?? ''), meta: entry.data } : undefined;
}
