// Tommy widgets only on the widget pages, right type, right order, one per type.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { WIDGET_PAGES } from './lib-dist.mjs';

const pages = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); });
walk('dist');
const problems = [];
let found = 0;
for (const p of pages) {
  const s = readFileSync(p, 'utf8');
  const route = p === 'dist/404.html' ? '/404/' : p.replace(/^dist/, '').replace(/index\.html$/, '');
  const types = [...s.matchAll(/<div[^>]*data-tommy-widget="([a-z]+)"/g)].map((m) => m[1]);
  const expected = WIDGET_PAGES[route];
  if (!expected) {
    if (/tommbooking|data-tommy-widget/.test(s)) problems.push(`${route}: Tommy code on a non-widget page`);
    continue;
  }
  found++;
  if (types.length !== 1 || types[0] !== expected) problems.push(`${route}: widgets ${types} (expected ${expected})`);
  const pos = [s.indexOf('/assets/widgets.css'), s.indexOf('--t3-primary'), s.indexOf("gtag('consent','default'"), s.indexOf('data-tommy-widget=')];
  if (pos.some((x) => x < 0) || !pos.every((x, i) => i === 0 || pos[i - 1] < x)) problems.push(`${route}: order ${pos}`);
  if (!s.includes('--t3-text-default:34, 66, 43') || !s.includes('--t3-border-radius:4px')) problems.push(`${route}: style overrides`);
  if (s.includes('De boekingsmodule wordt geleverd door Tommy Booking Support.')) problems.push(`${route}: Tommy credit line still visible`);
  if (expected !== 'reservation' && !s.includes('echte tarieven in het boekingssysteem')) problems.push(`${route}: test price chip missing`);
  if (!s.includes('.t3-matrix-popover{position:fixed!important')) problems.push(`${route}: popover fix missing`);
}
console.log(problems.join('\n') || `WIDGETS OK ${found}`);
