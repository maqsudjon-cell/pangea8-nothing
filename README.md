# tou.gg

Public brand home of Maqsudjon Polatov. **TOU = “to you.”**

Static site. GitHub Pages serves this repo (root) at [tou.gg](https://tou.gg).

## Local

No build step. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
```

Brand assets (favicon, OG) are generated in code — no AI rasters:

```bash
node scripts/brand.mjs
```

Requires Node, Pillow (`PIL`), and ffmpeg. SVG is canonical; PNG/JPEG are exports.

## Pages + DNS

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

Enable Pages if it is not on yet: **Settings → Pages → Deploy from branch `main` / `/ (root)`**.

`www` should redirect to apex (Cloudflare “www to root”, or a Pages redirect).

## Stack

HTML + CSS + a small JS file. Type: Instrument Serif (wordmark), IBM Plex Sans, IBM Plex Mono — self-hosted woff2. Accent: cold steel `#7DE1C3`. Motion respects `prefers-reduced-motion`.

## Contact

Maqsudjon Polatov · Tashkent · [polatovmaqsudjon1@gmail.com](mailto:polatovmaqsudjon1@gmail.com) · [Telegram](https://t.me/mrbmp13)
