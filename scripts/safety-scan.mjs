import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const decode = (codes) => String.fromCharCode(...codes);
const terms = [
  [99,97,110,110,97,98,105,115],
  [109,97,114,105,106,117,97,110,97],
  [119,101,101,100],
  [84,72,67],
  [67,66,68],
  [52,50,48],
  [115,109,111,107,101],
  [98,117,100,115],
  [115,116,101,97,108,116,104,32,103,114,111,119],
].map(decode);
const skipDirs = new Set(['.git', 'node_modules', 'dist']);
const skipFiles = new Set(['groweq-site.md', 'scripts/safety-scan.mjs']);
const scanExtensions = ['.ts', '.css', '.html', '.md', '.json', '.xml', '.txt'];
const findings = [];

const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) await walk(path);
      continue;
    }
    if (skipFiles.has(path.replace(/^\.\//, '')) || !scanExtensions.some((ext) => path.endsWith(ext))) continue;
    const text = await readFile(path, 'utf8');
    const lower = text.toLocaleLowerCase('sv-SE');
    for (const term of terms) {
      if (lower.includes(term.toLocaleLowerCase('sv-SE'))) findings.push(`${path}: otillåtet sökord hittades`);
    }
  }
};

await walk('.');
if (findings.length) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log('Säker språkgenomgång klar.');
