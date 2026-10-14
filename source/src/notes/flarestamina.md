---
title: FlareStamina: free IELTS practice, built around a welding job
seo_title: FlareStamina, a free IELTS practice platform built solo in Tashkent
slug: flarestamina
section: work
order: 1
date: 2026-10-14
project: FlareStamina
url: https://flarestamina.com
image: flarestamina.webp
tags: IELTS, Education, Firebase
description: How a handful of listening tests became a free IELTS platform with 144 tests, a writing lab, a speaking lab and a news desk, and why the login walls had to come down.
facts:
  - Live: [flarestamina.com](https://flarestamina.com)
  - Tests in the hub: 144
  - Listening / Reading: 78 / 53
  - Started: May 2026, as pangea8
  - Price: practice is free
  - Built with: HTML, Firebase, Supabase, Claude API
---
FlareStamina is a free IELTS practice platform. Today its hub lists 144 tests: 78 Listening papers, 53 Reading papers and the rest spread over Writing, Speaking and full mocks. It has a Writing Lab that gives an AI band estimate, a Speaking Lab, a score converter, a deadline tracker for scholarships, a study plan generator and a news section. There is no paywall in front of practice.

I built it alone, in the evenings, while working full-time as a welder in Tashkent. That constraint shaped almost every decision in it.

## The problem

IELTS preparation in Uzbekistan is paywalled, scattered and often just a folder of PDFs. Teachers needed something they could run with a whole class. Students needed something that opens on a phone, on a slow connection, without a subscription.

My constraint was simple: there is one of me, and the day job is in a workshop. No content team, no editor, no support desk. If a feature needed someone to babysit it, it would die the week I went back to the shop.

## It started as pangea8

The project began in May 2026 under the name **pangea8**. Pangea was the single supercontinent before the land drifted apart; I liked the idea of one platform that a student in Tashkent, Jakarta or Lagos opens and gets the same free tests. The 8 was for Band 8, and it looks like an infinity sign on its side.

The domain went live on 27 May 2026. Within two days the hub went from 42 to 51 to 59 to 73 listening tests, each with 40 questions, full audio and instant scoring. Every test lives in its own GitHub repository. That sounds odd, and it later made one job much harder, but it meant a test could be added from a phone by registering one line in a `tests.json` file.

## What got added, in order

- **7 June:** a 40-Day IELTS Challenge tracker. 38 active days, 265 tasks across the four skills, Google sign-in, progress that syncs across devices, a streak heatmap and a class leaderboard, plus a teacher dashboard to edit the plan.
- **12 June:** a real landing page. Until then the domain pointed straight at the test list and never said what the project was. The hub moved to its own address, `/ielts-hub/`.
- **22 June:** the Speaking lab. The whole official January–April 2026 question bank was loaded: 166 topics across Parts 1, 2 and 3, numbered like the real exam. Students record in the browser; teachers listen back and leave a band and notes.
- **4 July:** a band calculator with the correct half-band rounding, a progress dashboard built from the student's own history, and a redesigned Writing Lab that exports a branded PDF of the essay with the feedback.
- **6 July:** the Full Mock. Listening, Reading and Writing back to back with real timers: audio that plays once, a 60-minute reading clock that survives a page reload, and two writing tasks marked by an AI examiner working from the official band descriptors.
- **10 July:** the rename. pangea8 became **FlareStamina**: a flare to get started, stamina to reach exam day. Old pangea8 links redirect with their paths intact, and one account now works across every tool.
- **15 July:** news and community. IELTS changes, fees and scholarship deadlines written for students in Uzbekistan, each with a link to the official source, plus a form where teachers can publish an article under their own name in a few minutes.

## Three products wearing one name

By August it worked, but it looked like three different sites. The hub had one palette, the news section another, the account page a third. Over one weekend in late August I moved everything to a single black-and-white "paper" design.

The design came to me as a compiled React bundle: about 315 KB of JavaScript and CSS and an HTML file whose body was one empty `div`. Shipping that as the home page of a site that lives on search traffic would have meant Google fetching a blank page and a student on 3G waiting for a bundle. I rewrote it as one static HTML file of 54 KB, with the structured data still in the markup. The other forty pages now share one 14 KB stylesheet and get their header and footer from a small build script, so they cannot drift apart again.

That pass found the bugs you only find by looking: a scheduled GitHub Action that quietly put the old design back on nine pages two hours after I finished, three official sources in the news section that had moved and now returned 404, and a grey used for every date and caption that failed contrast checks.

## The login walls

Traffic had been falling and I assumed it was an SEO problem. It was three login walls.

The hub that every test hangs off ran an auth check, so anyone arriving from Google was sent to an account page before seeing a single question. The Writing Lab had two gates, a login and a hardcoded access code. Speaking had a third. All three came down. Signing in is now optional and only saves your results.

> A wall in front of a practice test is just another fee.

Then came the SEO I had assumed was the problem, done across 113 separate repositories through the GitHub API:

| What | Before | After |
| --- | --- | --- |
| Pages missing a meta description | 101 | 0 |
| Pages missing a canonical tag | 107 | 1 |
| Test pages with structured data | 0 | 106 |
| Duplicate titles | 2 | 0 |

Every description was generated from the page's own headings, the real passage titles and section topics, not invented. Titles were rewritten to match what people type, so "Mock Listening, Test 63" became "IELTS Listening Practice Test 63 with Answers". Because the hub builds its list in JavaScript and a crawler saw an empty page, I added `/tests/`: a plain static index of every test, there mostly so Google can read what a person can already see.

## The numbers, as they were

On 23 August, Search Console showed 911 impressions, 83 clicks and an average position of 11.1 for FlareStamina. Position 11 is page two. GoatCounter counted 238 visits in a week, and Google sent about 8% of them. Almost all real traffic came from people sharing a link with each other.

I write that down because it is the honest reading: the SEO work was a bet that had not paid out yet, and the pages that worked were the ones somebody had a reason to send to a friend.

## What I would keep

Free, on purpose. Static pages wherever possible. Every claim on the site checkable: no invented student counts, no made-up ratings in the structured data. And a rule I learned in the workshop before I learned it in code: watch the thing after you think you are done, because that is when the scheduled job wakes up and undoes your weekend.

FlareStamina is at [flarestamina.com](https://flarestamina.com). If you are preparing for IELTS, start with any Listening paper. If you teach, the [Speaking Lab](https://flarestamina.com) and the article form are there for your class.
