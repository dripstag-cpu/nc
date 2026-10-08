// Run: node src/lib/copy.test.ts   (Node 22.18+ strips the types)
import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { field, parseCopy, section, toPlain } from './copy.ts';

const raw = readFileSync(new URL('./__fixtures__/voorbeeld.md', import.meta.url), 'utf8');
const copy = parseCopy(raw);

// frontmatter
assert.equal(copy.frontmatter.slug, '/voorbeeld/');
assert.equal(copy.frontmatter.title, 'Voorbeeldpagina | Camping Naescas');
assert.equal(copy.frontmatter.h1, 'Rustpunt in het Groene Hart');
assert.equal(copy.frontmatter.status, 'concept');

// sections and intro
assert.deepEqual(copy.sections.map((s) => s.id), ['hero', 'welkom-bij-naescas', 'kernwaarden', 'veelgestelde-vragen']);
assert.equal(toPlain(copy.intro.blocks), 'Korte intro voor de eerste sectie.');
assert.deepEqual(copy.intro.notes, ['Bouwersnotitie: dit bestand hoort bij de parsertest, niet bij de site.']);

// buttons, alt, inline markup
const hero = section(copy, 'Hero')!;
assert.deepEqual(hero.buttons, [{ label: 'Bekijk beschikbaarheid', href: '/beschikbaarheid/' }, { label: 'Ontdek Naescas' }]);
assert.deepEqual(hero.alts, ['Luchtfoto van de kampeerplaatsen aan het Aarkanaal']);
assert.deepEqual(hero.fields, { onderregel: ['Een kleinschalige plek in Ter Aar.'] });
assert.equal(field(hero, 'onderregel'), 'Een kleinschalige plek in Ter Aar.');
// capitalized "Prijs:" is content, not a key line
assert.equal(hero.blocks.length, 2);
assert.equal(hero.blocks[1].type === 'paragraph' && hero.blocks[1].content[1].type, 'placeholder');
const heroInline = (hero.blocks[0] as { content: { type: string }[] }).content.map((i) => i.type);
assert.deepEqual(heroInline, ['text', 'strong', 'text', 'em', 'text']);

// placeholders as their own type, lists, links, notes
const welkom = section(copy, 'welkom bij naescas')!;
assert.equal(welkom.blocks.length, 3);
const [p, ul, ol] = welkom.blocks;
assert.equal(p.type, 'paragraph');
if (p.type === 'paragraph') {
  assert.ok(p.content.some((i) => i.type === 'placeholder' && i.value === 'openingsdatum seizoen'));
  assert.ok(p.content.some((i) => i.type === 'link' && i.href === '/over-ons/'));
}
assert.equal(ul.type === 'list' && !ul.ordered && ul.items.length, 3);
assert.equal(ol.type === 'list' && ol.ordered && ol.items.length, 2);
if (ul.type === 'list') assert.equal(ul.items[2][1].type, 'placeholder');
assert.deepEqual(welkom.notes, ['Foto volgt na de shoot']);
assert.ok(toPlain(welkom.blocks, true).includes('[nog in te vullen: openingsdatum seizoen]'));

// items (### without ?) with their own alt
const kern = section(copy, 'Kernwaarden')!;
assert.deepEqual(kern.items.map((i) => i.title), ['Rust', 'Fietsen en wandelen']);
assert.deepEqual(kern.items[0].alts, ['Leeg bankje aan het water']);
assert.equal(kern.faq.length, 0);

// FAQ pairs (### ending with ?)
const faq = section(copy, 'Veelgestelde vragen')!;
assert.deepEqual(faq.faq.map((f) => f.question), ['Mag mijn hond mee?', 'Hoe laat kan ik aankomen?']);
assert.equal(faq.faq[0].answer[0].type === 'paragraph' && faq.faq[0].answer[0].content[0].type, 'placeholder');
assert.equal(toPlain(faq.faq[1].answer), 'Aankomst vanaf 14.00 uur. Vertrek voor 11.00 uur.');
// two lines in one paragraph keep a break between them
const ans = faq.faq[1].answer[0];
assert.ok(ans.type === 'paragraph' && ans.content.some((i) => i.type === 'break'));

console.log('PARSER OK');
