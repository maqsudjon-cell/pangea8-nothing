#!/usr/bin/env python3
"""Build tou.gg from src/ into site/ (the deploy) and preview/ (the Artifact preview).

    python3 build.py

src/home.html    home page body (Artifact form: <title>, fonts, <style>, markup, <script>)
src/cv.html      CV page, a full document with {{HEAD}} where the shared head goes
src/notes/*.md   one essay per file: front matter, then a small Markdown subset
src/img/         site screenshots (webp), copied as-is
src/brand/       favicons and OG images, made by brand.py

Links inside src are written root-relative (/work/zitou/). The build rewrites them
relative to each page so the same files work on tou.gg and inside the preview.
"""
import html
import json
import re
import shutil
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
SITE = "https://tou.gg"
AUTHOR = "Maqsudjon Polatov"
GSC_TOKEN = "On9oW2bT9G3wndosR-K_KcL85-D6v_XpetjXbPEVUaY"   # Search Console HTML-tag verification, keep
GOATCOUNTER = '<script data-goatcounter="https://tou.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>'
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;800'
         '&family=Big+Shoulders+Stencil+Display:wght@700;800&family=Instrument+Sans:wght@400;500;600&family=Kalam:wght@400;700'
         '&family=Geist+Mono:wght@400;500&display=swap">')

# Old URLs that no longer have a page of their own, and where they went.
LANGS = ["uz", "ru", "zh"]
OLD_PAGES = ["", "work/", "work/flarestamina/", "work/ailenta/", "work/chertma/", "work/nullsample/",
             "work/tadam/", "work/kvadrat/", "cv/", "log/", "log/why-tou/", "log/code-and-steel/",
             "about/", "now/", "colophon/"]
GONE = {"about/": "", "now/": "", "colophon/": "work/tou-gg/", "work/tou.gg/": "work/tou-gg/"}


# ---------------------------------------------------------------- markdown subset
def inline(text):
    t = html.escape(text, quote=False)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?!\w)", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>', t)
    return t


def markdown(md):
    out, blocks = [], re.split(r"\n\s*\n", md.strip())
    for b in blocks:
        lines = b.strip("\n").split("\n")
        first = lines[0]
        if first.startswith("### "):
            out.append(f"<h3>{inline(first[4:])}</h3>")
        elif first.startswith("## "):
            text = first[3:]
            anchor = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
            out.append(f'<h2 id="{anchor}">{inline(text)}</h2>')
        elif re.match(r"!\[[^\]]*\]\([^)]+\)$", first) and len(lines) == 1:
            alt, src = re.match(r"!\[([^\]]*)\]\(([^)]+)\)", first).groups()
            out.append(f'<figure><img src="{src}" alt="{html.escape(alt)}" width="800" height="500" loading="lazy">'
                       f"<figcaption>{inline(alt)}</figcaption></figure>")
        elif all(l.startswith("- ") for l in lines):
            out.append("<ul>" + "".join(f"<li>{inline(l[2:])}</li>" for l in lines) + "</ul>")
        elif all(re.match(r"\d+\. ", l) for l in lines):
            items = [inline(re.sub(r"^\d+\. ", "", l)) for l in lines]
            out.append("<ol>" + "".join(f"<li>{i}</li>" for i in items) + "</ol>")
        elif all(l.startswith(">") for l in lines):
            out.append("<blockquote><p>" + inline(" ".join(l.lstrip("> ") for l in lines)) + "</p></blockquote>")
        elif all(l.startswith("|") for l in lines) and len(lines) >= 3:
            rows = [[c.strip() for c in l.strip("|").split("|")] for l in lines if not re.match(r"^\|[\s:|-]+\|$", l)]
            head, body = rows[0], rows[1:]
            out.append('<div class="table"><table><thead><tr>' + "".join(f"<th>{inline(c)}</th>" for c in head) +
                       "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body) +
                       "</tbody></table></div>")
        else:
            out.append("<p>" + inline(" ".join(lines)) + "</p>")
    return "\n".join(out)


def parse_note(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---\n(.*)", raw, re.S)
    meta, body = {}, m.group(2)
    key = None
    for line in m.group(1).split("\n"):
        if line.startswith("  - ") and key:
            meta.setdefault(key, []).append(line[4:].strip())
        elif ":" in line:
            key, val = line.split(":", 1)
            key, val = key.strip(), val.strip()
            meta[key] = val if val else []
    meta["body_md"] = body
    meta["body"] = markdown(body)
    words = len(re.findall(r"\w+", re.sub(r"<[^>]+>", " ", meta["body"])))
    meta["words"] = words
    meta["minutes"] = max(1, round(words / 220))
    meta["path"] = f"{meta['section']}/{meta['slug']}/"
    meta["dt"] = datetime.fromisoformat(meta["date"]).replace(tzinfo=timezone.utc)
    return meta


# ---------------------------------------------------------------- links
def relink(doc, depth, preview):
    """Root-relative href/src -> relative to the page; in preview, folders get index.html."""
    up = "../" * depth

    def fix(m):
        attr, url = m.group(1), m.group(2)
        if not url.startswith("/") or url.startswith("//"):
            return m.group(0)
        path, frag = (url.split("#", 1) + [""])[:2]
        rel = up + path.lstrip("/")
        if preview and (rel == "" or rel.endswith("/")):
            rel += "index.html"
        if rel == "":
            rel = "./"
        return f'{attr}="{rel}{"#" + frag if frag else ""}"'

    return re.sub(r'(href|src)="([^"]*)"', fix, doc)


# ---------------------------------------------------------------- head
def head(title, description, path, image="/brand/og.jpg", kind="website", extra_ld=None, verify=False):
    url = SITE + "/" + path
    img = SITE + image
    ld = extra_ld or {}
    parts = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
        f"<title>{html.escape(title)}</title>",
        f'<meta name="description" content="{html.escape(description)}">',
        f'<link rel="canonical" href="{url}">',
        f'<meta name="author" content="{AUTHOR}">',
        '<meta name="theme-color" content="#0E1012">',
        f'<meta property="og:type" content="{kind}">',
        '<meta property="og:site_name" content="tou.gg">',
        f'<meta property="og:title" content="{html.escape(title)}">',
        f'<meta property="og:description" content="{html.escape(description)}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{img}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:site" content="@toudotgg">',
        '<link rel="icon" href="/favicon.ico" sizes="32x32">',
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
        '<link rel="manifest" href="/site.webmanifest">',
        '<link rel="alternate" type="application/rss+xml" title="tou.gg notes" href="/rss.xml">',
    ]
    if verify:
        parts.insert(3, f'<meta name="google-site-verification" content="{GSC_TOKEN}">')
    if ld:
        parts.append('<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + "</script>")
    return "\n".join(parts)


PERSON = {
    "@type": "Person", "@id": SITE + "/#person", "name": AUTHOR, "url": SITE + "/",
    "jobTitle": "Product engineer", "email": "mailto:polatovmaqsudjon1@gmail.com",
    "address": {"@type": "PostalAddress", "addressLocality": "Tashkent", "addressCountry": "UZ"},
    "sameAs": ["https://github.com/maqsudjon-cell", "https://huggingface.co/Maqsudjonpolatov",
               "https://x.com/toudotgg", "https://instagram.com/toudotgg", "https://t.me/toudotgg",
               "https://maqsudjon.com/"],
}


def document(head_html, style_and_body, preview):
    if preview:  # a supporting page inside the Artifact: own doctype, no analytics or SEO
        title = re.search(r"<title>.*?</title>", head_html).group(0)
        return (f'<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                f'<meta name="viewport" content="width=device-width, initial-scale=1">\n{title}\n{FONTS}\n</head>\n'
                f'<body>\n{style_and_body}\n</body>\n</html>\n')
    return f'<!doctype html>\n<html lang="en">\n<head>\n{head_html}\n{FONTS}\n{GOATCOUNTER}\n</head>\n<body>\n{style_and_body}\n</body>\n</html>\n'


# ---------------------------------------------------------------- shared article chrome
ARTICLE_CSS = (SRC / "article.css").read_text(encoding="utf-8")


def topbar():
    return ('<header class="top wrap"><a class="logo" href="/">tou<span>.</span>gg</a>'
            '<nav class="nav" aria-label="Site"><a href="/#work">Projects</a><a href="/log/">Notes</a>'
            '<a href="/cv/">CV</a><a href="/#contact">Contact</a></nav></header>')


def footer():
    return ('<footer class="foot wrap"><span>© 2026 Maqsudjon Polatov · tou = to you, gg = given gladly</span>'
            '<span><a href="/log/">All notes</a> · <a href="/rss.xml">RSS</a> · <a href="https://t.me/toudotgg">Telegram</a></span></footer>')


def card(n):
    img = f'<div class="shot"><img src="/img/{n["image"]}" alt="" width="800" height="500" loading="lazy"></div>' if n.get("image") else '<div class="shot shot-text" aria-hidden="true">' + html.escape(n.get("project", n["title"])) + "</div>"
    return (f'<a class="ncard" href="/{n["path"]}">{img}<div class="nbody">'
            f'<span class="nmeta">{n["dt"].strftime("%-d %b %Y")} · {n["minutes"]} min read</span>'
            f'<b>{html.escape(n["title"])}</b><span class="ndesc">{html.escape(n["description"])}</span></div></a>')


def article_page(n, notes, preview):
    others = [o for o in notes if o is not n]
    idx = notes.index(n)
    nxt = notes[(idx + 1) % len(notes)]
    facts = ""
    if n.get("facts"):
        rows = "".join(f"<div><dt>{html.escape(f.split(':', 1)[0])}</dt><dd>{inline(f.split(':', 1)[1].strip())}</dd></div>" for f in n["facts"])
        facts = f'<dl class="facts">{rows}</dl>'
    live = f'<a class="btn btn-solid" href="{n["url"]}">Open {html.escape(n.get("project", "site"))} ↗</a>' if n.get("url") else ""
    hero = f'<figure class="hero-shot"><img src="/img/{n["image"]}" alt="{html.escape(n.get("project", ""))} home page" width="800" height="500"></figure>' if n.get("image") else ""
    tags = "".join(f'<span class="tag">{html.escape(t.strip())}</span>' for t in n.get("tags", "").split(",") if t.strip())
    body = f"""<style>{ARTICLE_CSS}</style>
{topbar()}
<main class="wrap">
  <article class="post">
    <p class="crumbs"><a href="/log/">Notes</a> / {html.escape(n.get("project", n["title"]))}</p>
    <h1>{html.escape(n["title"])}</h1>
    <p class="lede">{html.escape(n["description"])}</p>
    <p class="meta"><time datetime="{n["date"]}">{n["dt"].strftime("%-d %B %Y")}</time> · {n["minutes"]} min read · {tags}</p>
    <div class="actions">{live}<a class="btn" href="/rss.xml">RSS</a></div>
    {hero}
    {facts}
    <div class="prose">
{n["body"]}
    </div>
    <aside class="next"><span>Next note</span><a href="/{nxt["path"]}">{html.escape(nxt["title"])} →</a></aside>
  </article>
  <section class="more" aria-label="More notes">
    <h2>More notes</h2>
    <div class="ngrid">{"".join(card(o) for o in [o for o in others if o is not nxt][:3])}</div>
  </section>
</main>
{footer()}"""
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BlogPosting", "headline": n["title"], "description": n["description"],
         "datePublished": n["date"], "dateModified": n.get("updated", n["date"]),
         "mainEntityOfPage": SITE + "/" + n["path"], "url": SITE + "/" + n["path"],
         "image": SITE + f"/brand/og/{n['slug']}.jpg", "wordCount": n["words"],
         "author": {"@id": SITE + "/#person"}, "publisher": {"@id": SITE + "/#person"},
         "inLanguage": "en", "keywords": n.get("tags", "")},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "tou.gg", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Notes", "item": SITE + "/log/"},
            {"@type": "ListItem", "position": 3, "name": n["title"], "item": SITE + "/" + n["path"]}]},
        PERSON]}
    h = head(f'{n.get("seo_title", n["title"])} · {AUTHOR}', n["description"], n["path"],
             image=f"/brand/og/{n['slug']}.jpg", kind="article", extra_ld=ld)
    h += f'\n<meta property="article:published_time" content="{n["date"]}">'
    return document(h, body, preview)


def index_page(title, lede, path, items, preview, eyebrow):
    body = f"""<style>{ARTICLE_CSS}</style>
{topbar()}
<main class="wrap">
  <section class="index-head">
    <p class="eyebrow">{eyebrow}</p>
    <h1>{html.escape(title)}</h1>
    <p class="lede">{html.escape(lede)}</p>
    <div class="actions"><a class="btn btn-solid" href="/rss.xml">Subscribe with RSS</a><a class="btn" href="/">Home</a></div>
  </section>
  <div class="ngrid">{"".join(card(n) for n in items)}</div>
</main>
{footer()}"""
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "CollectionPage", "name": title, "description": lede, "url": SITE + "/" + path,
         "hasPart": [{"@type": "BlogPosting", "headline": n["title"], "url": SITE + "/" + n["path"]} for n in items]},
        PERSON]}
    return document(head(f"{title} · {AUTHOR}", lede, path, extra_ld=ld), body, preview)


def redirect_page(target):
    url = SITE + "/" + target
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved to {url}</title>'
            f'<link rel="canonical" href="{url}"><meta name="robots" content="noindex">'
            f'<meta http-equiv="refresh" content="0; url=/{target}"></head>'
            f'<body><p>This page moved to <a href="/{target}">{url}</a>.</p></body></html>\n')


# ---------------------------------------------------------------- feeds
def rss(notes):
    items = []
    for n in notes:
        url = SITE + "/" + n["path"]
        content = relink(n["body"], 0, False).replace('href="', 'href="').replace('src="img/', f'src="{SITE}/img/')
        content = re.sub(r'(href|src)="(?!https?:|mailto:|#)([^"]*)"', lambda m: f'{m.group(1)}="{SITE}/{m.group(2)}"', content)
        items.append(f"""  <item>
    <title>{html.escape(n["title"])}</title>
    <link>{url}</link>
    <guid isPermaLink="true">{url}</guid>
    <pubDate>{format_datetime(n["dt"])}</pubDate>
    <description>{html.escape(n["description"])}</description>
    <content:encoded><![CDATA[<p><img src="{SITE}/brand/og/{n['slug']}.jpg" alt=""></p>{content}]]></content:encoded>
  </item>""")
    newest = max(n["dt"] for n in notes)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>tou.gg · notes by Maqsudjon Polatov</title>
  <link>{SITE}/log/</link>
  <atom:link href="{SITE}/rss.xml" rel="self" type="application/rss+xml"/>
  <description>Long notes on every project: what it does, how it was built, and what went wrong. Tashkent, in code and steel.</description>
  <language>en</language>
  <lastBuildDate>{format_datetime(newest)}</lastBuildDate>
{chr(10).join(items)}
</channel>
</rss>
"""


def sitemap(notes, today):
    urls = [("", today, "1.0"), ("cv/", today, "0.8"), ("work/", today, "0.8"), ("log/", today, "0.8")]
    urls += [(n["path"], n.get("updated", n["date"]), "0.7") for n in notes]
    rows = "\n".join(f"  <url><loc>{SITE}/{p}</loc><lastmod>{d}</lastmod><priority>{pr}</priority></url>" for p, d, pr in urls)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{rows}\n</urlset>\n'


# ---------------------------------------------------------------- main
def write(base, rel, text):
    p = base / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def main():
    today = datetime.now(timezone.utc).date().isoformat()
    notes = sorted((parse_note(p) for p in (SRC / "notes").glob("*.md")),
                   key=lambda n: (n["dt"], -int(n.get("order", 50))), reverse=True)
    work = sorted([n for n in notes if n["section"] == "work"], key=lambda n: int(n.get("order", 50)))
    notes_order = work + [n for n in notes if n["section"] != "work"]

    home_src = (SRC / "home.html").read_text(encoding="utf-8")
    latest = "".join(card(n) for n in work[:6])
    home_src = home_src.replace("<!--LATEST_NOTES-->", latest).replace("<!--NOTE_COUNT-->", str(len(notes)))
    home_body = re.sub(r"^<title>.*?</title>\s*", "", home_src, flags=re.S)
    home_body = re.sub(r'<link rel="(preconnect|stylesheet)"[^>]*>\s*', "", home_body)
    home_ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebSite", "@id": SITE + "/#site", "url": SITE + "/", "name": "tou.gg", "publisher": {"@id": SITE + "/#person"}},
        {"@type": "ProfilePage", "url": SITE + "/", "mainEntity": {"@id": SITE + "/#person"}},
        PERSON]}
    home_head = head(f"{AUTHOR} · tou.gg", "Maqsudjon Polatov, product engineer in Tashkent. I weld metal by day and ship software by night: 18 live sites, open data and notes on every build.", "", extra_ld=home_ld, verify=True)

    cv_src = (SRC / "cv.html").read_text(encoding="utf-8")
    cv_head = head(f"CV · {AUTHOR}", "CV of Maqsudjon Polatov, product engineer in Tashkent: 18 live sites in 19 months while welding full-time.", "cv/",
                   extra_ld={"@context": "https://schema.org", "@graph": [PERSON]})

    for preview in (False, True):
        out = ROOT / ("preview" if preview else "site")
        if out.exists():
            shutil.rmtree(out)
        out.mkdir()
        shutil.copytree(SRC / "img", out / "img")
        brand = SRC / "brand"
        if brand.exists():
            shutil.copytree(brand, out / "brand")
            for f in ("favicon.svg", "favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png"):
                if (brand / f).exists():
                    shutil.copy(brand / f, out / f)
        if (SRC / "Maqsudjon-Polatov-CV.pdf").exists():
            shutil.copy(SRC / "Maqsudjon-Polatov-CV.pdf", out / "Maqsudjon-Polatov-CV.pdf")

        # home: in preview it is the Artifact page itself (no doctype), on the site a full document
        home = relink(home_src if preview else home_body, 0, preview)
        if preview:
            home = home.replace(GOATCOUNTER, "")
            write(out, "home.html", home)
        else:
            write(out, "index.html", document(home_head, home, False))

        cv = cv_src.replace("{{HEAD}}", '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>CV · Maqsudjon Polatov</title>' if preview else cv_head + "\n" + GOATCOUNTER)
        write(out, "cv/index.html", relink(cv, 1, preview))

        for n in notes:
            write(out, n["path"] + "index.html", relink(article_page(n, notes_order, preview), 2, preview))
        write(out, "log/index.html", relink(index_page("Notes", "Long notes on every project: what it does, how it was built, what broke, and the numbers as they are.", "log/", notes_order, preview, "Notes · " + str(len(notes))), 1, preview))
        write(out, "work/index.html", relink(index_page("Projects", "Every live site, one note each. Screenshots taken on 14 October 2026.", "work/", work, preview, "Projects · " + str(len(work))), 1, preview))

        if not preview:
            write(out, "rss.xml", rss(notes))
            write(out, "sitemap.xml", sitemap(notes, today))
            write(out, "robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
            write(out, "CNAME", "tou.gg\n")
            write(out, "site.webmanifest", json.dumps({
                "name": "tou.gg · Maqsudjon Polatov", "short_name": "tou.gg", "start_url": "/", "display": "standalone",
                "background_color": "#0E1012", "theme_color": "#0E1012", "lang": "en",
                "icons": [{"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
                          {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
                          {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
                          {"src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml"}]}, indent=2) + "\n")
            write(out, "llms.txt", "# tou.gg\n\n> Maqsudjon Polatov, product engineer in Tashkent. Welds metal by day, ships software by night.\n\n"
                  "## Pages\n\n- [Home](https://tou.gg/)\n- [CV](https://tou.gg/cv/)\n- [Notes](https://tou.gg/log/)\n- [RSS](https://tou.gg/rss.xml)\n\n## Notes\n\n"
                  + "\n".join(f"- [{n['title']}]({SITE}/{n['path']}): {n['description']}" for n in notes_order) + "\n")
            write(out, "humans.txt", "/* TEAM */\nMaqsudjon Polatov, Tashkent. Product engineer and metal fabricator.\nContact: polatovmaqsudjon1@gmail.com · t.me/toudotgg\n")
            write(out, "404.html", document(head("Not found · tou.gg", "This page does not exist.", "404.html"),
                  f'<style>{ARTICLE_CSS}</style>{topbar()}<main class="wrap"><section class="index-head"><p class="eyebrow">404</p>'
                  '<h1>Nothing welded here.</h1><p class="lede">This page does not exist, or it moved when the site was rebuilt.</p>'
                  '<div class="actions"><a class="btn btn-solid" href="/">Home</a><a class="btn" href="/log/">Notes</a></div></section></main>', False))
            # old URLs: language trees and retired pages
            for lang in LANGS:
                for p in OLD_PAGES:
                    target = GONE.get(p, p)
                    write(out, f"{lang}/{p}index.html", redirect_page(target))
            for p, target in GONE.items():
                write(out, f"{p}index.html", redirect_page(target))

    print(f"built {len(notes)} notes ({len(work)} projects) → site/ and preview/")


if __name__ == "__main__":
    main()
