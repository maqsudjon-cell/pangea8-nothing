---
title: Open data: Uzbek words, Chinese HSK, and music with exact labels
seo_title: Open datasets on Hugging Face: Uzbek lexicon, HSK Chinese–Uzbek–Russian vocabulary, Nullsample Multitrack
slug: open-data
section: work
order: 19
date: 2026-10-14
project: Open data
url: https://huggingface.co/Maqsudjonpolatov
image: hfspace.webp
tags: Open data, Hugging Face, Uzbek, Chinese
description: Three datasets and one Space on Hugging Face: 28 million rows of Uzbek word frequencies with a skeleton index, 8,296 HSK words with Uzbek and Russian meanings, and 20 synthetic music tracks with stems, MIDI and exact annotations.
facts:
  - Profile: [Maqsudjonpolatov](https://huggingface.co/Maqsudjonpolatov)
  - Uzbek lexicon rows: 28,052,730
  - HSK words: 8,296
  - Music tracks with exact labels: 20
  - Licence: CC BY 4.0
  - Lexicon downloads: 111 (14 Oct 2026)
---
Three of my products sit on top of data I built myself, and I published each dataset on Hugging Face so that nobody has to build it again.

## Uzbek frequency lexicon with skeleton index

[uz-lexicon-skeleton](https://huggingface.co/datasets/Maqsudjonpolatov/uz-lexicon-skeleton) is the data underneath [Chertma](/work/chertma/). It was counted from 1.75 billion Uzbek word tokens: 1.43 billion from books, 296 million from news and 25.5 million from Telegram channels, taken from the open datasets `tahrirchi/uz-books-v2` (MIT) and `tahrirchi/uz-crawl` (Apache-2.0).

| File | Rows | What is in it |
| --- | --- | --- |
| unigrams | 4,892,125 | word, count, skeleton |
| bigrams | 23,160,605 | word, next word, count |
| skeleton index | 4,711,419 | a skeleton and every word that has it |

Every word is in the new Latin alphabet, lowercase and normalised. Together, words and word pairs are the 28,052,730 rows.

The **skeleton** is what makes it useful. Uzbek is written with marks that keyboards lose: `ş ç ö ğ`, the old `oʻ gʻ sh ch`, apostrophes, or the Cyrillic letters. The skeleton of a word is what is left when every distinction a keyboard could destroy is folded away, so `тўғри`, `toʻgʻri`, `togri` and `töğri` all become `tOGri`. The index answers the question every Uzbek keyboard, spell checker and transliteration model has to answer: the user typed this, which real words could they have meant?

The word pairs are cut at a count of 6 or more. At a cutoff of 3 the file would have been almost a gigabyte; 6 was the smallest cutoff that kept it under about 500 MB.

It is under CC BY 4.0: credit the dataset and both sources. As of 14 October 2026 it had been downloaded 111 times.

## HSK Chinese–Uzbek–Russian Vocabulary

[hsk-chinese-uzbek-russian](https://huggingface.co/datasets/Maqsudjonpolatov/hsk-chinese-uzbek-russian) is the vocabulary of [Zitou](/work/zitou/). It has **8,296 Chinese words**: every word of HSK levels 1–6 (7,824 words) and 472 everyday words that are on no list, such as 这个, 一个, 不是 and 不会.

Each word has its simplified and traditional form, pinyin with tone marks and with numbers, the meaning in Uzbek and in Russian, its level in three HSK lists (2025, HSK 3.0 and HSK 2.0) and a frequency rank. When a word has more than one reading, the reading HSK means was chosen, and some were fixed by hand, for example 教 jiāo, 重 zhòng and 得 dé.

The Uzbek and Russian meanings were written for Zitou with AI assistance. They are reviewed and corrected over time from learners' reports in the app, and both the app and the dataset card say so plainly. Expect some mistakes, especially in rare senses. As far as I know it is the first open Chinese–Uzbek HSK vocabulary.

## Nullsample Multitrack

[nullsample-multitrack](https://huggingface.co/datasets/Maqsudjonpolatov/nullsample-multitrack) comes out of [Nullsample](/work/nullsample/), my music generator. It has **20 complete tracks generated from code, with zero samples**. Each one comes with its mix, six stems (drums, 808 bass, lead, arp, pads and effects), a MIDI file and exact annotations: tempo, downbeats, key, the chord in every bar, the sections, every drum hit by instrument and every note of every part. That is 40,060 drum hits and 32,919 notes over 37 minutes of music.

The labels are not estimated and not annotated by hand. They are the score the audio was synthesised from, so they are exact by construction. And every track can be rebuilt bit for bit from its seed, on any machine, with the open-source engine.

That makes it useful for work that needs ground truth:

- source separation, with six stems per track;
- drum and note transcription, with onsets exact to the sample;
- beat, downbeat and tempo tracking;
- key and chord recognition, and structure segmentation;
- testing a music-analysis tool against known answers before trusting it on real recordings.

The card is honest about the limits. All 20 tracks come from one preset, an energetic electronic style around 151–160 BPM, so it is a probe and a clean supplement, not a training corpus on its own. The stems do not sum exactly to the mix, because the mix has its own effects and a limiter. The audio is MP3 to keep it small; for lossless audio you render the seed yourself. Audio, MIDI and annotations are under CC BY 4.0, and the engine is AGPL-3.0.

## The dictionary Space

To make the vocabulary usable without code, there is a free [HSK dictionary Space](https://huggingface.co/spaces/Maqsudjonpolatov/hsk-uzbek-dictionary). You can search by character, by pinyin with or without tones, or by an Uzbek or Russian word; browse a level of any of the three HSK lists; and practise ten words at a time with flashcards. The page is in Uzbek, Russian and English, and every word links to its page on zitou.app with stroke order, audio and examples.

## Why publish it

Data for Uzbek is scarce, data that connects Uzbek to Chinese is scarcer, and music with exact, complete labels is rare in any language. Publishing them costs nothing, and the next person who builds an Uzbek keyboard or a Chinese course for Uzbek speakers can start from here instead of from zero. The same goes for anyone testing a music model who needs the right answers in advance.
