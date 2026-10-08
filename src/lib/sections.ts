// Helpers on top of the copy parser for patterns that recur across the copy files.
import type { Block, Inline, Section } from './copy';
import { toPlain } from './copy';
import type { IconName } from '../components/icon-names';

export interface Labeled {
  label: string;
  value: Inline[];
}

/** "Personen: maximaal 6" -> { label: 'Personen', value: [...] }. Items without a colon get label ''. */
export function labeled(item: Inline[]): Labeled {
  const first = item[0];
  if (first?.type === 'text') {
    const i = first.value.indexOf(':');
    if (i > 0 && i < 60) {
      const rest = first.value.slice(i + 1).replace(/^\s+/, '');
      return { label: first.value.slice(0, i).trim(), value: [...(rest ? [{ type: 'text', value: rest } as Inline] : []), ...item.slice(1)] };
    }
  }
  return { label: '', value: item };
}

/** All list items of a section's blocks, flattened. */
export const listItems = (blocks: Block[]): Inline[][] => blocks.flatMap((b) => (b.type === 'list' ? b.items : []));

/** Paragraph blocks only. */
export const paragraphs = (blocks: Block[]): Block[] => blocks.filter((b) => b.type === 'paragraph');

/** "Wat er is:" followed by a list -> [{ title: 'Wat er is', items }]. */
export function titledLists(blocks: Block[]): { title: string; items: Inline[][] }[] {
  const out: { title: string; items: Inline[][] }[] = [];
  blocks.forEach((b, i) => {
    const next = blocks[i + 1];
    if (b.type === 'paragraph' && next?.type === 'list') {
      const t = toPlain(b.content);
      if (t.endsWith(':')) out.push({ title: t.slice(0, -1), items: next.items });
    }
  });
  return out;
}

/** First sentence of the plain text of some blocks (for one-line card texts). */
export function firstSentence(blocks: Block[]): string {
  const t = toPlain(blocks);
  const m = t.match(/^.*?[.?](\s|$)/);
  return (m ? m[0] : t).trim();
}

/** Blocks without the paragraphs that only hold a "Label: [[placeholder]]" line, e.g. "Prijs: vanaf [[...]]". */
export const withoutLines = (blocks: Block[], startsWith: string[]): Block[] =>
  blocks.filter((b) => !(b.type === 'paragraph' && startsWith.some((s) => toPlain(b.content, true).startsWith(s))));

/** Find the paragraph that starts with a label, e.g. "Prijs:". */
export const lineStarting = (blocks: Block[], start: string): Inline[] | undefined => {
  const b = blocks.find((x) => x.type === 'paragraph' && toPlain(x.content, true).startsWith(start));
  return b && b.type === 'paragraph' ? b.content : undefined;
};

/** Icon for a fact label from the copy. */
export function iconFor(label: string): IconName {
  const l = label.toLowerCase();
  if (l.startsWith('personen')) return 'person';
  if (l.startsWith('sanitair')) return 'shower';
  if (l.startsWith('inbegrepen')) return 'check';
  if (l.startsWith('honden')) return 'paw';
  if (l.startsWith('stroom')) return 'plug';
  if (l.startsWith('seizoen') || l.startsWith('minimale')) return 'calendar';
  if (l.startsWith('aankomst') || l.startsWith('vertrek') || l.startsWith('laat')) return 'clock';
  if (l.startsWith('maximale')) return 'ruler';
  if (l.startsWith('huisregels') || l.startsWith('rusttijden')) return 'info';
  if (l.startsWith('aantal')) return 'home';
  if (l.startsWith('verkeer')) return 'car';
  if (l.startsWith('open vuur')) return 'leaf';
  if (l.startsWith('bezoek')) return 'users';
  return 'leafsprig';
}

/** Section lookup that throws at build time when the copy changed shape. */
export function need(s: Section | undefined, name: string): Section {
  if (!s) throw new Error(`Copy section missing: "${name}"`);
  return s;
}
