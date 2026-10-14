#!/usr/bin/env node
/**
 * Post-build checks. Run after `node build.mjs`.
 *
 *   node scripts/check.mjs
 *
 * Fails on: a dead internal link, a canonical that does not match the file it
 * sits in, a page missing its hreflang set, or a page that lost its <h1>.
 * External links are reported but never fail the build — someone else's server
 * being down is not a reason to block a deploy.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://tou.gg";
const SKIP = new Set([".git", "node_modules", "fonts", "src", "scripts", ".github"]);

const html = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".html")) html.push(full);
  }
})(ROOT);

const errors = [];
const external = new Set();

for (const file of html) {
  const rel = "/" + file.slice(ROOT.length + 1);
  const src = readFileSync(file, "utf8");

  const canonical = src.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const expected = ORIGIN + rel.replace(/index\.html$/, "").replace(/\/404\.html$/, "/404");
  const indexable = !src.includes('content="noindex');
  if (indexable) {
    if (!canonical) errors.push(`${rel}: no canonical`);
    else if (canonical !== expected) errors.push(`${rel}: canonical is ${canonical}, file lives at ${expected}`);
    for (const l of ["en", "uz", "ru"]) {
      if (!src.includes(`hreflang="${l}"`)) errors.push(`${rel}: missing hreflang ${l}`);
    }
  }
  if (!/<h1[ >]/.test(src)) errors.push(`${rel}: no <h1>`);
  if (/\bundefined\b/.test(src)) errors.push(`${rel}: the word "undefined" leaked into the output`);

  for (const m of src.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) { external.add(href.split("?")[0]); continue; }
    if (!href.startsWith("/")) continue;
    const [path] = href.split("#")[0].split("?");
    const target = path.endsWith("/") ? join(ROOT, path, "index.html") : join(ROOT, path);
    if (!existsSync(target)) errors.push(`${rel}: dead internal link ${href}`);
  }
}

console.log(`checked ${html.length} pages, ${external.size} distinct external links`);

// `--external` actually hits every outbound URL. Slow, and other people's
// servers go down, so it never fails the build — it just tells you what rotted.
if (process.argv.includes("--external")) {
  const urls = [...external].filter((u) => u.startsWith("http") && !u.startsWith(ORIGIN));
  const results = await Promise.all(urls.map(async (u) => {
    try {
      const r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      return [u, r.status];
    } catch { return [u, "unreachable"]; }
  }));
  const bad = results.filter(([, s]) => s === "unreachable" || (typeof s === "number" && s >= 400));
  for (const [u, s] of bad) console.warn(`  ! ${s}  ${u}`);
  console.log(bad.length ? `${bad.length} outbound link(s) need a look` : "every outbound link answers");
}
if (errors.length) {
  for (const e of [...new Set(errors)]) console.error("  ✗ " + e);
  process.exit(1);
}
console.log("no dead internal links, canonicals and hreflang consistent");
