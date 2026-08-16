// Render a local HTML file to PDF via headless Chrome (CDP Page.printToPDF).
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , src, out] = process.argv;

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9400 + Math.floor(Math.random() * 300);
const profile = mkdtempSync(join(tmpdir(), 'pdf-'));

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${profile}`, `--remote-debugging-port=${PORT}`,
  '--font-render-hinting=none', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wsUrl() {
  for (let i = 0; i < 80; i++) {
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = tabs.find((t) => t.type === 'page');
      if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('no target');
}

const ws = new WebSocket(await wsUrl());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
  }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const n = ++id;
  pending.set(n, { resolve, reject });
  ws.send(JSON.stringify({ id: n, method, params }));
});

await send('Page.enable');
await send('Runtime.enable');
await send('Page.navigate', { url: pathToFileURL(src).href });
await sleep(3500);

// Make sure webfonts have actually arrived before printing.
await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
await sleep(800);

const { data } = await send('Page.printToPDF', {
  printBackground: true,
  preferCSSPageSize: true,
  marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
});
writeFileSync(out, Buffer.from(data, 'base64'));
console.log('wrote', out);

ws.close();
chrome.kill();
process.exit(0);
