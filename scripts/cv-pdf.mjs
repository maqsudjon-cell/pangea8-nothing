#!/usr/bin/env node
/**
 * Render the CV page to a PDF that HR can actually download.
 *
 *   node scripts/cv-pdf.mjs            # English -> /Maqsudjon-Polatov-CV.pdf
 *   node scripts/cv-pdf.mjs uz ru      # also the other language trees
 *
 * It serves the built site on a local port and prints /cv/ with headless
 * Chrome, so the PDF is the page's own print stylesheet — one source, no
 * second copy of the CV to keep in sync.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8907;

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".woff2": "font/woff2",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
};

async function chrome() {
  for (const p of CHROME) {
    try { await stat(p); return p; } catch {}
  }
  throw new Error("No Chrome or Chromium found — install one, or print /cv/ to PDF by hand.");
}

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(req.url.split("?")[0]);
  if (path.endsWith("/")) path += "index.html";
  try {
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});

const locales = process.argv.slice(2).length ? process.argv.slice(2) : ["en"];

await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
try {
  const bin = await chrome();
  for (const loc of locales) {
    const url = `http://127.0.0.1:${PORT}${loc === "en" ? "" : "/" + loc}/cv/`;
    const out = join(ROOT, loc === "en" ? "Maqsudjon-Polatov-CV.pdf" : `Maqsudjon-Polatov-CV-${loc}.pdf`);
    await run(bin, [
      "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
      "--hide-scrollbars", "--run-all-compositor-stages-before-draw",
      // A fixed layout width keeps the PDF identical on every machine.
      "--window-size=1100,1600", "--force-device-scale-factor=1",
      "--virtual-time-budget=6000",
      "--no-pdf-header-footer",
      `--print-to-pdf=${out}`,
      url,
    ], { timeout: 90_000 });
    const { size } = await stat(out);
    console.log(`  ${loc}  ${out.replace(ROOT + "/", "")}  ${(size / 1024).toFixed(0)} KB`);
  }
} finally {
  server.close();
}
console.log("cv pdf done");
