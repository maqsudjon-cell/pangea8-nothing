---
title: maqsudjon.com: the lab, rebuilt until it was fast
seo_title: maqsudjon.com, a one-person lab with a live colour ASCII engine and a build log
slug: maqsudjon-com
section: work
order: 17
date: 2026-10-14
project: maqsudjon.com
url: https://maqsudjon.com
image: maqsudjon.webp
tags: Lab, ASCII, Canvas, PWA
description: My first personal site and still the lab: a live colour ASCII engine fed by F1 footage, a terminal in the header, an installable app, and a build log with more than forty entries.
facts:
  - Live: [maqsudjon.com](https://maqsudjon.com)
  - Online since: May 2026
  - Redesigns in 3 weeks: 3
  - ASCII engine: 6× faster after one pass
  - Build log: 40+ entries
  - Languages: English, Uzbek
---
[maqsudjon.com](https://maqsudjon.com) is where everything started. It calls itself "a one-person lab for acting in code and steel", and it is the place I try things before they go anywhere else. Since [tou.gg](/work/tou-gg/) became the front door, maqsudjon.com stays the lab and the build log.

Several of my tools live on its subdomains: [Chertma](/work/chertma/), [KVADRAT](/work/kvadrat/), [Nullsample](/work/nullsample/), [Payvandchi](/work/payvandchi/) and [Reshotkachi](/work/reshotkachi/).

## Three looks in three weeks

Between mid-June and early July 2026 the site was rebuilt three times, each time to learn a visual language by building it:

1. **16 June:** a monochrome dot-matrix style in the spirit of Nothing: pure black, an LED dot texture, one red accent, mono type, a live Tashkent clock.
2. **29 June:** a frontier-lab look, with a full-screen colour ASCII engine behind the hero that cycles through scenes on its own: flowing fields, a rotating globe, a spinning torus, a sound wave and falling rain, each glyph tinted along a navy-to-coral gradient.
3. **2 July:** a full homage to a lab whose whole visual language is ASCII: my F1 lap footage sampled live into coloured glyphs in the header, a settings panel with real sliders, headings that unscramble from noise, and a music slider that plays a small ambient synth generated in the browser.

## Making it fast

The ASCII engine started to stutter, fairly: every frame was drawing up to thirteen thousand characters one at a time, at double resolution. One performance pass made it about **six times faster**. Glyphs now come from a pre-rendered sprite sheet, so drawing a character is one image copy instead of a text render. The coloured tile layer is painted as one pixelated image instead of thousands of rectangles. Resolution is capped where the chunky look hides it anyway, and pointer effects skip cells far from the cursor.

The part I like most: the engine watches its own frame time. If a device cannot keep up, it quietly makes the grid coarser until it can, and restores full detail when there is headroom.

## Small things that make a site feel lived in

- It installs as an app and opens offline.
- One link switches the main content to Uzbek.
- There is a terminal in the header with commands like `cv`, `cert` and `now`, history and tab completion. Type `snake` and the header becomes a playable ASCII snake.
- A broken link lands on a 404 page where matrix rain falls behind a "signal lost" card.
- The F1 video pauses when the header is off screen and respects data-saver mode.
- There is a proper one-page CV, generated from HTML in the site's own type.

## The build log

The most useful thing on the site is not visual. It is the [build log](https://maqsudjon.com/log/): more than forty dated entries between May and August 2026, one for nearly every ship, including the ones that went wrong. Much of what you read in these notes was first written there.

Visit [maqsudjon.com](https://maqsudjon.com), and try typing `snake`.
