// Scans visible text of built HTML for em dashes, exclamation marks and emoji.
// Usage: node scripts/check-text.mjs dist
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) walk(p);
  else if (p.endsWith('.html')) files.push(p);
});
walk(process.argv[2] ?? 'dist');

const problems = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  for (const [name, re] of [['em dash', /—/g], ['exclamation', /!/g], ['emoji', /\p{Extended_Pictographic}/gu]]) {
    const m = text.match(re);
    if (m) problems.push(`${f}: ${name} x${m.length}`);
  }
}
console.log(`${files.length} files scanned`);
console.log(problems.length ? problems.join('\n') : 'TEXT OK');
