import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 4173);
const root = 'dist';
const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const requested = url.pathname === '/' ? '/index.html' : url.pathname;
    const file = normalize(join(root, requested));
    if (!file.startsWith(root)) throw new Error('Invalid path');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types.get(extname(file)) || 'application/octet-stream' });
    res.end(data);
  } catch {
    const data = await readFile(join(root, 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Odlai demo server: http://localhost:${port}`);
});
