# tou.gg

Public brand home of Maqsudjon Polatov. **TOU = “to you.”**

This repository is the GitHub Pages source for [tou.gg](https://tou.gg). The live preview in Grok Built is the same site.

## Local

```bash
npm install
npm run dev
```

Open the printed local URL. Production build:

```bash
npm run build
```

Brand assets (favicon, OG) are generated in code:

```bash
node scripts/brand.mjs
```

No AI raster images. SVG is canonical; JPEG/PNG are exports.

## Pages + DNS

GitHub Pages serves this repo (root) at **tou.gg**.

Cloudflare DNS is already pointed:

- Apex `tou.gg` — A records to GitHub Pages IPs
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- `www.tou.gg` — CNAME to `maqsudjon-cell.github.io`

`CNAME` in this repo contains exactly:

```
tou.gg
```

Enable Pages: repo Settings → Pages → Deploy from branch `main` / `/ (root)`.

`www` should redirect to apex (Cloudflare “www to root” or a Pages redirect).

## Stack

TanStack Start + React + Tailwind v4. Type: Instrument Serif (wordmark, headlines, body) and IBM Plex Mono (nav, domains, dates). Accent: electric lime `#C8F542`. Motion respects `prefers-reduced-motion`.

## Contact

Maqsudjon Polatov · Tashkent · [polatovmaqsudjon1@gmail.com](mailto:polatovmaqsudjon1@gmail.com) · [Telegram](https://t.me/mrbmp13)
