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
11. **Two repositories claim the same domain.** `tou.gg` is served by
    `maqsudjon-cell/pangea8-nothing` — a June "pangea8 landing" test repo that
    was reused — while `maqsudjon-cell/tou` holds the identical history and
    serves nothing. Pushing to `tou` did not update the live site, which is why
    the first deploy of this rebuild appeared to do nothing. Both are now in
    sync; consolidating them is HANDOFF step 0 and is your call, because it
    means retiring a repository.
12. `README.md` referenced `scripts/export-static.mjs`, which does not exist,
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

## The redesign, and the rollback

The first pass of this rebuild replaced the visual language as well as the
broken parts: a proportional display face (Space Grotesk), bordered cards for
the flagship work, background glows, a two-column hero, a left rail of sticky
section labels. Maqsudjon looked at it and said no. Reverted the same day.

What went back: monospace at every display size, flat hairline rows with no
surfaces, the single-column hero, kickers above their sections, the small mono
stat strip, the weld seam down the left edge, and the plain UZ / RU / EN text
switch instead of a segmented pill.

What did **not** go back, because it was a defect rather than a choice:

- the header now takes a backdrop when it sticks, instead of printing the nav
  over body text;
- the hero reads before JavaScript runs, and the mobile hero has no 600px hole;
- `--faint` is `#79839a` instead of `#6e7681`, which failed AA at the 11px
  sizes it is used at — two steps lighter, indistinguishable at a glance;
- the reveal observer still catches elements a fast scroll jumped over.

A second pass put the signature motion back too, which the layout revert had
quietly dropped: the weld seam drawing down the left edge as you scroll (now at
every width, sitting in the page gutter instead of being hidden below 1180px),
the name and role climbing out from behind their own edge, the domain landing
from the right, product names rolling up as a row arrives, the stat strip
staggering, the rule sweeping across the method table, the chain ticking in one
arrow at a time, and Chertma correcting its own spelling — `to'g'ri o'zbekcha`
becomes `to‘g‘ri o‘zbekcha` in front of you, which is the product demonstrating
itself instead of a number.

None of it gates text: the hero copy fades up from CSS on paint, not from a
JavaScript callback, and `prefers-reduced-motion` still turns all of it into
instant states.

The lesson worth keeping: **the monospace display type was never a bug.** It
looked like one — `--font-display` listed Space Grotesk with no `@font-face`
behind it, so every heading silently fell through to JetBrains Mono. Fixing the
"bug" removed the thing that made the site look like itself. The font stack now
says mono on purpose, with a comment, so nobody helpfully repairs it again.

## The CV had no file to download

The CV lived only as a web page with a "Print / PDF" button that opened the
browser's print dialog. A recruiter does not want a print dialog; they want a
file they can attach to an email. There is now a real PDF at
`/Maqsudjon-Polatov-CV.pdf` (plus `-uz` and `-ru`), linked from the hero, the
CV page and the footer, and it is **not** a second copy of the CV: it is the
`/cv/` page printed by headless Chrome through the site's own print stylesheet,
so the two cannot drift.

Two things worth knowing about that stylesheet:

- Headless Chrome sizes the PDF page from `@page { size }` but lays the content
  out at its own default Letter width, so declaring A4 clipped the right-hand
  dates by the 6mm difference. The side margins absorb it; the file is A4.
- The CV now carries every live site grouped by kind, the open-source dataset
  and bots, all five languages with their evidence, the stack and the contact
  block — two A4 pages.

## The wordmark says what the name means

tou.gg is an abbreviation with a sentence behind it, and the sentence was
nowhere on the page. The mark now plays it once a session: **t**o y**ou**,
**g**iven **g**ladly types out, the five letters that survive are lit from the
first frame, everything else falls away, and the survivors fly into place as
the mark — the dot lands last, because it is the only character the sentence
never had. Click, tap or any key ends it. The HTML still says `tou.gg`.

## The phone was an afterthought, and one animation was broken

Maqsudjon sent two screenshots: the hero on a phone, and the whole page zoomed
out. Both were right.

- **A giant orange smear down the page.** The lit bead that rides the weld seam
  was a `<circle>` inside an SVG with `preserveAspectRatio="none"`, stretched
  from a 48-unit viewBox into a 14px-wide element over the full viewport
  height. Non-uniform scaling does not preserve circles: it became an enormous
  cone. The bead is now its own DOM element positioned by percentage, so it
  cannot be distorted by the rail it rides.
- **The desktop rhythm on a 375px screen.** The wordmark was 43px, the stat
  numbers 15px, the buttons full-width boxes with the label in the top-left
  corner and the icon in the far right — which reads as an empty box, not a
  button. The wordmark is now 17vw, the numbers scale with the viewport, the
  labels are centred, and every block lost about a third of its vertical
  padding.
- **Sections blank in a full-page screenshot.** Scroll reveals fire on an
  IntersectionObserver, and a phone's full-page capture never scrolls, so
  everything below the fold stayed at `opacity: 0`. Same for a printed page or
  a throttled background tab. There is now a 4-second fallback that reveals
  everything regardless, and the observer reaches 15% past the fold.
- The third hero button was demoted to a text link: two CV buttons and a third
  box was a stack of three identical rectangles with nothing to choose between.

## A fourth language

Chinese (`/zh/`) ships alongside English, Uzbek and Russian — four URL trees,
four `hreflang` entries, four CV PDFs. `<html lang>` and every `hreflang` for it
is `zh-Hans`, not bare `zh`, because the pages are Simplified.

No CJK webfont is shipped. A usable Simplified set is several megabytes, and
every platform already has one (PingFang SC, Microsoft YaHei, Noto Sans SC).
JetBrains Mono and Inter stay first in the stack, so Latin inside a Chinese
page — `tou.gg`, domain names, IELTS — still renders in the brand faces and
only the Han characters fall through. CJK also gets its negative tracking
removed and a looser line, because the Latin settings make it cramped.

Two things Chinese broke that the other three did not: `第 2` needed its 天, so
the live day counter grew a per-locale suffix; and `Tashkent, Uzbekistan`
needed a full-width comma.

**Say this plainly: the Chinese is mine, not Maqsudjon's.** He is on day two of
the language — the site itself says so, in the languages panel. He cannot
proofread it, so if a Chinese speaker finds an error it is still his site's
error. The copy is deliberately plain for that reason: short sentences, no
idiom, nothing clever. Worth a read from a native speaker before it is used to
approach anyone.

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
