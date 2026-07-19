// Regenerates the static screenshots that /flow's screen tiles render.
//
// Why this exists: /flow used to embed live <iframe>s of the real app, but
// design-capture tools (e.g. Figma's HTML-capture plugins) can't reach
// inside an iframe's own document — they saw an empty box where the screen
// should be. Pre-rendered PNGs fix that, at the cost of going stale
// whenever the UI or seed data changes — re-run this script after such a
// change: `npm run flow:capture`.
//
// Drives the machine's installed Google Chrome via puppeteer-core (no
// bundled browser download) over the DevTools Protocol — real wall-clock
// waits, not Chrome's --virtual-time-budget flag, which hangs indefinitely
// on this app because MSW registers a real Service Worker and virtual time
// never lets its lifecycle settle. macOS-only (hardcodes the Chrome.app
// path) — this is a one-off dev-machine tool, not something the app or its
// users ever run.

import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { FLOWS } from '../src/features/flow/flowsConfig.js';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const DEV_URL = 'http://localhost:5173';
const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const OUT_DIR = path.join(ROOT, 'public', 'flow-screens');

// --- Build the unique (path -> image) list from the single source of truth ---
const shots = new Map(); // path -> image
for (const flow of FLOWS) {
  for (const { path: p, image } of flow.screens) {
    if (!image) continue;
    const existing = shots.get(p);
    if (existing && existing !== image) {
      throw new Error(`flowsConfig.js: path "${p}" maps to both "${existing}" and "${image}"`);
    }
    shots.set(p, image);
  }
}
console.log(`Found ${shots.size} unique screens to capture.`);

// --- Start the dev server (skip if one's already running) ---
async function serverReady() {
  try {
    const res = await fetch(DEV_URL);
    return res.ok;
  } catch {
    return false;
  }
}

let devServer = null;
if (!(await serverReady())) {
  console.log('Starting dev server...');
  devServer = spawn('npm', ['run', 'dev'], { cwd: ROOT, stdio: 'ignore', detached: true });
  const deadline = Date.now() + 30_000;
  while (!(await serverReady())) {
    if (Date.now() > deadline) throw new Error('Dev server did not become ready in 30s');
    await new Promise((r) => setTimeout(r, 500));
  }
}
console.log('Dev server ready.');

// --- Drive Chrome via CDP ---
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  defaultViewport: { width: 1280, height: 800 },
});

try {
  const page = await browser.newPage();

  console.log('Warming up session via /flow...');
  await page.goto(`${DEV_URL}/flow`, { waitUntil: 'networkidle0', timeout: 20_000 });

  mkdirSync(OUT_DIR, { recursive: true });
  const failures = [];
  let i = 0;
  for (const [screenPath, image] of shots) {
    i += 1;
    const outFile = path.join(ROOT, 'public', image);
    const url = `${DEV_URL}${screenPath}`;
    console.log(`[${i}/${shots.size}] ${screenPath} -> ${image}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 20_000 });
      await page.screenshot({ path: outFile });
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failures.push(screenPath);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} screen(s) failed to capture: ${failures.join(', ')}`);
    process.exitCode = 1;
  } else {
    console.log(`\nDone. ${shots.size} screenshots written to public/flow-screens/.`);
  }
} finally {
  await browser.close();
  if (devServer) {
    process.kill(-devServer.pid);
  }
}
