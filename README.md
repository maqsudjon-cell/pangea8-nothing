# tou.gg

**TOU = to you.** Public brand home of [Maqsudjon Polatov](https://tou.gg) — Tashkent. Welds metal by day. Ships software by night.

Live: [https://tou.gg](https://tou.gg)  
Writing RSS: [https://tou.gg/rss.xml](https://tou.gg/rss.xml)  
Stats: [https://tou.goatcounter.com](https://tou.goatcounter.com)  
Source: this repository **is** the GitHub Pages site (static HTML on `main`).

## Go live (one click)

DNS for `tou.gg` already points at GitHub Pages (`185.199.108–111.153`). GitHub still answers **Site not found** until Pages is switched on **in the repo UI**. Tokens and GitHub Apps cannot create a Pages site.

1. Open [github.com/maqsudjon-cell/tou/settings/pages](https://github.com/maqsudjon-cell/tou/settings/pages)
2. **Build and deployment → Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/ (root)` → **Save**
4. Custom domain should read **tou.gg** (from the `CNAME` file). Wait for the TLS certificate, then tick **Enforce HTTPS**.

After that, every push to `main` publishes. Do not paste personal access tokens into chat or into this repository.

## What this is

A static snapshot of the site. Not a product. The umbrella for fifteen live domains (FlareStamina, AI Lenta, Chertma, …). The lab archive stays at [maqsudjon.com](https://maqsudjon.com).

## Pages

| Path | What |
| --- | --- |
| `/` | Editorial landing — `to you` → `tou.gg` |
| `/work/` | Selected work + case studies |
| `/cv/` | Curriculum vitae, print-ready |
| `/log/` | Writing index. Local notes + outbound archive |
| `/about/` `/now/` `/colophon/` | Bio, this month, type/motion |

Languages on the landing: **UZ / RU / EN**. Same URLs.

## Brand

Generated in code. No stock photos. No model-drawn people.

```bash
node scripts/brand.mjs
```

Writes `favicon.svg`, `apple-touch-icon.png`, `icon-{32,192,512}.png`, `og.svg`, `og.png`, `og.jpg` (1200×630). Palette: ink `#0A0E1A`, weld `#FF6B35`, AI `#00D4FF`.

## Analytics

[GoatCounter](https://www.goatcounter.com) — no cookies, no Google. Site code **`tou`**.

Create the site once: goatcounter.com → new site `tou` → allowed domain `tou.gg`. Public dashboard: `https://tou.goatcounter.com`. Until that exists, the tracker is a silent no-op.

## SEO

- Canonical URLs, Open Graph + Twitter cards (`/og.jpg` 1200×630)
- JSON-LD: WebSite, Person, ItemList, Blog
- `sitemap.xml`, `robots.txt`, `humans.txt`, `llms.txt`
- RSS 2.0 at `/rss.xml` and `/feed.xml`

## DNS

**Apex `tou.gg`** — A records

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**`www.tou.gg`** — CNAME → `maqsudjon-cell.github.io`

`CNAME` in this repo is exactly:

```
tou.gg
```

Until Pages is enabled, GitHub answers **Site not found** on HTTP and TLS is `*.github.io`. After Save, wait for the custom-domain certificate.

## Local (the React app that generates this snapshot)

The editable source lives in the Grok Built workspace. To refresh this repo:

```bash
node --experimental-strip-types scripts/export-static.mjs /tmp/tou-repo
```

Then commit and push `main`.

## Contact

Maqsudjon Polatov · Tashkent  
[polatovmaqsudjon1@gmail.com](mailto:polatovmaqsudjon1@gmail.com) · [Telegram](https://t.me/toudotgg) · [GitHub](https://github.com/maqsudjon-cell)
