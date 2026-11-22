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

FERRA_UPDATED = "2026-11-09"
FERRA_PAGES = [
    ("", "0.9"), ("privacy/", "0.5"), ("terms/", "0.5"),
    ("features/", "0.7"), ("how-it-works/", "0.7"), ("use-cases/", "0.7"),
    ("agents/", "0.8"), ("agents/researcher/", "0.7"),
    ("agents/inbox-manager/", "0.7"), ("agents/study-coach/", "0.7"),
    ("action-button/", "0.6"), ("pricing/", "0.7"), ("changelog/", "0.5"),
    ("compare/", "0.7"), ("vs/stormi/", "0.7"), ("learn/", "0.7"),
    ("learn/what-is-an-ai-agent/", "0.7"), ("learn/openrouter/", "0.7"),
    ("learn/byok/", "0.7"), ("about/", "0.6"), ("support/", "0.6"),
    ("delete-account/", "0.6")
]

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
        '<meta name="twitter:site" content="@ferrasium">',
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
    "sameAs": ["https://github.com/maqsudjon-cell",
               "https://huggingface.co/Maqsudjonpolatov",
               "https://t.me/ferrasium",
               "https://t.me/ferrasiums",
               "https://x.com/ferrasium",
               "https://www.instagram.com/ferrasiums",
               "https://youtube.com/@ferrasium",
               "https://open.spotify.com/artist/7gyBtPQMFaZbn0iHqtB9nW",
               "https://music.yandex.com/artist/26563617",
               "https://www.reddit.com/user/mrbmp13/",
               "https://medium.com/@polatovmaqsudjon1",
               "https://zitou.app/@ferrasium",
               "https://tou.gg/",
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


SOC_FOOT = '<span class="soc-row"><a class="soc soc-telegram soc-only" href="https://t.me/ferrasium" target="_blank" rel="me noopener" title="Telegram @ferrasium" aria-label="Telegram @ferrasium"><span class="soc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#soc-i-telegram"/></svg></span><span class="soc-txt"><span class="soc-name">Telegram</span></span></a><a class="soc soc-telegram soc-only" href="https://t.me/ferrasiums" target="_blank" rel="me noopener" title="Telegram channel @ferrasiums" aria-label="Telegram channel @ferrasiums"><span class="soc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#soc-i-telegram"/></svg></span><span class="soc-txt"><span class="soc-name">Telegram channel</span></span></a><a class="soc soc-instagram soc-only" href="https://www.instagram.com/ferrasiums" target="_blank" rel="me noopener" title="Instagram @ferrasiums" aria-label="Instagram @ferrasiums"><span class="soc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#soc-i-instagram"/></svg></span><span class="soc-txt"><span class="soc-name">Instagram</span></span></a><a class="soc soc-x soc-only" href="https://x.com/ferrasium" target="_blank" rel="me noopener" title="X @ferrasium" aria-label="X @ferrasium"><span class="soc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#soc-i-x"/></svg></span><span class="soc-txt"><span class="soc-name">X</span></span></a><a class="soc soc-youtube soc-only" href="https://youtube.com/@ferrasium" target="_blank" rel="me noopener" title="YouTube @ferrasium" aria-label="YouTube @ferrasium"><span class="soc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#soc-i-youtube"/></svg></span><span class="soc-txt"><span class="soc-name">YouTube</span></span></a><a class="soc soc-github soc-only" href="https://github.com/maqsudjon-cell" target="_blank" rel="me noopener" title="GitHub maqsudjon-cell" aria-label="GitHub maqsudjon-cell"><span class="soc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#soc-i-github"/></svg></span><span class="soc-txt"><span class="soc-name">GitHub</span></span></a></span><svg class="soc-sprite" width="0" height="0" aria-hidden="true" focusable="false"><defs><linearGradient id="soc-ig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".25" stop-color="#FA7E1E"/><stop offset=".5" stop-color="#D62976"/><stop offset=".75" stop-color="#962FBF"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient><linearGradient id="soc-zg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#19C27A"/><stop offset="1" stop-color="#0B8A5B"/></linearGradient></defs><symbol id="soc-i-telegram" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></symbol><symbol id="soc-i-instagram" viewBox="0 0 24 24"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></symbol><symbol id="soc-i-x" viewBox="0 0 24 24"><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></symbol><symbol id="soc-i-youtube" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></symbol><symbol id="soc-i-github" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></symbol></svg>'


def footer():
    return ('<footer class="foot wrap"><span>© 2026 Maqsudjon Polatov · tou = to you, gg = given gladly</span>'
            '<span><a href="/log/">All notes</a> · <a href="/rss.xml">RSS</a>' + SOC_FOOT + '</span></footer>')


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
        # the note's tags as RSS categories, and whether it is a project page or a note
        cats = "".join(f"\n    <category>{html.escape(t.strip())}</category>" for t in ["Projects" if n["section"] == "work" else "Notes", *n.get("tags", "").split(",")] if t.strip())
        items.append(f"""  <item>
    <title>{html.escape(n["title"])}</title>
    <link>{url}</link>
    <guid isPermaLink="true">{url}</guid>
    <pubDate>{format_datetime(n["dt"])}</pubDate>
    <dc:creator>{AUTHOR}</dc:creator>{cats}
    <description>{html.escape(n["description"])}</description>
    <content:encoded><![CDATA[<p><img src="{SITE}/brand/og/{n['slug']}.jpg" alt=""></p>{content}]]></content:encoded>
    <media:content url="{SITE}/brand/og/{n['slug']}.jpg" medium="image" type="image/jpeg" width="1200" height="630"/>
  </item>""")
    newest = max(n["dt"] for n in notes)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>tou.gg · notes by Maqsudjon Polatov</title>
  <link>{SITE}/log/</link>
  <atom:link href="{SITE}/rss.xml" rel="self" type="application/rss+xml"/>
  <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub"/>
  <description>Long notes on every project: what it does, how it was built, and what went wrong. Tashkent, in code and steel.</description>
  <language>en</language>
  <lastBuildDate>{format_datetime(newest)}</lastBuildDate>
  <copyright>© {newest.year} {AUTHOR}</copyright>
  <ttl>720</ttl>
  <image><url>{SITE}/icon-512.png</url><title>tou.gg · notes by {AUTHOR}</title><link>{SITE}/log/</link></image>
{chr(10).join(items)}
</channel>
</rss>
"""


def sitemap(notes, today):
    urls = [("", today, "1.0"), ("cv/", today, "0.8"), ("work/", today, "0.8"), ("log/", today, "0.8")]
    urls += [(n["path"], n.get("updated", n["date"]), "0.7") for n in notes]
    urls += [(f"ferra/{path}", FERRA_UPDATED, priority) for path, priority in FERRA_PAGES]
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
    home_head = head(f"{AUTHOR} · tou.gg", "Maqsudjon Polatov, product engineer in Tashkent. I weld metal by day and ship software by night: 19 live sites, 2 App Store apps, open data and notes on every build.", "", extra_ld=home_ld, verify=True)

    cv_src = (SRC / "cv.html").read_text(encoding="utf-8")
    cv_head = head(f"CV · {AUTHOR}", "CV of Maqsudjon Polatov, product engineer in Tashkent: 19 live sites and 2 App Store apps in 20 months while welding full-time.", "cv/",
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
                  "## Pages\n\n- [Home](https://tou.gg/)\n- [CV](https://tou.gg/cv/)\n- [Notes](https://tou.gg/log/)\n- [RSS](https://tou.gg/rss.xml)\n\n## Products\n\n- [Ferra AI Agents](https://tou.gg/ferra/): A personal AI-agent app for iPhone built by Maqsudjon Polatov. Each agent has one focused task, its own OpenRouter model and separate chats, with optional encrypted BYOK and approval before external actions. [Product facts, pricing and current availability](https://tou.gg/ferra/llms.txt).\n\n## Notes\n\n"
                  + "\n".join(f"- [{n['title']}]({SITE}/{n['path']}): {n['description']}" for n in notes_order) + "\n")
            write(out, "humans.txt", "/* TEAM */\nMaqsudjon Polatov, Tashkent. Product engineer and metal fabricator.\nContact: polatovmaqsudjon1@gmail.com · t.me/ferrasium\n")
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
