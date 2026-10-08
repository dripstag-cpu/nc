// One h1 per page, alt on every img, no raw placeholder markers, canonical present.
import { ROUTES, html } from './lib-dist.mjs';
const problems = [];
for (const r of ROUTES) {
  const s = html(r);
  const h1 = (s.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${r}: ${h1} h1`);
  const imgs = s.match(/<img\b[^>]*>/g) ?? [];
  const noAlt = imgs.filter((t) => !/\salt(=|[\s>])/.test(t));
  if (noAlt.length) problems.push(`${r}: ${noAlt.length} img without alt`);
  if (s.includes('[[NOG IN TE VULLEN')) problems.push(`${r}: raw placeholder`);
  if (!/<link rel="canonical"/.test(s)) problems.push(`${r}: no canonical`);
}
console.log(problems.join('\n') || 'PAGES OK');
