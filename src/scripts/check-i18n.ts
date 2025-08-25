/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';

const read = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const base = read('src/messages/ja.json');
const langs = ['en'];

const walk = (obj: any, path: string[] = []): string[] => Object.entries(obj).flatMap(([k, v]) => v && typeof v === 'object' ? walk(v, [...path, k]) : [[...path, k].join('.')]);

const baseKeys = new Set(walk(base));
for (const lang of langs) {
  const tgt = read(`src/messages/${lang}.json`);
  const tgtKeys = new Set(walk(tgt));
  const missing = [...baseKeys].filter(k => !tgtKeys.has(k));
  if(missing.length) {
    console.error(`[${lang}] missing keys\n` + missing.map(k => ' _ ' + k).join('\n'));
    process.exitCode = 1;
  }
}