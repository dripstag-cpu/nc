// Copies the copywriters' files from ../content/copy/*.md (outside this repo) into
// src/content/copy/ (inside the repo, read by the content collection and committed).
// Mirror: files removed at the source are removed here too. Run: npm run sync-copy
import { readdirSync, copyFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, '..', 'content', 'copy');
const DEST = join(root, 'src', 'content', 'copy');

if (!existsSync(SRC)) {
  console.error(`sync-copy: source not found: ${SRC}`);
  process.exit(1);
}
mkdirSync(DEST, { recursive: true });

const srcFiles = readdirSync(SRC).filter((f) => f.endsWith('.md'));
let copied = 0;
let unchanged = 0;
for (const f of srcFiles) {
  const from = join(SRC, f);
  const to = join(DEST, f);
  if (existsSync(to) && readFileSync(from).equals(readFileSync(to))) {
    unchanged++;
    continue;
  }
  copyFileSync(from, to);
  copied++;
}
let removed = 0;
for (const f of readdirSync(DEST).filter((f) => f.endsWith('.md'))) {
  if (!srcFiles.includes(f)) {
    rmSync(join(DEST, f));
    removed++;
  }
}
console.log(`sync-copy: ${srcFiles.length} files in source, ${copied} copied, ${unchanged} unchanged, ${removed} removed`);
