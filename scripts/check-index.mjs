// noindex pages and sitemap content
import { readFileSync } from 'node:fs';
import { ROUTES, NOINDEX, html } from './lib-dist.mjs';
const problems = [];
for (const r of ROUTES) {
  const no = /<meta name="robots" content="noindex/.test(html(r));
  if (NOINDEX.includes(r) !== no) problems.push(`${r}: noindex=${no}`);
}
const sm = readFileSync('dist/sitemap-0.xml', 'utf8');
const urls = [...sm.matchAll(/<loc>https:\/\/naescas\.nl([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const r of NOINDEX) if (urls.includes(r)) problems.push(`sitemap has ${r}`);
if (urls.length !== ROUTES.length - NOINDEX.length) problems.push(`sitemap has ${urls.length} urls`);
console.log(`${urls.length} urls in sitemap`);
console.log(problems.join('\n') || 'INDEX OK');
