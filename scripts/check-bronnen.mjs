// Every image in src/assets/images must be listed in BRONNEN.md, and every listed file must exist.
import { readdirSync, readFileSync } from 'node:fs';
const dir = 'src/assets/images/';
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
const md = readFileSync(dir + 'BRONNEN.md', 'utf8');
const listed = [...md.matchAll(/^\| ([a-z0-9-]+\.(?:jpe?g|png|webp|avif)) \|/gim)].map((m) => m[1]);
const missing = files.filter((f) => !listed.includes(f));
const extra = listed.filter((f) => !files.includes(f));
console.log(`${files.length} images, ${listed.length} listed`);
console.log(missing.length || extra.length ? `BRONNEN FAIL missing=${missing} extra=${extra}` : 'BRONNEN OK');
