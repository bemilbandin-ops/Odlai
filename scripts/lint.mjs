import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const allowedExtensions = new Set(['.ts', '.css', '.html', '.md', '.mjs', '.json', '.xml', '.txt']);
const skip = new Set(['node_modules', 'dist', '.git']);
const issues = [];

const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if ([...allowedExtensions].some((ext) => path.endsWith(ext))) {
      const text = await readFile(path, 'utf8');
      if (/\t/.test(text)) issues.push(`${path}: innehåller tabbar`);
      if (new RegExp('TO' + 'DO(?! placeholder)', 'i').test(text)) issues.push(`${path}: innehåller ofärdig arbetsmarkering`);
      if (/try\s*\{\s*import\s/.test(text)) issues.push(`${path}: import i try-block`);
    }
  }
};

await walk('.');
if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('Lintkontroll klar.');
