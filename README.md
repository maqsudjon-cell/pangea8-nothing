# tou.gg

**TOU = to you.** The public home of [Maqsudjon Polatov](https://tou.gg) — Tashkent.
Welds metal by day. Ships software by night.

Live: **https://tou.gg** · RSS: [/rss.xml](https://tou.gg/rss.xml) · Source: this repository *is* the site.

| | |
|---|---|
| Languages | English `/`, Uzbek `/uz/`, Russian `/ru/`, Chinese `/zh/` — four URL trees with `hreflang`, not a client-side swap |
| Build | `node build.mjs` — plain Node, zero dependencies, no framework |
| Hosting | GitHub Pages, deploy from `main` |
| DNS | Cloudflare (A records → GitHub Pages, `www` CNAME → `maqsudjon-cell.github.io`) |
| Analytics | GoatCounter, site code `tou` — no cookies, no Google |

## Working on it

```bash
node build.mjs                      # regenerate every page
node scripts/check.mjs              # dead links, canonicals, hreflang, missing h1
node scripts/check.mjs --external   # also pings every outbound URL (slow)
node scripts/cv-pdf.mjs en uz ru zh # print /cv/ to the downloadable PDFs
python3 scripts/brand.py            # favicon, icons, og.png / og.jpg
```

The CV PDF is not a second copy of the CV: `scripts/cv-pdf.mjs` serves the built
site and prints `/cv/` with headless Chrome, so the file HR downloads is the
page's own print stylesheet. Re-run it whenever the CV content changes.

`build.mjs` writes the HTML into the repo root. Commit the output — GitHub Pages
serves these files directly, there is no build step on the server.

**Never edit a generated `.html` file.** The next build overwrites it. Edit:

| File | What lives there |
|---|---|
| `src/content.mjs` | products, case studies, posts, CV, stats — all three languages |
| `src/i18n.mjs` | UI chrome strings + the long-form About / Now / Colophon copy |
| `build.mjs` | page templates, `<head>`, sitemap, RSS, robots |
| `css/app.css` | the whole design system, hand-authored |
| `js/app.js` | motion only — the site reads fine with JS disabled |
| `scripts/cv-pdf.mjs` | renders `/cv/` to `Maqsudjon-Polatov-CV*.pdf` |

The build **fails** if a UI key or a product description is missing in any of the
four languages. That is the only thing that keeps a second language from rotting.

## Pages

`/` · `/work/` + a case study per flagship · `/cv/` (print-ready) · `/log/` + notes ·
`/about/` · `/now/` · `/colophon/` — each one at `/`, `/uz/`, `/ru/` and `/zh/`.

## Brand

Generated in code from the same woff2 files the site ships. No stock photos, no
model-drawn people. `scripts/brand.py` checks every character against the font's
cmap first, so a missing glyph fails the build instead of shipping a tofu box in
every link preview.

Palette: ink `#080B14`, weld `#FF6B35`, AI `#38D9FF`, ok `#3EF29A`.
Type: Space Grotesk (display), Inter (text), JetBrains Mono (data). Self-hosted,
with Cyrillic subsets loaded only when a page actually paints Cyrillic. Chinese
falls through to the reader's own system CJK face — a full Simplified webfont is
megabytes and every platform already ships a good one.

## Setup that is not in this repo

See [HANDOFF.md](HANDOFF.md): GoatCounter, Google Search Console, and the one
GitHub setting that still has to be ticked by hand.

## Contact

Maqsudjon Polatov · Tashkent
[polatovmaqsudjon1@gmail.com](mailto:polatovmaqsudjon1@gmail.com) ·
[Telegram](https://t.me/toudotgg) · [GitHub](https://github.com/maqsudjon-cell)
