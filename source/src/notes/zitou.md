---
title: Zitou: learning Chinese in Uzbek, ten minutes a day
seo_title: Zitou, a free app for learning Chinese in Uzbek with HSK, dictionary and stroke order
slug: zitou
section: work
order: 2
date: 2026-10-14
project: Zitou
url: https://zitou.app
image: zitou.webp
tags: Chinese, HSK, Education, Cloudflare Workers
description: A free app that teaches Chinese in Uzbek and nine other languages: a 123,000-word dictionary, all HSK lists, stroke-order writing, spaced repetition, and tools for teachers.
facts:
  - Live: [zitou.app](https://zitou.app)
  - Dictionary: 123,000+ words
  - HSK words (2025 list): 10,057
  - Native-speaker audio: 8,500+ words
  - Example sentences: 17,000+
  - Interface: 10 languages
---
I started learning Chinese on 19 September 2026. Four days later, on 23 September, the first version of the Cloudflare Worker that now serves **Zitou** went up. On 1 October it moved to its own domain, [zitou.app](https://zitou.app).

Zitou is a free app for learning Chinese in Uzbek. It also works in English, Russian, Chinese, Spanish, Portuguese, French, German, Turkish and Indonesian, so ten interface languages in all. You do not need an account to start, and it runs in the browser on a phone, a tablet or a computer.

## What is in it

The core is a dictionary and a course. The dictionary has more than 123,000 words. You can search by character, by pinyin with or without tones, or by the meaning in Uzbek, Russian or English. The course follows the HSK word lists, and Zitou carries three of them: the newest list from 2025, HSK 3.0 from 2021 and HSK 2.0 from 2012. Each level of each list is its own course.

A new word arrives as character, sound and meaning. Then come questions: reading, listening, translation and writing. More than 8,500 words are recorded by a native speaker; the rest use the device's Chinese voice.

- **Stroke order.** Every character is shown first, then traced over a grey outline, then written from memory with a finger.
- **Tones in colour.** First tone red, second orange, third green, fourth blue, so you remember a tone with your eyes as well as your ears.
- **Spaced repetition.** Words come back just before you would forget them, scheduled with the FSRS algorithm. You only press Start.
- **Grammar.** 103 topics for HSK 1–4, each with a pattern, a short rule, examples with pinyin, the common mistake, and a two-minute exercise.
- **Picture stories.** Short tales read by a native speaker, with pinyin over every word and the meaning on tap.
- **A rhythm game for tones.** One syllable per beat: tāng, táng, tǎng, tàng.
- **HSK mock exams.** HSK 1–4 in the real HSK 2.0 format, with the listening played like the exam, the timer, 100-point sections and a pass mark. A first HSK 3.0 level-1 paper is there too.

Around the course are small tools: a translator for text, voice or a photo, with pinyin; a phrasebook of more than 80 phrases for a trip to China (halal food, taxi, hotel, market, wholesale, cargo); your name written in Chinese with each character explained; a daily set of five questions that everyone at your level gets, so you can send it to a friend; and a news section on visas, study grants, HSK, trade and cargo between China and Uzbekistan, each item with its source.

## For teachers

A class is a link. A teacher opens a class, drops the link in the group chat, and sees one table: who practised today, weekly XP, streaks and how many words each student knows.

Exams are built from all the words of an HSK level or from the teacher's own list. Each student gets their own sheet, a time limit and a deadline, and the answer key stays on the server.

The live game turns a lesson into a quiz. A PIN goes on the screen, students join from their phones without accounts and pick a character, points come for speed, there are streaks and teams, and at the end everyone sees the words they got wrong.

## Free, and what Pro is for

Everything you need to learn every day is free: the dictionary, the HSK course, practice, audio, writing and tone drills. Pro is for people preparing for an exam and for teachers who run several classes.

| | Free | Pro |
| --- | --- | --- |
| HSK mock exam | 1 per week | unlimited |
| Pronunciation check | 5 per day | unlimited |
| Classes | 1, up to 30 students | 20, up to 200 each |
| Exams per class | 3 | 200 |
| Live game | 30 players | 100 players |
| Results as CSV | no | yes |

There is a one-week free trial, a referral reward (when a friend you invite practises for three days, you get seven days of Pro, up to twelve friends), and 30 days of Pro costs 150 Telegram Stars, paid inside Telegram.

## Telegram, and the data underneath

Zitou also lives in Telegram. The channel [@zitougg](https://t.me/zitougg) posts one HSK word a day with its audio. The bot [@zitouggbot](https://t.me/zitouggbot) has the daily lessons, tests, the dictionary and reminders, with the same results as the app, in ten languages.

The vocabulary behind the course is public. I published it on Hugging Face as [HSK Chinese–Uzbek–Russian Vocabulary](https://huggingface.co/datasets/Maqsudjonpolatov/hsk-chinese-uzbek-russian): 8,296 words, every word of HSK levels 1–6 plus 472 everyday words that are on no list, each with pinyin, the traditional form, the meaning in Uzbek and Russian, and its level in all three HSK lists. The Uzbek and Russian meanings were written with AI assistance and are corrected over time from learners' reports, and both the app and the dataset card say so. There is also a [free dictionary Space](https://huggingface.co/spaces/Maqsudjonpolatov/hsk-uzbek-dictionary) for searching it and practising with flashcards. More on that in the note on [open data](/work/open-data/).

## Why build it this way

Zitou teaches Chinese straight from Uzbek, so a learner in Tashkent does not have to go through English in the middle.

It runs on Cloudflare Workers, the same way most of my newer products do, and it is still early: the App Store and Google Play versions are marked "coming soon" on the site. I am a beginner in the language I am building for, which keeps me honest about what a beginner needs on day one.

Try it at [zitou.app](https://zitou.app). Start with HSK 1, or search for your own name.
