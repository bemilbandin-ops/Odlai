import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

await mkdir('dist/assets', { recursive: true });
await copyFile('src/styles.css', 'dist/assets/styles.css');
await copyFile('index.html', 'dist/index.html');
if (existsSync('public/robots.txt')) await copyFile('public/robots.txt', 'dist/robots.txt');
if (existsSync('public/sitemap.xml')) await copyFile('public/sitemap.xml', 'dist/sitemap.xml');
await writeFile('dist/.nojekyll', '');
