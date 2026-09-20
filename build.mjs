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
  const ogLocale = { en: "en_US", uz: "uz_UZ", ru: "ru_RU" };
  const ogAlt = LOCALES.filter((l) => l !== loc)
    .map((l) => `<meta property="og:locale:alternate" content="${ogLocale[l]}"/>`).join("\n  ");

  const ld = jsonld.length
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : { "@context": "https://schema.org", "@graph": jsonld.map(({ "@context": _c, ...rest }) => rest) })}</script>`
    : "";

  return `<!doctype html>
<html lang="${loc}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}"/>
  <meta name="author" content="${site.name}"/>
  <meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1"}"/>
  <meta name="theme-color" content="#0A0E1A"/>
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
  <meta property="og:image" content="${abs(site.ogImage)}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:alt" content="tou.gg — ${esc(site.name)}"/>
  <meta property="og:type" content="${type}"/>
  <meta property="og:site_name" content="tou.gg"/>
  <meta property="og:locale" content="${ogLocale[loc]}"/>
  ${ogAlt}${article ? `\n  <meta property="article:published_time" content="${article}"/>` : ""}
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${esc(title)}"/>
  <meta name="twitter:description" content="${esc(description)}"/>
  <meta name="twitter:image" content="${abs(site.ogImage)}"/>
  <meta name="twitter:creator" content="${site.handle}"/>
  <link rel="preload" href="/fonts/jetbrains-mono-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin/>
  <link rel="stylesheet" href="/css/app.css"/>${ld}
</head>
<body>
  <a href="#main" class="skip">${esc(T("nav.skip"))}</a>
<div class="lp">
  <svg class="lp-draft" viewBox="0 0 48 2400" preserveAspectRatio="none" aria-hidden="true">
    <path id="weld-path" d="M24 8 C 10 120, 38 220, 24 340 S 8 560, 24 720 S 40 980, 24 1160 S 6 1380, 24 1560 S 42 1780, 24 1980 S 12 2200, 24 2388" fill="none" stroke="url(#weld)" stroke-width="1.25" stroke-linecap="round"/>
    <defs><linearGradient id="weld" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff6b35"/><stop offset="100%" stop-color="#00d4ff"/></linearGradient></defs>
  </svg>
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
  return `  <header class="lp-bar">
    <a class="lp-brand" href="${href(loc, "/")}" aria-label="${esc(T("nav.home"))}">tou<span class="tou-gt">&gt;</span></a>
    <nav class="lp-hash" aria-label="${esc(T("nav.primary"))}">
      ${nav.map(([p, label]) => `<a href="${href(loc, p)}"${isOn(p)}>${esc(label)}</a>`).join("\n      ")}
      <a href="${href(loc, "/")}#contact">${esc(T("nav.contact"))}</a>
    </nav>
    <div class="lp-langs" role="group" aria-label="${esc(T("nav.language"))}">
      ${LOCALES.map((l) => `<a class="lp-lang${l === loc ? " is-on" : ""}" href="${href(l, langPath)}" lang="${l}" hreflang="${l}"${l === loc ? ' aria-current="true"' : ""} title="${esc(ui[l]["lang.name"])}">${l.toUpperCase()}</a>`).join("\n      ")}
      <button type="button" class="lp-burger" data-burger aria-expanded="false" aria-controls="menu-sheet"
              aria-label="${esc(T("nav.menu"))}" data-open="${esc(T("nav.menu"))}" data-close="${esc(T("nav.close"))}">
        <svg class="i-open" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <svg class="i-close" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
    <nav id="menu-sheet" class="lp-sheet" aria-label="${esc(T("nav.menu"))}" hidden>
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
    [site.telegram, site.handle],
    [site.x, "x"],
    [site.instagram, "ig"],
    [site.github, "github"],
    [site.huggingface, "hugging face"],
  ];
  return `  </main>
  <footer class="lp-block lp-foot" id="contact">
    <p class="lp-kicker">${esc(T("home.kicker.contact"))}</p>
    <h2 class="lp-handle">${site.handle}</h2>
    <p class="lp-body">${esc(T("home.contact.body"))}</p>
    <div class="lp-contact">
      ${links.map(([u, label]) => `<a href="${u}"${u.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`).join("\n      ")}
    </div>
    <p class="lp-chain">maqsudjon <span>→</span> tou <span>→</span> to you <span>→</span> ${esc(T("home.toyou"))}</p>
    <p class="lp-copy">© 2026 ${site.name} · ${esc(L(site.city, loc))} · tou.gg ·
      <a href="/rss.xml">${esc(T("footer.rss"))}</a> ·
      <a href="${site.repo}" target="_blank" rel="noopener noreferrer">${esc(T("footer.source"))}</a> ·
      ${esc(T("footer.updated"))} ${site.updated}</p>
  </footer>
</div>
  <script data-goatcounter="${site.goatcounter}" async src="https://gc.zgo.at/count.js"></script>
  <script src="/js/app.js" defer></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------- shared parts */
function productRow(p, loc) {
  const T = t(loc);
  const external = !p.case;
  const target = p.case ? href(loc, `/work/${p.slug}/`) : p.url;
  return `<a class="lp-more-row lp-reveal" style="--hue:${p.hue}" href="${target}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="lp-more-name"><i class="lp-dot"></i>${esc(p.name)}${p.beta ? ` <span class="lp-chip">${esc(T("work.beta"))}</span>` : ""}</span>
        <span class="lp-more-dek">${esc(L(p.dek, loc))}</span>
        <span class="lp-more-dom">${esc(p.domain)}</span>
      </a>`;
}

function flagRow(p, loc, i) {
  const T = t(loc);
  const m = p.metric;
  return `<a class="lp-flag lp-reveal" style="--hue:${p.hue}" href="${href(loc, `/work/${p.slug}/`)}">
        <span class="lp-flag-idx">0${i + 1}</span>
        <span class="lp-flag-copy">
          <span class="lp-flag-top"><span class="lp-card-name">${esc(p.name)}</span><span class="lp-toyou">→ ${esc(T("home.toyou"))}</span></span>
          <span class="lp-card-dek">${esc(L(p.dek, loc))}</span>
          <span class="lp-flag-dom">${esc(p.domain)}</span>
        </span>
        <span class="lp-flag-mark" aria-hidden="true">${esc(m.n)}<small>${esc(L(m.label, loc))}</small></span>
      </a>`;
}

/* -------------------------------------------------------------------- pages */
function pageHome(loc) {
  const T = t(loc);
  const flagship = products.filter((p) => p.flagship);
  const rest = products.filter((p) => !p.flagship);
  const writing = [
    ...posts.map((p) => ({ title: L(p.title, loc), dek: L(p.dek, loc), date: p.date, url: href(loc, `/log/${p.slug}/`), tag: T("log.local") })),
    { title: outbound[0].title, dek: "maqsudjon.com", date: outbound[0].date, url: outbound[0].url, tag: "↗", external: true },
  ];

  const ld = [
    { "@type": "WebSite", "@id": abs("/#site"), name: "tou.gg", url: abs(href(loc, "/")), inLanguage: loc,
      description: T("home.description"), publisher: { "@id": abs("/#person") } },
    { "@type": "Person", "@id": abs("/#person"), name: site.name, url: site.origin,
      email: `mailto:${site.email}`, telephone: site.tel, jobTitle: L(site.role, loc),
      address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
      knowsLanguage: ["uz", "en", "ko", "ru"],
      sameAs: [site.github, site.telegram, site.x, site.instagram, site.huggingface, site.lab] },
    { "@type": "ItemList", "@id": abs("/#products"), name: "Live sites",
      itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: p.url })) },
    { "@type": "Blog", "@id": abs("/log/#blog"), name: "tou.gg writing", url: abs(href(loc, "/log/")), author: { "@id": abs("/#person") } },
  ];

  return head({ loc, path: "/", title: T("home.title"), description: T("home.description"), jsonld: ld })
    + header(loc, "/")
    + `<section class="lp-hero" id="top">
      <p class="lp-who">${site.name}</p>
      <p class="lp-role">${esc(L(site.role, loc))} · ${esc(L(site.city, loc))} · ${esc(T("home.remote"))}</p>
      <h1 class="lp-display" data-wordmark><span class="lp-type"><span class="ch">t</span><span class="ch">o</span><span class="ch">u</span></span><span class="lp-gg">.gg</span><span class="lp-caret" aria-hidden="true"></span></h1>
      <p class="lp-dek">${esc(T("home.dek"))}</p>
      <p class="lp-tag">${esc(T("home.tagline"))}</p>
      <div class="lp-cta">
        <a class="lp-cta-btn" href="${href(loc, "/cv/")}">${esc(T("home.cta.cv"))}${ARROW}</a>
        <a href="${href(loc, "/work/")}">${esc(T("home.cta.work"))}</a>
      </div>
    </section>

    <section class="lp-stats" aria-label="${esc(T("home.kicker.flagship"))}">
      ${stats.map((s) => `<div class="lp-stat"><span class="lp-stat-n" data-count="${s.n}"${s.plus ? ' data-suffix="+"' : ""}>${s.n.toLocaleString(loc)}${s.plus ? "+" : ""}</span><span class="lp-stat-l">${esc(L(s.label, loc))}</span></div>`).join("\n      ")}
    </section>

    <section class="lp-block" id="flagship">
      <p class="lp-kicker">${esc(T("home.kicker.flagship"))}</p>
      <div class="lp-flags">
        ${flagship.map((p, i) => flagRow(p, loc, i)).join("\n        ")}
      </div>
    </section>

    <section class="lp-block" id="work">
      <p class="lp-kicker">${esc(T("home.kicker.more"))}</p>
      <div class="lp-more">
        ${rest.map((p) => productRow(p, loc)).join("\n        ")}
      </div>
      <a class="lp-more-link" href="${href(loc, "/work/")}">${esc(T("home.more"))}${ARROW}</a>
    </section>

    <section class="lp-block" id="cv">
      <p class="lp-kicker">${esc(T("home.kicker.cv"))}</p>
      <ul class="lp-cv">
        ${cv.jobs.concat(cv.education.slice(0, 2).map((e) => ({ role: e.title, org: e.org, period: e.period })))
          .map((j) => `<li><time>${esc(L(j.period, loc))}</time><div><b>${esc(L(j.role, loc))}</b><p>${esc(L(j.org, loc))}</p></div></li>`).join("\n        ")}
      </ul>
      <a class="lp-more-link" href="${href(loc, "/cv/")}">${esc(T("home.cv.more"))}${ARROW}</a>
    </section>

    <section class="lp-block" id="writing">
      <p class="lp-kicker">${esc(T("home.kicker.writing"))}</p>
      <div class="lp-write">
        ${writing.map((w) => `<a href="${w.url}"${w.external ? ' target="_blank" rel="noopener noreferrer"' : ""}><time>${w.date}</time><b>${esc(w.title)}</b><span>${esc(w.tag)}</span></a>`).join("\n        ")}
      </div>
      <a class="lp-more-link" href="${href(loc, "/log/")}">${esc(T("home.writing.more"))}${ARROW}</a>
    </section>

    <section class="lp-block" id="open">
      <p class="lp-kicker">${esc(T("home.kicker.open"))}</p>
      <div class="lp-ai">
        <a class="lp-ai-main" href="${site.huggingface}" target="_blank" rel="noopener noreferrer">
          <span class="lp-card-name">Maqsudjonpolatov</span>
          <span class="lp-card-dek">${esc(T("home.open.dek"))}</span>
          <span class="lp-more-dom">huggingface.co</span>
        </a>
        <div class="lp-bots">
          <p class="lp-bots-k">${esc(T("home.open.bots"))}</p>
          <a href="https://t.me/chertmabot" target="_blank" rel="noopener noreferrer">@Chertmabot</a>
          <a href="https://t.me/chzquzbot" target="_blank" rel="noopener noreferrer">@Chzquzbot</a>
          <a href="${site.dataset}" target="_blank" rel="noopener noreferrer">uz-lexicon-skeleton</a>
        </div>
      </div>
    </section>

    <section class="lp-block" id="method">
      <p class="lp-kicker">${esc(T("home.kicker.method"))}</p>
      <h2 class="lp-h2">${esc(T("home.method.title"))}</h2>
      <p class="lp-body">${esc(T("home.method.body"))}</p>
      <ol class="lp-steps">
        ${method.map((s) => `<li><span>${s.n}</span><b>${esc(L(s.label, loc))}</b></li>`).join("\n        ")}
      </ol>
    </section>

    <section class="lp-block" id="languages">
      <p class="lp-kicker">${esc(T("home.kicker.languages"))}</p>
      <h2 class="lp-h2">${esc(T("home.languages.title"))}</h2>
      <div class="lg-list">
        ${languages.map((l) => {
          const tag = l.native === "한국어" ? "ko" : l.native === "中文" ? "zh" : l.native === "Русский" ? "ru" : l.native === "English" ? "en" : "uz";
          return `<article class="lg-row lp-reveal" style="--hue:${l.hue}">
          <header class="lg-id">
            <p class="lg-native" lang="${tag}">${esc(l.native)}</p>
            <p class="lg-latin">${esc(L(l.latin, loc))}</p>
            <span class="lg-cefr">${l.cefr}</span>
          </header>
          <div class="lg-mid">
            <span class="lg-track"><span class="lg-fill" style="--fill:${l.fill}%"></span></span>
            <p class="lg-story">${esc(L(l.story, loc))}</p>
            <p class="lg-sample" lang="${tag}"><span>${esc(T("home.sample"))}</span>${esc(l.sample)}</p>
          </div>
          <p class="lg-badge${l.live ? " is-live" : ""}"${l.live ? ' data-since="2026-09-19"' : ""}>${l.live ? `<i class="lg-pulse"></i>${esc(L(l.badge, loc))} <span data-n>1</span>` : esc(L(l.badge, loc))}</p>
        </article>`;
        }).join("\n        ")}
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
    + `<section class="lp-head">
      <p class="lp-kicker">${esc(T("nav.work"))}</p>
      <h1 class="lp-title">${esc(T("work.h1"))}</h1>
      <p class="lp-lede">${esc(T("work.dek"))}</p>
    </section>
    ${groups.map((g) => `<section class="lp-block" style="padding-block:2rem">
      <p class="lp-kicker lp-kicker-plain">${esc(L(tags[g], loc))}</p>
      <div class="lp-more">
        ${products.filter((p) => p.tag === g).map((p) => productRow(p, loc)).join("\n        ")}
      </div>
    </section>`).join("\n    ")}
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
  const cell = (key, body) => `<div><h2>${esc(T(key))}</h2><p>${esc(body)}</p></div>`;
  return head({ loc, path, title: `${p.name} — tou.gg`, description: L(p.dek, loc), jsonld: ld })
    + header(loc, "/work/")
    + `<section class="lp-head" style="--hue:${p.hue}">
      <p class="lp-kicker">${esc(L(tags[p.tag], loc))}</p>
      <h1 class="lp-title">${esc(p.name)}</h1>
      <p class="lp-lede">${esc(L(p.dek, loc))}</p>
      ${p.metric ? `<p class="lp-metric"><b>${esc(p.metric.n)}</b><span>${esc(L(p.metric.label, loc))}</span></p>` : ""}
      <div class="lp-cta">
        <a class="lp-cta-btn" href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(T("work.open"))}${EXT}</a>
        ${(p.links || []).map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${esc(l.label)}${EXT}</a>`).join("\n        ")}
      </div>
    </section>
    <section class="lp-block">
      <div class="lp-case lp-reveal">
        ${cell("case.problem", L(p.story.problem, loc))}
        ${cell("case.constraint", L(p.story.constraint, loc))}
        ${cell("case.shipped", L(p.story.shipped, loc))}
        ${cell("case.hard", L(p.story.hard, loc))}
      </div>
      <div class="lp-chips">${(p.stack || []).map((s) => `<span class="lp-chip">${esc(s)}</span>`).join("")}</div>
    </section>
    <section class="lp-block">
      <p class="lp-kicker">${esc(T("work.more"))}</p>
      <div class="lp-more">
        ${others.map((o) => productRow(o, loc)).join("\n        ")}
      </div>
      <a class="lp-more-link" href="${href(loc, "/work/")}">${esc(T("case.back"))}${ARROW}</a>
    </section>
`
    + footer(loc);
}

function pageCv(loc) {
  const T = t(loc);
  const country = { en: "Uzbekistan", uz: "O‘zbekiston", ru: "Узбекистан" }[loc];
  const ld = [{ "@type": "ProfilePage", url: abs(href(loc, "/cv/")), inLanguage: loc, mainEntity: { "@id": abs("/#person") } }];
  return head({ loc, path: "/cv/", title: T("cv.title"), description: T("cv.description"), jsonld: ld })
    + header(loc, "/cv/")
    + `<article class="lp-block" style="padding-top:2.5rem">
      <header class="cv-top">
        <div>
          <p class="lp-kicker">CV</p>
          <h1 class="cv-name">${site.name}</h1>
          <p class="cv-meta">${esc(L(site.role, loc))} · ${esc(L(site.city, loc))}, ${country}<br/>
            <a href="mailto:${site.email}">${site.email}</a> · <a href="tel:${site.tel}">${site.telDisplay}</a><br/>
            tou.gg · <a href="${site.github}" target="_blank" rel="noopener noreferrer">github.com/maqsudjon-cell</a></p>
          <p class="cv-avail">${esc(T("cv.available"))}</p>
        </div>
        <button type="button" class="lp-cta-btn cv-print" style="padding:.7rem 1.15rem;border:1px solid var(--line-2);font:400 .8rem/1 var(--font-mono);color:var(--fg)" onclick="window.print()">${esc(T("cv.print"))}</button>
      </header>

      <section class="cv-sec"><h2>${esc(T("cv.summary"))}</h2>
        <p class="lp-body" style="margin-top:1rem">${esc(L(cv.summary, loc))}</p>
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
        <div class="lp-chips">${cv.stack.map((s) => `<span class="lp-chip">${esc(s)}</span>`).join("")}</div>
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
    + `<section class="lp-head">
      <p class="lp-kicker">${esc(T("nav.writing"))}</p>
      <h1 class="lp-title">${esc(T("log.h1"))}</h1>
      <p class="lp-lede">${esc(T("log.dek"))}</p>
    </section>
    <section class="lp-block" style="padding-top:1.5rem">
      <div class="lp-write">
        ${posts.map((p) => `<a href="${href(loc, `/log/${p.slug}/`)}"><time>${p.date}</time><b>${esc(L(p.title, loc))}</b><span>${esc(T("log.local"))}</span></a>`).join("\n        ")}
      </div>
    </section>
    <section class="lp-block" style="padding-top:1rem">
      <p class="lp-kicker lp-kicker-plain">${esc(T("log.archive"))}</p>
      <div class="lp-write">
        ${outbound.map((o) => `<a href="${o.url}" target="_blank" rel="noopener noreferrer"><time>${o.date}</time><b>${esc(o.title)}</b><span>↗</span></a>`).join("\n        ")}
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
    + `<article class="lp-block" style="padding-top:2.5rem">
      <p class="lp-kicker">${esc(T("nav.writing"))} / <time datetime="${p.date}">${p.date}</time></p>
      <h1 class="lp-title">${esc(L(p.title, loc))}</h1>
      <p class="lp-lede">${esc(L(p.dek, loc))}</p>
      <div class="lp-prose" style="margin-top:2.5rem">
        ${L(p.body, loc).map((x) => `<p>${esc(x)}</p>`).join("\n        ")}
      </div>
      <a class="lp-more-link" href="${href(loc, "/log/")}">${esc(T("log.back"))}${ARROW}</a>
    </article>
`
    + footer(loc);
}

function pageAbout(loc) {
  const T = t(loc);
  return head({ loc, path: "/about/", title: T("about.title"), description: T("about.description") })
    + header(loc, "/about/")
    + `<section class="lp-head">
      <p class="lp-kicker">${esc(T("nav.about"))}</p>
      <h1 class="lp-title">${esc(T("about.h1"))}</h1>
    </section>
    <section class="lp-block" style="padding-top:1.5rem">
      <div class="lp-prose">
        ${prose.about[loc].map((x) => `<p>${esc(x)}</p>`).join("\n        ")}
      </div>
    </section>
    <section class="lp-block" style="padding-top:0">
      <p class="lp-kicker lp-kicker-plain">${esc(T("about.stack"))}</p>
      <div class="lp-chips" style="margin-top:0">${cv.stack.map((s) => `<span class="lp-chip">${esc(s)}</span>`).join("")}</div>
    </section>
`
    + footer(loc);
}

function pageNow(loc) {
  const T = t(loc);
  return head({ loc, path: "/now/", title: T("now.title"), description: T("now.description") })
    + header(loc, "/now/")
    + `<section class="lp-head">
      <p class="lp-kicker">NOW · ${site.updated}</p>
      <h1 class="lp-title">${esc(T("now.h1"))}</h1>
      <p class="lp-lede">${esc(T("now.dek"))}</p>
    </section>
    <section class="lp-block" style="padding-top:1.5rem">
      <div class="lp-prose">
        ${prose.now[loc].map((x) => `<p>${esc(x)}</p>`).join("\n        ")}
        <p><a href="${href(loc, "/log/why-tou/")}">${esc(L(posts[0].title, loc))} →</a></p>
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
    + `<section class="lp-head">
      <p class="lp-kicker">Colophon</p>
      <h1 class="lp-title">${esc(T("colophon.h1"))}</h1>
    </section>
    <section class="lp-block" style="padding-top:1.5rem">
      <div class="lp-prose">
        ${prose.colophon[loc].map((x) => `<p>${md(x)}</p>`).join("\n        ")}
        <p><a href="${site.repo}" target="_blank" rel="noopener noreferrer">${site.repo.replace("https://", "")}</a></p>
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
    + `<section class="lp-head" style="min-height:48vh">
      <p class="lp-kicker">404</p>
      <h1 class="lp-title">${esc(T("404.h1"))}</h1>
      <p class="lp-lede">${esc(T("404.dek"))}</p>
      <div class="lp-cta"><a class="lp-cta-btn" href="/">${esc(T("404.cta"))}${ARROW}</a><a href="/work/">${esc(T("nav.work"))}</a></div>
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
