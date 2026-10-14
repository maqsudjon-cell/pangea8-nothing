---
title: Nullsample: music built from arithmetic, with zero samples
seo_title: Nullsample, a procedural music generator with zero samples and seed-exact tracks
slug: nullsample
section: work
order: 8
date: 2026-10-14
project: Nullsample
url: https://nullsample.maqsudjon.com
image: nullsample.webp
tags: Music, Web Audio, Open source, DSP
description: A music generator where every sound is computed from code, the same seed gives the same track on any browser, and the six stems come out separate because they were never mixed.
facts:
  - Live: [nullsample.maqsudjon.com](https://nullsample.maqsudjon.com)
  - Samples used: 0
  - Stems: 6
  - Same seed: same track, byte for byte
  - Source: [GitHub](https://github.com/maqsudjon-cell/nullsample)
  - Licence: AGPL-3.0
---
Before any of the software, I made music. I release UK garage under the name Matsumi; the album *HOME* is on Spotify, and most of its listeners are in the UK, which is where that sound lives. **Nullsample** is what happened when the two halves met.

It is a music generator in the browser. Press once and a track exists. There is no sample anywhere: no one-shots, no loops, no recorded impulse for the reverb, no trained model. Every sound is computed at runtime on your own device from oscillators, noise, envelopes, filters and distortion stages.

## Why zero samples

Most "generative music" is a sample pack with a random seed on top. You cannot hear how it was made, and you cannot make it again. With Nullsample there is nothing in a track that came from anyone else's recording, so the audio you generate is yours to use, including commercially. Nothing to license, nobody to sue you.

The drums are synthesised hit by hit. The 808 is a sine wave bent in sixty milliseconds. Distortion runs in three stages, oversampled four times. The reverb is a feedback delay network with a generated decay. The "vocal" texture is a filtered saw wave with formant peaks, not an imitation of a singer.

## The same seed, the same track, forever

A seed is the only input. Paste one and you get exactly that track, on any machine, in any browser, today or in ten years. That one requirement shaped the whole engine.

JavaScript specifies `+`, `-`, `*` and `/` exactly, but leaves `Math.sin`, `Math.exp`, `Math.pow` and the rest as approximations, and the three big browser engines really do differ in the last bit. One differing bit inside a filter's feedback loop becomes audible within a second.

So the engine calls none of them. It rebuilds those functions from exact arithmetic, polynomial series and a fixed number of Newton steps, accurate to about 1e-15 and identical everywhere. A lint step fails the build if any core file calls the built-in versions, and a test renders the same seeds in Node and in headless Chrome and compares the files byte for byte.

Playback starts after a few bars while the rest is still being computed, and because the master chain streams, **the audio you hear and the file you download are the same bytes**. That is asserted by a test, not assumed.

## Six parts, never merged

Every track comes out as six separate stems because they were never mixed into one file in the first place. That makes it useful beyond listening: a loop and its stems dropped into a game build, original music for film and video with no content claims, beds for a podcast generated on your own machine.

## How it gets good

Code that makes sound is easy. Code that makes sound you want to hear again is the hard part, so there is a quality loop, and it is not optional. Render fifty tracks from a preset, listen, rate each from 1 to 5, then let a script correlate every random parameter with the ratings. It runs a permutation test so it does not chase noise and proposes tighter ranges, but never overwrites them by itself. A preset is finished when fewer than five in a hundred random renders are rated poor.

The code is split so that taste and machinery never mix. The core is generic sound machinery that knows nothing about genre. A preset is data and recipe: pattern banks, arrangements, harmony, and a ranges file. If changing how something sounds requires editing the core, the line between them is in the wrong place.

The source is public on [GitHub](https://github.com/maqsudjon-cell/nullsample). Hear it at [nullsample.maqsudjon.com](https://nullsample.maqsudjon.com).
