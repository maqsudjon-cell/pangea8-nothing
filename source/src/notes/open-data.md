---
title: Open data: an Uzbek lexicon and a Chinese–Uzbek HSK vocabulary
seo_title: Open Uzbek NLP data and an HSK Chinese–Uzbek–Russian vocabulary on Hugging Face
slug: open-data
section: work
order: 19
date: 2026-10-14
project: Open data
url: https://huggingface.co/Maqsudjonpolatov
image: hfspace.webp
tags: Open data, Hugging Face, Uzbek, Chinese
description: Two datasets and one Space on Hugging Face: 28 million rows of Uzbek word and word-pair frequencies with a skeleton index, and 8,296 HSK words with Uzbek and Russian meanings.
facts:
  - Profile: [Maqsudjonpolatov](https://huggingface.co/Maqsudjonpolatov)
  - Uzbek lexicon rows: 28,052,730
  - HSK words: 8,296
  - Licence: CC BY 4.0
  - Lexicon downloads: 111 (14 Oct 2026)
---
Two of my products sit on top of data I built myself, and I published both datasets on Hugging Face so that nobody has to build them again.

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

## The dictionary Space

To make the vocabulary usable without code, there is a free [HSK dictionary Space](https://huggingface.co/spaces/Maqsudjonpolatov/hsk-uzbek-dictionary). You can search by character, by pinyin with or without tones, or by an Uzbek or Russian word; browse a level of any of the three HSK lists; and practise ten words at a time with flashcards. The page is in Uzbek, Russian and English, and every word links to its page on zitou.app with stroke order, audio and examples.

## Why publish it

Data for Uzbek is scarce, and data that connects Uzbek to Chinese is scarcer. Publishing them costs nothing, and the next person who builds an Uzbek keyboard or a Chinese course for Uzbek speakers can start from here instead of from zero.
