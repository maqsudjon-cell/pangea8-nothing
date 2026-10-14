# tou.gg

The public home of Maqsudjon Polatov, Tashkent. Welds metal by day, ships software by night.

Live: **https://tou.gg** · Notes: https://tou.gg/log/ · RSS: https://tou.gg/rss.xml

This branch is the built site, served by GitHub Pages from `main`. The previous design (19 Sep 2026)
is kept on the `old-design-2026-09` branch and tag.

## Editing

Source lives in `source/`:

| Path | What |
| --- | --- |
| `source/src/home.html` | home page |
| `source/src/cv.html` | CV (print stylesheet makes the PDF) |
| `source/src/notes/*.md` | one note per project, front matter + Markdown |
| `source/src/img/` | screenshots of every site |
| `source/build.py` | builds pages, RSS, sitemap, redirects |
| `source/brand.py` | favicons and Open Graph images (headless Chrome) |

```bash
cd source && python3 brand.py && python3 build.py   # writes source/site/; copy it to the repo root
```

Analytics: GoatCounter (`tou`), no cookies. Search Console is verified by the meta tag on the home page; keep it.
