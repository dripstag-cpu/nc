// Copy parser for ../content/copy/<pagina>.md (written by the copywriters).
// Dependency-free so it runs in Astro and in plain Node (node src/lib/copy.test.ts).
//
// Conventions in the markdown:
//   ## <naam>                     a section
//   ### <vraag>?                  FAQ question; the lines below until the next heading are the answer
//   ### <titel>                   a sub item (card, step) when it does not end with "?"
//   knop: <tekst>                 button text (optional target: "knop: <tekst> -> /pad/")
//   alt: <tekst>                  alt text for the section image(s)
//   <sleutel>: <tekst>            any other lowercase one-word key (e.g. "onderregel:") lands in `fields`
//   - item / 1. item              lists
//   [[NOG IN TE VULLEN: ...]]     placeholder, returned as its own inline type
//   <!-- ... -->                  builder note, collected in `notes`, never rendered
//   **vet**, *cursief*, [tekst](/pad/)   inline markup
//   lines inside one paragraph keep their line break (e.g. an address)

export type Inline =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'em'; value: string }
  | { type: 'link'; value: string; href: string }
  | { type: 'placeholder'; value: string }
  | { type: 'break' };

export type Block =
  | { type: 'paragraph'; content: Inline[] }
  | { type: 'list'; ordered: boolean; items: Inline[][] };

export interface Button {
  label: string;
  href?: string;
}

export interface Item {
  title: string;
  blocks: Block[];
  buttons: Button[];
  alts: string[];
  fields: Record<string, string[]>;
}

export interface FaqPair {
  question: string;
  answer: Block[];
}

export interface Section {
  /** the text after "## " */
  name: string;
  /** slugified name, for lookups and anchors */
  id: string;
  blocks: Block[];
  buttons: Button[];
  alts: string[];
  /** other key lines, e.g. { onderregel: ['...'] } */
  fields: Record<string, string[]>;
  /** ### headings that end with "?" */
  faq: FaqPair[];
  /** ### headings that are not questions */
  items: Item[];
  notes: string[];
}

export interface ParsedCopy {
  frontmatter: Record<string, string>;
  /** blocks before the first ## (intro) */
  intro: Section;
  sections: Section[];
  notes: string[];
}

const PLACEHOLDER_RE = /\[\[\s*NOG IN TE VULLEN\s*:\s*([\s\S]*?)\s*\]\]/g;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Tokenize one line or paragraph of inline markdown. Newlines become { type: 'break' }. */
export function parseInline(src: string): Inline[] {
  if (src.includes('\n')) {
    return src.split('\n').flatMap((line, i) => (i ? [{ type: 'break' } as Inline, ...parseInline(line)] : parseInline(line)));
  }
  const out: Inline[] = [];
  // order matters: placeholder, link, strong, em
  const re = /\[\[\s*NOG IN TE VULLEN\s*:\s*([\s\S]*?)\s*\]\]|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  for (const m of src.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ type: 'text', value: src.slice(last, i) });
    if (m[1] !== undefined) out.push({ type: 'placeholder', value: m[1] });
    else if (m[2] !== undefined) out.push({ type: 'link', value: m[2], href: m[3] });
    else if (m[4] !== undefined) out.push({ type: 'strong', value: m[4] });
    else if (m[5] !== undefined) out.push({ type: 'em', value: m[5] });
    last = i + m[0].length;
  }
  if (last < src.length) out.push({ type: 'text', value: src.slice(last) });
  return out;
}

/** Plain text (for meta tags, JSON-LD, alt). Placeholders become "" by default. */
export function toPlain(content: Inline[] | Block[] | string, keepPlaceholders = false): string {
  if (typeof content === 'string') return toPlain(parseInline(content), keepPlaceholders);
  const parts: string[] = [];
  for (const node of content as (Inline | Block)[]) {
    if (node.type === 'paragraph') parts.push(toPlain(node.content, keepPlaceholders));
    else if (node.type === 'list') parts.push(node.items.map((i) => toPlain(i, keepPlaceholders)).join(' '));
    else if (node.type === 'placeholder') parts.push(keepPlaceholders ? `[nog in te vullen: ${node.value}]` : '');
    else if (node.type === 'break') parts.push(' ');
    else parts.push(node.value);
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export const hasPlaceholder = (s: string) => new RegExp(PLACEHOLDER_RE.source).test(s);

function splitFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const m = raw.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return { data, body: raw.slice(m[0].length) };
}

const newSection = (name: string): Section => ({
  name,
  id: slugify(name),
  blocks: [],
  buttons: [],
  alts: [],
  fields: {},
  faq: [],
  items: [],
  notes: [],
});

function parseButton(v: string): Button {
  const m = v.match(/^(.*?)\s*->\s*(\S+)\s*$/);
  return m ? { label: m[1].trim(), href: m[2] } : { label: v.trim() };
}

/** Parse the markdown body (frontmatter optional). */
export function parseCopy(raw: string): ParsedCopy {
  const { data, body } = splitFrontmatter(raw);
  const notes: string[] = [];

  // Pull out HTML comments first (they may span lines); leave a marker line so the
  // note can be attached to the section it appeared in
  const text = body.replace(/<!--([\s\S]*?)-->/g, (_, note: string) => {
    notes.push(note.trim());
    return `\n\u0001${notes.length - 1}\n`;
  });

  const intro = newSection('');
  const sections: Section[] = [];
  let section = intro;
  // where blocks/buttons/alts currently go: the section itself or its last ### item
  let target: { blocks: Block[]; buttons: Button[]; alts: string[]; fields: Record<string, string[]> } = section;
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (para.length) {
      target.blocks.push({ type: 'paragraph', content: parseInline(para.join('\n')) });
      para = [];
    }
    if (list) {
      target.blocks.push({ type: 'list', ordered: list.ordered, items: list.items.map(parseInline) });
      list = null;
    }
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    let m: RegExpMatchArray | null;

    if (!line) {
      flush();
      continue;
    }
    if ((m = line.match(/^\u0001(\d+)$/))) {
      flush();
      section.notes.push(notes[Number(m[1])]);
      continue;
    }
    if ((m = line.match(/^##\s+(.+?)\s*#*$/)) && !line.startsWith('###')) {
      flush();
      section = newSection(m[1]);
      sections.push(section);
      target = section;
      continue;
    }
    if ((m = line.match(/^###\s+(.+?)\s*#*$/))) {
      flush();
      const title = m[1];
      if (title.endsWith('?')) {
        const pair: FaqPair = { question: title, answer: [] };
        section.faq.push(pair);
        // answer collects blocks; buttons/alts inside an answer go to the section
        target = { blocks: pair.answer, buttons: section.buttons, alts: section.alts, fields: section.fields };
      } else {
        const item: Item = { title, blocks: [], buttons: [], alts: [], fields: {} };
        section.items.push(item);
        target = item;
      }
      continue;
    }
    if ((m = line.match(/^knop\s*:\s*(.+)$/i))) {
      flush();
      target.buttons.push(parseButton(m[1]));
      continue;
    }
    if ((m = line.match(/^alt\s*:\s*(.+)$/i))) {
      flush();
      target.alts.push(m[1].trim());
      continue;
    }
    if ((m = line.match(/^([a-z][a-z-]*)\s*:\s+(.+)$/))) {
      flush();
      (target.fields[m[1]] ??= []).push(m[2].trim());
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.+)$/)) || (m = line.match(/^\d+[.)]\s+(.+)$/))) {
      const ordered = /^\d/.test(line);
      if (para.length) flush();
      if (list && list.ordered !== ordered) flush();
      if (!list) list = { ordered, items: [] };
      list.items.push(m[1]);
      continue;
    }
    if (list) flush();
    para.push(line);
  }
  flush();

  return { frontmatter: data, intro, sections, notes };
}

/** First value of a key line, e.g. field(hero, 'onderregel'). */
export const field = (s: { fields: Record<string, string[]> } | undefined, key: string) => s?.fields[key]?.[0];

/** Find a section by name or slug; case and accents insensitive. */
export function section(copy: ParsedCopy, nameOrId: string): Section | undefined {
  const id = slugify(nameOrId);
  return copy.sections.find((s) => s.id === id);
}
