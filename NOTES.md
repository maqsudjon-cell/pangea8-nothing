# NOTES

Audit and rebuild of tou.gg, 2026-09-20. What was broken, what I changed, what
I disagreed with, and how to re-verify every number on the site.

---

## What was actually broken

Found by reading the live site, not the repo.

1. **Analytics collected nothing.** `tou.goatcounter.com` does not exist; the
   tracker returned `400` on every page view, and the footer "stats" link led to
   an error page. Fixed only by step 1 of HANDOFF.md — I cannot create the site.
2. **The UZ / RU buttons did nothing.** No handler was ever bound. The page
   advertised three languages in `humans.txt` and in JSON-LD (`inLanguage`)
   while shipping one. Replaced with three real URL trees.
3. **The fixed header had no background.** Scrolling printed the nav on top of
   body text — badly on desktop, unreadable on mobile.
4. **The mobile hero was a hole.** Roughly 600px of empty space under the
   wordmark, and the value proposition, CTAs and stats were all gated behind a
   JavaScript animation that took ~2.5–3s to finish. With JS blocked, the hero
   was blank. Now the HTML says `tou.gg` and the sentence under it from the
   first paint; the animation is decoration on top and plays once per session.
5. **Two design systems.** The home page used one set of classes, every inner
   page used another, left over from four abandoned redesigns. They looked like
   two different websites. The CSS carried ~45KB with most rules dead.
6. **`http://tou.gg` served 200**, not a redirect — "Enforce HTTPS" is off.
   HANDOFF step 2.
7. **Space Grotesk never loaded.** Two woff2 files shipped with no `@font-face`,
   so `--font-display` silently fell back to JetBrains Mono and the whole site
   rendered monospace. Two IBM Plex files shipped unused; deleted.
8. **The OG image had a tofu box** — `to you □ tou.gg` — because the raster
   script used a font without `→`. That image is what every Telegram and X
   share showed. The new generator checks each character against the font cmap
   and fails the build rather than shipping a box.
9. **Canonicals pointed at redirects**: `https://tou.gg/work` while the served
   URL is `/work/`.
10. **`then.uz` was listed as a live product.** The domain does not resolve at
    all — no NS, no A record. A dead link in a portfolio is expensive. Removed.
11. `README.md` referenced `scripts/export-static.mjs`, which does not exist,
    and described the repo as an export of a React app kept in a third-party
    workspace. That workspace is not in the repo, so the site could not be
    rebuilt from its own source. It can now.

## Numbers — how each one was verified (2026-09-20)

The old site said 15 products / 189 repos / 1,600+ commits / 113 tests.
Three of the four were wrong, and two of them undersold the work.

| Claim | Source | Command |
|---|---|---|
| 15 live sites | every domain in `products` answered 200 | `curl -sI https://<domain>` |
| 191 public repos | GitHub API | `gh api users/maqsudjon-cell --jq .public_repos` |
| 3,000+ commits | 24 (2025) + 3,004 (2026 to 20 Sep) | `gh api graphql` contributionsCollection |
| 144 IELTS tests | live index: 154 rows = 144 tests + 10 tools | `curl -s https://flarestamina.com/ielts-hub/tests.json` |
| 19 months | GitHub account created 2025-02-28 | `gh api users/maqsudjon-cell --jq .created_at` |
| 24 AI Lenta sources | the number ailenta.uz prints on itself | read the live page |
| 4.89M word forms | the dataset card | huggingface.co/datasets/Maqsudjonpolatov/uz-lexicon-skeleton |

**AI Lenta had three different source counts** across the old site: 26 on the
home page, 26 in `llms.txt`, 29 on `/now/`. The live site says 24. I used 24.
A number that has to be edited in four places will be wrong in three of them —
it now lives once, in `src/content.mjs`.

## Objections

- **Counters like "144 tests" and "24 sources" go stale.** They are the most
  persuasive numbers on the page and the easiest to get caught out on. They now
  live in one file with the verification commands above, but if FlareStamina
  crosses 200 tests and the site still says 144, that is worse than saying
  "100+". Re-check them when you touch the site, or drop them to round figures.
- **The phone number and email are in the HTML and in JSON-LD.** That is a
  deliberate trade — a recruiter can call you, and so can a scraper. If the spam
  becomes a problem, drop `telephone` from the JSON-LD first; it is the part
  scrapers read most cheaply. I left it as you had it.
- **The two long notes are English only.** `/uz/log/why-tou/` and
  `/ru/log/...` are translated; the essays themselves are translated too, but
  the outbound archive on maqsudjon.com is not, and the index says so. If you
  later write a note only in Uzbek, put it in `posts` with the other two
  languages left empty and the build will tell you.
- **Russian is my translation, not a native speaker's.** It reads correctly, but
  before you put `/ru/` in front of a Russian-speaking client, have someone read
  it once. Uzbek you can check yourself.
- **Davomat is listed as beta** and points at a `workers.dev` URL. Either give
  it a real domain or consider dropping it from the public list — a
  `*.workers.dev` link in a portfolio reads as unfinished.

## Design decisions

- **Dark only.** A light theme doubles the QA surface for a site whose whole
  identity is ink and weld orange. Tokens are in one block; if you ever want it,
  it is a `@media (prefers-color-scheme: light)` override, not a rewrite.
- **Motion never gates text.** Every reveal starts from `opacity: 0` in CSS
  *and* every element already on screen at load is shown immediately by JS —
  and `prefers-reduced-motion` turns the whole system into instant states.
  The intro types once per session; replaying a 3-second animation on every
  navigation is a tax on the reader.
- **The scroll reveal observer also fires for elements above the viewport.**
  `isIntersecting` alone loses anything a fast scroll or an anchor jump skipped
  over, which is how the old build left whole sections invisible.
- **Contrast.** Every grey in the token block clears WCAG AA on the background
  at the size it is used: `--ink-faint` is 5.4:1, up from the old `#6e7681`
  at ~4.0:1, which failed for the 10px labels it was used on.
- **URL-based i18n, not a client-side switch.** A switch in JavaScript gives
  Google one indexable language. Three trees plus `hreflang` and `x-default`
  give it three, and the switch still looks like a switch.

## Things deliberately not done

- No cookie banner: GoatCounter sets no cookies, so there is nothing to consent
  to. Adding a banner would be worse than useless.
- No service worker. The site is 7 files and a font; a cache layer would add a
  stale-content failure mode for no measurable gain.
- No `/ru/` or `/uz/` auto-redirect by `Accept-Language`. Surprising, bad for
  crawlers, and impossible to do well on static hosting anyway.
