---
title: AI Lenta: an Uzbek AI news wire with nobody in the loop
seo_title: AI Lenta, automatic AI news in Uzbek with every source cited
slug: ailenta
section: work
order: 3
date: 2026-10-14
project: AI Lenta
url: https://ailenta.uz
image: ailenta.webp
tags: AI, News, Uzbek, GitHub Actions
description: How AI Lenta collects AI news from dozens of outlets, writes it in Uzbek, refuses to publish a number it cannot find in the source, and stops the same story from appearing twice.
facts:
  - Live: [ailenta.uz](https://ailenta.uz)
  - Sources on the front page: 27
  - Feeds collected: 50 + Hacker News + Google News
  - Updates: hourly
  - Server: none
  - Telegram: [@ailentauz](https://t.me/ailentauz)
---
AI news in Uzbek used to come in two forms: a Russian translation with the names left untranslated, or nothing. People who wanted a news wire in their own language got a reposted Facebook dump.

**AI Lenta** at [ailenta.uz](https://ailenta.uz) is my answer. It collects artificial intelligence news from open sources, writes a headline and a short summary in Uzbek for each story, links every item to the original, and publishes on its own, every hour. As I write this the front page shows 60 stories from 27 sources. The most important ones also go out on the Telegram channel [@ailentauz](https://t.me/ailentauz).

The constraint was the same as for everything I build. I cannot sit on a news desk. It has to publish while I am on a balcony with a grinder in my hand.

## The pipeline

There is no server. The whole thing is four Node scripts run by GitHub Actions, and the output is a static site on GitHub Pages.

1. **Collect.** About 50 RSS and Atom feeds, including outlets from China, Europe and Uzbekistan, plus the Hacker News API and Google News queries. Only the last 72 hours, and stock-market noise is filtered out.
2. **Filter.** Already-seen links are dropped, each item is scored for how much it is really about AI, reports of the same event from different outlets are grouped into one cluster, and the important clusters are picked.
3. **Write.** For each cluster a language model writes an Uzbek headline and summary. The provider is a setting: Gemini by default, Anthropic by changing one repository variable.
4. **Build.** The whole site is rebuilt from the posts: pages, sitemap, RSS, a search index and an `llms.txt`.

## The rules are in the code

A summary that invents a fact is worse than silence. So the rules are not intentions, they are checks:

- A summary is written only from the source text. The model is not allowed to add facts of its own.
- **Every number in a summary is looked up in the source text.** If a number is not there, the story is not published.
- Every item shows the name of the outlet and a link to it.
- Reuters, the Wall Street Journal and Bloomberg have no open RSS, so they are found through Google News, and those links are labelled as coming through Google News rather than hidden.
- Photos from other outlets are never copied.

## The hardest part: the same story twice

Stopping a story from appearing twice turned out to be the hardest problem in the project. Outlets describe one event so differently that comparing words does not catch it. One speech by the head of the Bank of England went out under three different headlines; their similarity scores were 0.32 and 0.46 against a threshold of 0.45.

So there are four layers now. A link that has been seen never comes back. When a story is published, the English headlines from *all* of its outlets are remembered and compared with every new cluster. The model is shown the last 40 published Uzbek headlines and answers "skip" if the event is already there. And before publishing, the new Uzbek headline and summary are compared with what is already on the site, with the headline checked on its own, because two summaries of one event can differ while their headlines stay alike.

## Pictures without stealing them

News pages look dead without pictures, and the pictures in CNBC or TechCrunch articles belong to them, usually licensed from Getty or a press office. AI Lenta uses **Wikimedia Commons** instead: free licences, with the author and licence written under each photo and all of them gathered on one credits page.

I tried searching Commons automatically and it failed in instructive ways. Asked for MediaTek, it returned an unrelated photo from the German federal archive. Asked for AMD, it returned US Army soldiers. A wrong photo next to a story is worse than no photo, so the photos are picked by hand, and stories without one get a cover drawn in code.

## The design carries data

I built three designs and compared them side by side: a dark live feed, a printed-newspaper layout and the one I kept, a white page with large type. In the chosen one every visual mark means something. The size of the headline is the importance of the story, in three steps. A coverage bar shows how many outlets wrote about it. The time on the left is Tashkent time.

Each story has its own page with the summary, the source link, the other outlets that covered it and related stories. There are pages per topic, per day and an archive. Every page has structured data, a canonical address and Open Graph tags, and new addresses are sent to Bing and Yandex through IndexNow the moment they exist.

## What it taught me

Uzbek language-model output is good enough to be useful and bad enough that you cannot trust it without checks. The link back to the original is the load-bearing wall of the whole site: it is what lets a reader verify anything I publish, and it is what keeps me honest when nobody is watching the pipeline.

Read it at [ailenta.uz](https://ailenta.uz), or follow [@ailentauz](https://t.me/ailentauz) on Telegram.
