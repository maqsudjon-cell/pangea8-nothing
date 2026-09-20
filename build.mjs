#!/usr/bin/env node
/**
 * tou.gg static site generator.
 *
 *   node build.mjs          # write the site into the repo root
 *   node build.mjs --check  # verify translations + links, write nothing
 *
 * Three languages, three URL trees, one template:
 *   /            en   (x-default)
 *   /uz/         uz
 *   /ru/         ru
 *
 * No dependencies, no framework, no build server. GitHub Pages serves the
 * output of this file verbatim.
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site, stats, tags, products, posts, outbound, languages, cv, method, LOCALES, DEFAULT_LOCALE } from "./src/content.mjs";
import { ui, prose } from "./src/i18n.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const CHECK_ONLY = process.argv.includes("--check");
const written = [];
const problems = [];

/* ------------------------------------------------------------------ helpers */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const L = (v, loc) => (v && typeof v === "object" && !Array.isArray(v) ? v[loc] ?? v[DEFAULT_LOCALE] : v);
const t = (loc) => (key) => {
  const v = ui[loc]?.[key];
  if (v === undefined) problems.push(`missing ui key "${key}" for ${loc}`);
  return v ?? ui[DEFAULT_LOCALE][key] ?? key;
};
/** Localised path: en lives at the root, uz and ru get a prefix. */
const href = (loc, path = "/") => (loc === DEFAULT_LOCALE ? path : `/${loc}${path}`);
const abs = (path) => site.origin + path;
const cls = (...xs) => xs.filter(Boolean).join(" ");

const ARROW = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const EXT = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3h7v7M13 3L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/** Pages that exist in every language. Used for nav, sitemap and hreflang. */
const routes = () => {
  const list = [
    { path: "/", key: "home", priority: "1.0", freq: "weekly" },
    { path: "/work/", key: "work", priority: "0.9", freq: "monthly" },
    ...products.filter((p) => p.case).map((p) => ({ path: `/work/${p.slug}/`, key: "case", priority: "0.8", freq: "monthly" })),
    { path: "/cv/", key: "cv", priority: "0.9", freq: "monthly" },
    { path: "/log/", key: "log", priority: "0.7", freq: "weekly" },
    ...posts.map((p) => ({ path: `/log/${p.slug}/`, key: "post", priority: "0.6", freq: "yearly" })),
    { path: "/about/", key: "about", priority: "0.7", freq: "monthly" },
    { path: "/now/", key: "now", priority: "0.6", freq: "weekly" },
    { path: "/colophon/", key: "colophon", priority: "0.3", freq: "yearly" },
  ];
  return list;
};

/* --------------------------------------------------------------------- head */
function head({ loc, path, title, description, type = "website", jsonld = [], article, noindex = false }) {
  const T = t(loc);
  const canonical = abs(href(loc, path));
  // A noindex page (404) gets no canonical and no alternates: there is nothing
  // for a crawler to reconcile, and pointing at URLs that do not exist is worse
  // than saying nothing.
  const discovery = noindex
    ? ""
    : `<link rel="canonical" href="${canonical}"/>\n  `
      + LOCALES.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(href(l, path))}"/>`).join("\n  ")
      + `\n  <link rel="alternate" hreflang="x-default" href="${abs(href(DEFAULT_LOCALE, path))}"/>`;
  const ogLocale = { en: "en_US", uz: "uz_UZ", ru: "ru_RU" }[loc];
  const ogAlt = LOCALES.filter((l) => l !== loc)
    .map((l) => `<meta property="og:locale:alternate" content="${{ en: "en_US", uz: "uz_UZ", ru: "ru_RU" }[l]}"/>`)
    .join("\n  ");

  const ld = jsonld.length ? `\n  <script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : { "@context": "https://schema.org", "@graph": jsonld.map(({ "@context": _c, ...rest }) => rest) })}</script>` : "";

  return `<!doctype html>
<html lang="${loc}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}"/>
  <meta name="author" content="${site.name}"/>
  <meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1"}"/>
  <meta name="theme-color" content="#080B14"/>
  <meta name="color-scheme" content="dark"/>${site.googleSiteVerification ? `\n  <meta name="google-site-verification" content="${site.googleSiteVerification}"/>` : ""}
  ${discovery}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png"/>
  <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
  <link rel="manifest" href="/site.webmanifest"/>
  <link rel="alternate" type="application/rss+xml" title="tou.gg writing" href="${abs("/rss.xml")}"/>
  <link rel="author" href="/humans.txt"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(description)}"/>
  <meta property="og:url" content="${canonical}"/>
  <meta property="og:image" content="${abs("/og.jpg")}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt" content="tou.gg — ${esc(site.name)}"/>
  <meta property="og:type" content="${type}"/>
  <meta property="og:site_name" content="tou.gg"/>
  <meta property="og:locale" content="${ogLocale}"/>
  ${ogAlt}${article ? `\n  <meta property="article:published_time" content="${article}"/>` : ""}
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${esc(title)}"/>
  <meta name="twitter:description" content="${esc(description)}"/>
  <meta name="twitter:image" content="${abs("/og.jpg")}"/>
  <meta name="twitter:creator" content="${site.handle}"/>
  <link rel="preload" href="/fonts/space-grotesk-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="/css/app.css"/>${ld}
</head>
<body>
  <a href="#main" class="skip">${esc(T("nav.skip"))}</a>
  <div class="seam-rail" data-seam aria-hidden="true"><i></i></div>
`;
}

/* ------------------------------------------------------------------- header */
function header(loc, path, langPath = path) {
  const T = t(loc);
  const nav = [
    ["/work/", T("nav.work")],
    ["/cv/", T("nav.cv")],
    ["/log/", T("nav.writing")],
    ["/about/", T("nav.about")],
  ];
  const isOn = (p) => (path === p || (p !== "/" && path.startsWith(p)) ? ' aria-current="page"' : "");
  return `  <header class="hdr">
    <div class="shell hdr-in">
      <a class="brand" href="${href(loc, "/")}" aria-label="${esc(T("nav.home"))}">tou<span class="caret">&gt;</span></a>
      <nav class="nav" aria-label="${esc(T("nav.primary"))}">
        ${nav.map(([p, label]) => `<a href="${href(loc, p)}"${isOn(p)}>${esc(label)}</a>`).join("\n        ")}
      </nav>
      <div class="hdr-end">
        <nav class="langs" aria-label="${esc(T("nav.language"))}">
          ${LOCALES.map((l) => `<a href="${href(l, langPath)}" lang="${l}" hreflang="${l}"${l === loc ? ' aria-current="true"' : ""} title="${esc(ui[l]["lang.name"])}">${l.toUpperCase()}</a>`).join("\n          ")}
        </nav>
        <button type="button" class="burger" data-burger aria-expanded="false" aria-controls="menu-sheet"
                aria-label="${esc(T("nav.menu"))}" data-open="${esc(T("nav.menu"))}" data-close="${esc(T("nav.close"))}">
          <svg class="i-open" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          <svg class="i-close" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
    <nav id="menu-sheet" class="sheet" aria-label="${esc(T("nav.menu"))}" hidden>
      ${nav.map(([p, label]) => `<a href="${href(loc, p)}">${esc(label)}<span>${ARROW}</span></a>`).join("\n      ")}
      <a href="${href(loc, "/")}#contact">${esc(T("nav.contact"))}<span>${ARROW}</span></a>
    </nav>
  </header>
  <main id="main">
`;
}

/* ------------------------------------------------------------------- footer */
function footer(loc) {
  const T = t(loc);
  const links = [
    [`mailto:${site.email}`, site.email],
    [`tel:${site.tel}`, site.telDisplay],
    [site.telegram, "Telegram"],
    [site.x, "X"],
    [site.instagram, "Instagram"],
    [site.github, "GitHub"],
    [site.huggingface, "Hugging Face"],
  ];
  return `  </main>
  <footer class="foot" id="contact">
    <div class="shell">
      <p class="kicker">${esc(T("home.kicker.contact"))}</p>
      <h2 class="foot-handle">${site.handle}</h2>
      <p class="foot-body">${esc(T("home.contact.body"))}</p>
      <div class="foot-links">
        ${links.map(([u, label]) => `<a href="${u}"${u.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`).join("\n        ")}
      </div>
      <p class="foot-chain">${esc(T("footer.chain"))}</p>
      <div class="foot-base">
        <span>© 2026 ${site.name} · ${esc(L(site.city, loc))} · tou.gg</span>
        <span>
          <a href="/rss.xml">${esc(T("footer.rss"))}</a> ·
          <a href="${site.stats_url}" target="_blank" rel="noopener noreferrer">${esc(T("footer.stats"))}</a> ·
          <a href="${site.repo}" target="_blank" rel="noopener noreferrer">${esc(T("footer.source"))}</a> ·
          ${esc(T("footer.updated"))} ${site.updated}
        </span>
      </div>
    </div>
  </footer>
  <script data-goatcounter="${site.goatcounter}" async src="https://gc.zgo.at/count.js"></script>
  <script src="/js/app.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------- shared parts */
function productRow(p, loc, i) {
  const T = t(loc);
  const external = !p.case;
  const target = p.case ? href(loc, `/work/${p.slug}/`) : p.url;
  return `<a class="row reveal" style="--hue:${p.hue}" href="${target}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
          <span class="row-name"><i class="row-dot"></i>${esc(p.name)}${p.beta ? ` <span class="chip">${esc(T("work.beta"))}</span>` : ""}</span>
          <span class="row-dek">${esc(L(p.dek, loc))}</span>
          <span class="row-meta mono">${esc(p.domain)}</span>
        </a>`;
}

function flagCard(p, loc, i) {
  const T = t(loc);
  const m = p.metric;
  return `<a class="flag reveal d${i}" style="--hue:${p.hue}" href="${href(loc, `/work/${p.slug}/`)}">
          <span class="flag-idx mono">0${i + 1}</span>
          <span class="flag-head">
            <span class="flag-name">${esc(p.name)}</span>
            <span class="flag-toyou mono">→ ${esc(T("home.toyou"))}</span>
          </span>
          <span class="flag-dek">${esc(L(p.dek, loc))}</span>
          <span class="flag-metric num">${esc(m.n)}<small>${esc(L(m.label, loc))}</small></span>
          <span class="flag-foot">
            <span class="flag-dom">${esc(p.domain)}</span>
            ${(p.stack || []).slice(0, 3).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}
          </span>
        </a>`;
}

/* -------------------------------------------------------------------- pages */
function pageHome(loc) {
  const T = t(loc);
  const flagship = products.filter((p) => p.flagship);
  const rest = products.filter((p) => !p.flagship);
  const localPosts = posts.map((p) => ({ ...p, url: href(loc, `/log/${p.slug}/`), local: true }));
  const writing = [...localPosts, ...outbound.slice(0, 1).map((o) => ({ ...o, local: false }))];

  const ld = [
    { "@type": "WebSite", "@id": abs("/#site"), name: "tou.gg", url: abs(href(loc, "/")), inLanguage: loc,
      description: L({ en: ui.en["home.description"], uz: ui.uz["home.description"], ru: ui.ru["home.description"] }, loc),
      publisher: { "@id": abs("/#person") } },
    { "@type": "Person", "@id": abs("/#person"), name: site.name, url: site.origin,
      email: `mailto:${site.email}`, telephone: site.tel,
      jobTitle: L(site.role, loc),
      address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
      knowsLanguage: ["uz", "en", "ko", "ru"],
      sameAs: [site.github, site.telegram, site.x, site.instagram, site.huggingface, site.lab] },
    { "@type": "ItemList", "@id": abs("/#products"), name: "Live sites",
      itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: p.url })) },
    { "@type": "Blog", "@id": abs("/log/#blog"), name: "tou.gg writing", url: abs(href(loc, "/log/")), author: { "@id": abs("/#person") } },
  ];

  return head({ loc, path: "/", title: T("home.title"), description: T("home.description"), jsonld: ld })
    + header(loc, "/")
    + `<section class="shell hero">
      <p class="avail"><i class="dot"></i>${esc(T("home.available"))}</p>
      <p class="hero-who mono"><b>${site.name}</b> · ${esc(L(site.role, loc))} · ${esc(L(site.city, loc))}</p>
      <h1 class="wordmark" data-wordmark><span class="tou"><span class="ch">t</span><span class="ch">o</span><span class="ch">u</span></span><span class="gg">.gg</span><span class="caret" aria-hidden="true"></span></h1>
      <div class="hero-side">
        <p class="hero-dek">${esc(T("home.dek"))}</p>
        <p class="hero-tag mono">${esc(T("home.tagline"))}</p>
        <div class="cta-row">
          <a class="btn btn-primary" href="${href(loc, "/cv/")}">${esc(T("home.cta.cv"))}${ARROW}</a>
          <a class="btn" href="${href(loc, "/work/")}">${esc(T("home.cta.work"))}</a>
        </div>
      </div>
    </section>

    <section class="shell">
      <div class="stats">
        ${stats.map((s) => `<div class="stat"><b class="num" data-count="${s.n}"${s.plus ? ' data-suffix="+"' : ""}>${s.n.toLocaleString(loc)}${s.plus ? "+" : ""}</b><span>${esc(L(s.label, loc))}</span></div>`).join("\n        ")}
      </div>
    </section>

    <section class="shell band" id="flagship">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.flagship"))}</p>
        <div class="flags">
          ${flagship.map((p, i) => flagCard(p, loc, i)).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="shell band" id="work">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.more"))}</p>
        <div>
          <div class="rows">
          ${rest.map((p, i) => productRow(p, loc, i)).join("\n          ")}
          </div>
          <a class="more-link" href="${href(loc, "/work/")}">${esc(T("home.more"))}${ARROW}</a>
        </div>
      </div>
    </section>

    <section class="shell band" id="method">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.method"))}</p>
        <div class="reveal">
          <h2 style="font-size:clamp(1.5rem,3.6vw,2.25rem)">${esc(T("home.method.title"))}</h2>
          <p class="measure" style="margin-top:1rem;color:var(--ink-muted)">${esc(T("home.method.body"))}</p>
          <ol class="steps">
            ${method.map((s) => `<li class="step"><span class="mono">${s.n}</span><b>${esc(L(s.label, loc))}</b></li>`).join("\n            ")}
          </ol>
        </div>
      </div>
    </section>

    <section class="shell band" id="open">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.open"))}</p>
        <div class="os reveal">
          <a class="os-card" href="${site.huggingface}" target="_blank" rel="noopener noreferrer">
            <h3>Maqsudjonpolatov</h3>
            <p>${esc(T("home.open.dek"))}</p>
            <p class="mono" style="margin-top:.9rem;color:var(--ink-faint);font-size:.75rem">huggingface.co ${EXT}</p>
          </a>
          <div class="os-links">
            <b>${esc(T("home.open.bots"))}</b>
            <a href="https://t.me/chertmabot" target="_blank" rel="noopener noreferrer">@Chertmabot</a>
            <a href="https://t.me/chzquzbot" target="_blank" rel="noopener noreferrer">@Chzquzbot</a>
            <a href="${site.dataset}" target="_blank" rel="noopener noreferrer">uz-lexicon-skeleton</a>
          </div>
        </div>
      </div>
    </section>

    <section class="shell band" id="languages">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.languages"))}</p>
        <div>
          <h2 style="font-size:clamp(1.5rem,3.6vw,2.25rem)">${esc(T("home.languages.title"))}</h2>
          <div class="rows" style="margin-top:1.5rem">
            ${languages.map((l) => `<article class="lang-row reveal" style="--hue:${l.hue}">
              <header class="lang-id">
                <p class="lang-native" lang="${l.native === "한국어" ? "ko" : l.native === "中文" ? "zh" : l.native === "Русский" ? "ru" : l.native === "English" ? "en" : "uz"}">${esc(l.native)}</p>
                <p class="lang-latin">${esc(L(l.latin, loc))} <span class="lang-cefr">${l.cefr}</span></p>
              </header>
              <div>
                <span class="track" style="--fill:${l.fill / 100}"><i></i></span>
                <p class="lang-story">${esc(L(l.story, loc))}</p>
                <p class="lang-sample" lang="${l.native === "한국어" ? "ko" : l.native === "中文" ? "zh" : l.native === "Русский" ? "ru" : l.native === "English" ? "en" : "uz"}"><span>${esc(T("home.sample"))}</span>${esc(l.sample)}</p>
              </div>
              <p class="lang-badge${l.live ? " is-live" : ""}"${l.live ? ` data-since="2026-09-19"` : ""}>${l.live ? `<i class="pulse"></i>${esc(L(l.badge, loc))} <span data-n>1</span>` : esc(L(l.badge, loc))}</p>
            </article>`).join("\n            ")}
          </div>
        </div>
      </div>
    </section>

    <section class="shell band" id="cv">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.cv"))}</p>
        <div>
          <div class="rows">
            ${cv.jobs.concat(cv.education.slice(0, 2).map((e) => ({ role: e.title, org: e.org, period: e.period })))
              .map((j) => `<div class="row"><span class="row-name">${esc(L(j.role, loc))}</span><span class="row-dek">${esc(L(j.org, loc))}</span><span class="row-meta mono">${esc(L(j.period, loc))}</span></div>`).join("\n            ")}
          </div>
          <a class="more-link" href="${href(loc, "/cv/")}">${esc(T("home.cv.more"))}${ARROW}</a>
        </div>
      </div>
    </section>

    <section class="shell band" id="writing">
      <div class="band-grid">
        <p class="kicker">${esc(T("home.kicker.writing"))}</p>
        <div>
          <div class="rows">
            ${writing.map((p) => `<a class="row" href="${p.url}"${p.local ? "" : ' target="_blank" rel="noopener noreferrer"'}>
              <span class="row-name">${esc(L(p.title, loc))}</span>
              <span class="row-dek">${esc(p.local ? L(p.dek, loc) : "maqsudjon.com")}</span>
              <span class="row-meta mono">${p.date}</span>
            </a>`).join("\n            ")}
          </div>
          <a class="more-link" href="${href(loc, "/log/")}">${esc(T("home.writing.more"))}${ARROW}</a>
        </div>
      </div>
    </section>
`
    + footer(loc);
}

function pageWork(loc) {
  const T = t(loc);
  const groups = [...new Set(products.map((p) => p.tag))];
  const ld = [{
    "@type": "CollectionPage", name: T("work.h1"), url: abs(href(loc, "/work/")), inLanguage: loc,
    isPartOf: { "@id": abs("/#site") },
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "tou.gg", item: abs(href(loc, "/")) },
      { "@type": "ListItem", position: 2, name: T("work.h1"), item: abs(href(loc, "/work/")) },
    ] },
  }];
  return head({ loc, path: "/work/", title: T("work.title"), description: T("work.description"), jsonld: ld })
    + header(loc, "/work/")
    + `<section class="shell page-head">
      <p class="kicker">${esc(T("nav.work"))}</p>
      <h1 class="page-h1">${esc(T("work.h1"))}</h1>
      <p class="page-dek">${esc(T("work.dek"))}</p>
    </section>
    <section class="shell band">
      ${groups.map((g) => `<div class="band-grid" style="margin-bottom:2.5rem">
        <p class="kicker kicker-plain">${esc(L(tags[g], loc))}</p>
        <div class="rows">
          ${products.filter((p) => p.tag === g).map((p, i) => productRow(p, loc, i)).join("\n          ")}
        </div>
      </div>`).join("\n      ")}
    </section>
`
    + footer(loc);
}

function pageCase(p, loc) {
  const T = t(loc);
  const path = `/work/${p.slug}/`;
  const others = products.filter((x) => x.case && x.slug !== p.slug);
  const ld = [{
    "@type": "CreativeWork", name: p.name, url: abs(href(loc, path)), inLanguage: loc,
    author: { "@id": abs("/#person") }, about: L(p.dek, loc), sameAs: [p.url],
    breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "tou.gg", item: abs(href(loc, "/")) },
      { "@type": "ListItem", position: 2, name: T("work.h1"), item: abs(href(loc, "/work/")) },
      { "@type": "ListItem", position: 3, name: p.name, item: abs(href(loc, path)) },
    ] },
  }];
  const cell = (key, body) => `<div class="case-cell"><h2>${esc(T(key))}</h2><p>${esc(body)}</p></div>`;
  return head({ loc, path, title: `${p.name} — tou.gg`, description: L(p.dek, loc), jsonld: ld })
    + header(loc, "/work/")
    + `<section class="shell page-head" style="--hue:${p.hue}">
      <p class="kicker">${esc(L(tags[p.tag], loc))}</p>
      <h1 class="page-h1">${esc(p.name)}</h1>
      <p class="page-dek">${esc(L(p.dek, loc))}</p>
      ${p.metric ? `<p class="case-metric"><b class="num">${esc(p.metric.n)}</b><span>${esc(L(p.metric.label, loc))}</span></p>` : ""}
      <div class="case-links">
        <a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(T("work.open"))}${EXT}</a>
        ${(p.links || []).map((l) => `<a class="btn" href="${l.url}" target="_blank" rel="noopener noreferrer">${esc(l.label)}${EXT}</a>`).join("\n        ")}
      </div>
    </section>
    <section class="shell band">
      <div class="case-grid reveal">
        ${cell("case.problem", L(p.story.problem, loc))}
        ${cell("case.constraint", L(p.story.constraint, loc))}
        ${cell("case.shipped", L(p.story.shipped, loc))}
        ${cell("case.hard", L(p.story.hard, loc))}
      </div>
      <div class="stack-chips">${(p.stack || []).map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
    </section>
    <section class="shell band">
      <div class="band-grid">
        <p class="kicker">${esc(T("work.more"))}</p>
        <div>
          <div class="rows">
            ${others.map((o, i) => productRow(o, loc, i)).join("\n            ")}
          </div>
          <a class="more-link" href="${href(loc, "/work/")}">${esc(T("case.back"))}${ARROW}</a>
        </div>
      </div>
    </section>
`
    + footer(loc);
}

function pageCv(loc) {
  const T = t(loc);
  const ld = [{
    "@type": "ProfilePage", url: abs(href(loc, "/cv/")), inLanguage: loc,
    mainEntity: { "@id": abs("/#person") },
  }];
  return head({ loc, path: "/cv/", title: T("cv.title"), description: T("cv.description"), jsonld: ld })
    + header(loc, "/cv/")
    + `<article class="shell band" style="padding-top:clamp(2.5rem,6vw,4rem)">
      <header class="cv-top">
        <div>
          <p class="kicker">CV</p>
          <h1 class="cv-name" style="margin-top:.9rem">${site.name}</h1>
          <p class="cv-meta">${esc(L(site.role, loc))} · ${esc(L(site.city, loc))}, ${loc === "ru" ? "Узбекистан" : loc === "uz" ? "O‘zbekiston" : "Uzbekistan"}<br/>
            <a href="mailto:${site.email}">${site.email}</a> · <a href="tel:${site.tel}">${site.telDisplay}</a><br/>
            tou.gg · <a href="${site.github}" target="_blank" rel="noopener noreferrer">github.com/maqsudjon-cell</a></p>
          <p class="cv-avail">${esc(T("cv.available"))}</p>
        </div>
        <button type="button" class="btn cv-print" onclick="window.print()">${esc(T("cv.print"))}</button>
      </header>

      <section class="cv-sec"><h2>${esc(T("cv.summary"))}</h2>
        <p class="measure" style="margin-top:1rem;color:var(--ink-muted)">${esc(L(cv.summary, loc))}</p>
      </section>

      <section class="cv-sec"><h2>${esc(T("cv.experience"))}</h2>
        ${cv.jobs.map((j) => `<div class="cv-item">
          <div class="cv-item-h"><div><b>${esc(L(j.role, loc))}</b><em>${esc(L(j.org, loc))}</em></div><time>${esc(L(j.period, loc))}</time></div>
          <ul class="cv-points">${L(j.points, loc).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>`).join("\n        ")}
      </section>

      <section class="cv-sec"><h2>${esc(T("cv.selected"))}</h2>
        ${products.filter((p) => p.flagship || p.case).map((p) => `<div class="cv-item">
          <div class="cv-item-h"><div><b>${esc(p.name)}</b><em>${esc(L(p.dek, loc))}</em></div><a href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(p.domain)}</a></div>
        </div>`).join("\n        ")}
      </section>

      <section class="cv-sec"><h2>${esc(T("cv.education"))}</h2>
        ${cv.education.map((e) => `<div class="cv-item">
          <div class="cv-item-h"><div><b>${esc(L(e.title, loc))}</b><em>${esc(L(e.org, loc))}</em></div>${L(e.period, loc) ? `<time>${esc(L(e.period, loc))}</time>` : ""}</div>
        </div>`).join("\n        ")}
      </section>

      <section class="cv-sec"><h2>${esc(T("cv.languages"))}</h2>
        <div class="cv-langs">
          ${languages.map((l) => `<p><b>${esc(L(l.latin, loc))} · ${l.cefr}</b><span>${esc(L(l.badge, loc))} — ${esc(L(l.story, loc))}</span></p>`).join("\n          ")}
        </div>
      </section>

      <section class="cv-sec"><h2>${esc(T("cv.stack"))}</h2>
        <div class="stack-chips">${cv.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      </section>
    </article>
`
    + footer(loc);
}

function pageLog(loc) {
  const T = t(loc);
  const ld = [{ "@type": "Blog", url: abs(href(loc, "/log/")), inLanguage: loc, name: T("log.title"), author: { "@id": abs("/#person") } }];
  return head({ loc, path: "/log/", title: T("log.title"), description: T("log.description"), jsonld: ld })
    + header(loc, "/log/")
    + `<section class="shell page-head">
      <p class="kicker">${esc(T("nav.writing"))}</p>
      <h1 class="page-h1">${esc(T("log.h1"))}</h1>
      <p class="page-dek">${esc(T("log.dek"))}</p>
    </section>
    <section class="shell band">
      <div class="rows">
        ${posts.map((p) => `<a class="row" href="${href(loc, `/log/${p.slug}/`)}">
          <span class="row-name">${esc(L(p.title, loc))}</span>
          <span class="row-dek">${esc(L(p.dek, loc))}</span>
          <span class="row-meta mono">${p.date} · ${esc(T("log.local"))}</span>
        </a>`).join("\n        ")}
      </div>
      <div class="band-grid" style="margin-top:3rem">
        <p class="kicker kicker-plain">${esc(T("log.archive"))}</p>
        <div class="rows">
          ${outbound.map((o) => `<a class="row" href="${o.url}" target="_blank" rel="noopener noreferrer">
            <span class="row-name">${esc(o.title)}</span>
            <span class="row-dek">maqsudjon.com</span>
            <span class="row-meta mono">${o.date}</span>
          </a>`).join("\n          ")}
        </div>
      </div>
    </section>
`
    + footer(loc);
}

function pagePost(p, loc) {
  const T = t(loc);
  const path = `/log/${p.slug}/`;
  const ld = [{
    "@type": "BlogPosting", headline: L(p.title, loc), description: L(p.dek, loc),
    url: abs(href(loc, path)), inLanguage: loc, datePublished: p.date, dateModified: p.date,
    author: { "@id": abs("/#person") }, publisher: { "@id": abs("/#person") },
    mainEntityOfPage: abs(href(loc, path)),
  }];
  return head({ loc, path, title: `${L(p.title, loc)} — tou.gg`, description: L(p.dek, loc), type: "article", article: p.date, jsonld: ld })
    + header(loc, "/log/")
    + `<article class="shell band" style="padding-top:clamp(2.5rem,6vw,4rem)">
      <p class="kicker">${esc(T("nav.writing"))} / <time datetime="${p.date}">${p.date}</time></p>
      <h1 class="page-h1">${esc(L(p.title, loc))}</h1>
      <p class="page-dek">${esc(L(p.dek, loc))}</p>
      <div class="prose" style="margin-top:2.5rem">
        ${L(p.body, loc).map((x) => `<p>${esc(x)}</p>`).join("\n        ")}
      </div>
      <a class="more-link" href="${href(loc, "/log/")}">${esc(T("log.back"))}${ARROW}</a>
    </article>
`
    + footer(loc);
}

function pageAbout(loc) {
  const T = t(loc);
  return head({ loc, path: "/about/", title: T("about.title"), description: T("about.description") })
    + header(loc, "/about/")
    + `<section class="shell page-head">
      <p class="kicker">${esc(T("nav.about"))}</p>
      <h1 class="page-h1">${esc(T("about.h1"))}</h1>
    </section>
    <section class="shell band">
      <div class="band-grid">
        <p class="kicker kicker-plain">${esc(L(site.city, loc))}</p>
        <div class="prose">
          ${prose.about[loc].map((x) => `<p>${esc(x)}</p>`).join("\n          ")}
        </div>
      </div>
      <div class="band-grid" style="margin-top:3rem">
        <p class="kicker kicker-plain">${esc(T("about.stack"))}</p>
        <div class="stack-chips" style="margin-top:0">${cv.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
      </div>
    </section>
`
    + footer(loc);
}

function pageNow(loc) {
  const T = t(loc);
  return head({ loc, path: "/now/", title: T("now.title"), description: T("now.description") })
    + header(loc, "/now/")
    + `<section class="shell page-head">
      <p class="kicker">NOW · ${site.updated}</p>
      <h1 class="page-h1">${esc(T("now.h1"))}</h1>
      <p class="page-dek">${esc(T("now.dek"))}</p>
    </section>
    <section class="shell band">
      <div class="band-grid">
        <p class="kicker kicker-plain">${esc(T("footer.updated"))} ${site.updated}</p>
        <div class="prose">
          ${prose.now[loc].map((x) => `<p>${esc(x)}</p>`).join("\n          ")}
          <p><a href="${href(loc, "/log/why-tou/")}">${esc(L(posts[0].title, loc))} →</a></p>
        </div>
      </div>
    </section>
`
    + footer(loc);
}

function pageColophon(loc) {
  const T = t(loc);
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code>$1</code>");
  return head({ loc, path: "/colophon/", title: T("colophon.title"), description: T("colophon.description") })
    + header(loc, "/colophon/")
    + `<section class="shell page-head">
      <p class="kicker">Colophon</p>
      <h1 class="page-h1">${esc(T("colophon.h1"))}</h1>
    </section>
    <section class="shell band">
      <div class="band-grid">
        <p class="kicker kicker-plain">tou.gg</p>
        <div class="prose">
          ${prose.colophon[loc].map((x) => `<p>${md(x)}</p>`).join("\n          ")}
          <p><a href="${site.repo}" target="_blank" rel="noopener noreferrer">${site.repo.replace("https://", "")}</a></p>
        </div>
      </div>
    </section>
`
    + footer(loc);
}

function page404() {
  const loc = DEFAULT_LOCALE;
  const T = t(loc);
  return head({ loc, path: "/404", title: T("404.title"), description: T("404.dek"), noindex: true })
    + header(loc, "/404", "/")
    + `<section class="shell page-head" style="min-height:52vh">
      <p class="kicker">404</p>
      <h1 class="page-h1">${esc(T("404.h1"))}</h1>
      <p class="page-dek">${esc(T("404.dek"))}</p>
      <div class="cta-row"><a class="btn btn-primary" href="/">${esc(T("404.cta"))}${ARROW}</a><a class="btn" href="/work/">${esc(T("nav.work"))}</a></div>
    </section>
`
    + footer(loc);
}

/* ------------------------------------------------------------------ feeds  */
function rss() {
  const items = [
    ...posts.map((p) => ({ title: L(p.title, DEFAULT_LOCALE), link: abs(`/log/${p.slug}/`), date: p.date, desc: L(p.dek, DEFAULT_LOCALE) })),
    ...outbound.map((o) => ({ title: o.title, link: o.url, date: o.date, desc: "maqsudjon.com" })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));
  const rfc = (d) => new Date(d + "T09:00:00Z").toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>tou.gg — writing</title>
    <link>${abs("/log/")}</link>
    <description>Notes on shipping solo: products, Uzbek language tooling, and the workshop.</description>
    <language>en</language>
    <lastBuildDate>${rfc(site.updated)}</lastBuildDate>
    <atom:link href="${abs("/rss.xml")}" rel="self" type="application/rss+xml"/>
${items.map((i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${i.link}</link>
      <guid isPermaLink="true">${i.link}</guid>
      <pubDate>${rfc(i.date)}</pubDate>
      <description>${esc(i.desc)}</description>
    </item>`).join("\n")}
  </channel>
</rss>
`;
}

function sitemap() {
  const rs = routes();
  const urls = [];
  for (const r of rs) {
    for (const loc of LOCALES) {
      const links = LOCALES.map((l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="${abs(href(l, r.path))}"/>`).join("\n");
      urls.push(`  <url>
    <loc>${abs(href(loc, r.path))}</loc>
${links}
      <xhtml:link rel="alternate" hreflang="x-default" href="${abs(href(DEFAULT_LOCALE, r.path))}"/>
    <lastmod>${site.updated}</lastmod>
  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

function robots() {
  return `User-agent: *
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`;
}

function humans() {
  return `/* THE PERSON */
Name: ${site.name}
Role: Product engineer / metal fabricator
Site: ${site.origin}
Location: Tashkent, Uzbekistan
Contact: ${site.email}
Telegram: ${site.telegram}

/* THE SITE */
Last update: ${site.updated}
Languages: EN / UZ / RU — three URL trees, hreflang, no client-side swap
Doctype: HTML5
Standards: RSS 2.0, JSON-LD, sitemap with alternates
Analytics: GoatCounter — no cookies, no Google
Built with: hand-written HTML, CSS and JS, generated by build.mjs (Node, zero dependencies)
Hosting: GitHub Pages. DNS: Cloudflare.
Type: Space Grotesk, Inter, JetBrains Mono — self-hosted woff2
Source: ${site.repo}
`;
}

function llms() {
  return `# tou.gg

> Public brand home of ${site.name}. TOU = "to you". An umbrella, not a product name.

- Site: ${site.origin}
- Languages: English (/), Uzbek (/uz/), Russian (/ru/)
- RSS: ${abs("/rss.xml")}
- Stats: ${site.stats_url}
- Person: ${site.name}, Tashkent, Uzbekistan (UTC+5)
- Method: directs AI coding agents end to end (spec -> architecture -> build -> DNS/TLS -> ops). Welds full time; ships software nights and days off.
- Email: ${site.email}
- Telegram: ${site.telegram}
- GitHub: ${site.github}
- Lab and long-form archive: ${site.lab}
- Source of this site: ${site.repo}

## Verified numbers (${site.updated})

${stats.map((s) => `- ${s.n.toLocaleString("en-US")}${s.plus ? "+" : ""} ${s.label.en}`).join("\n")}

## Live sites

${products.map((p) => `- ${p.name} ${p.url} — ${p.dek.en}`).join("\n")}

## Pages

- / home
- /work/ work index, plus a case study per flagship product
- /cv/ curriculum vitae, print-ready
- /log/ writing index; long-form archive lives on maqsudjon.com
- /about/ bio, method, stack, availability
- /now/ what is being built this month
- /colophon/ type, colour, motion, build
`;
}

function webmanifest() {
  return JSON.stringify({
    name: "tou.gg",
    short_name: "tou",
    description: "from me — to you. Maqsudjon Polatov.",
    start_url: "/",
    display: "standalone",
    background_color: "#080B14",
    theme_color: "#080B14",
    lang: "en",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }, null, 2) + "\n";
}

/* --------------------------------------------------------------------- run  */
function emit(path, body) {
  written.push(path);
  if (CHECK_ONLY) return;
  const file = join(ROOT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
}

// Translation parity is a build error, not a warning.
const baseKeys = Object.keys(ui[DEFAULT_LOCALE]);
for (const loc of LOCALES) {
  for (const k of baseKeys) if (!(k in ui[loc])) problems.push(`ui.${loc} is missing "${k}"`);
  for (const k of Object.keys(ui[loc])) if (!baseKeys.includes(k)) problems.push(`ui.${loc} has stray key "${k}"`);
  for (const block of ["about", "now", "colophon"]) {
    if (!prose[block][loc]) problems.push(`prose.${block} is missing ${loc}`);
  }
}
for (const p of products) {
  for (const loc of LOCALES) if (!p.dek[loc]) problems.push(`product ${p.slug} has no ${loc} description`);
  if (p.case) for (const k of ["problem", "constraint", "shipped", "hard"]) {
    for (const loc of LOCALES) if (!p.story?.[k]?.[loc]) problems.push(`case ${p.slug}.${k} has no ${loc} text`);
  }
}

for (const loc of LOCALES) {
  const at = (p) => (loc === DEFAULT_LOCALE ? p : `${loc}${p}`);
  emit(join(at(""), "index.html"), pageHome(loc));
  emit(join(at(""), "work/index.html"), pageWork(loc));
  for (const p of products.filter((x) => x.case)) emit(join(at(""), `work/${p.slug}/index.html`), pageCase(p, loc));
  emit(join(at(""), "cv/index.html"), pageCv(loc));
  emit(join(at(""), "log/index.html"), pageLog(loc));
  for (const p of posts) emit(join(at(""), `log/${p.slug}/index.html`), pagePost(p, loc));
  emit(join(at(""), "about/index.html"), pageAbout(loc));
  emit(join(at(""), "now/index.html"), pageNow(loc));
  emit(join(at(""), "colophon/index.html"), pageColophon(loc));
}

emit("404.html", page404());
emit("sitemap.xml", sitemap());
emit("robots.txt", robots());
emit("rss.xml", rss());
emit("humans.txt", humans());
emit("llms.txt", llms());
emit("site.webmanifest", webmanifest());
emit("CNAME", "tou.gg\n");
emit(".nojekyll", "");

if (problems.length) {
  console.error("\nBuild problems:");
  for (const p of [...new Set(problems)]) console.error("  ✗ " + p);
  process.exit(1);
}
console.log(`${CHECK_ONLY ? "checked" : "wrote"} ${written.length} files · ${LOCALES.join(" / ")}`);
