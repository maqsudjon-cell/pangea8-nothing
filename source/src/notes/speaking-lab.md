---
title: Speaking Lab: talking to an AI IELTS examiner like a voice call
seo_title: IELTS Speaking Lab, practise with an AI examiner in the browser
slug: speaking-lab
section: work
order: 11
date: 2026-10-14
project: Speaking Lab
url: https://ielts-speaking-lab.pages.dev
image: speaking.webp
tags: IELTS, AI, Experiment, Gemini
description: An experiment: an IELTS Speaking examiner you talk to out loud, with the January–April 2026 topics for Parts 1–3, band-score feedback, and a camera mode you control with hand gestures.
facts:
  - Live: [ielts-speaking-lab.pages.dev](https://ielts-speaking-lab.pages.dev)
  - Topics: Jan–Apr 2026, Parts 1–3
  - Examiner: Gemini
  - Voice: Gemini or the browser's own
  - Status: experiment
  - Built: July 2026
---
The Speaking Lab is an experiment. Most IELTS speaking practice is reading a question and recording an answer. Here you talk to an examiner, out loud, like a voice call.

You pick a topic from the January–April 2026 question bank for Parts 1, 2 and 3, the examiner asks the questions, you answer, and at the end you get band-score feedback. You can also add your own topic: a cue card and a list of questions, one per line, saved on your device.

## How it talks

The examiner runs on Google's Gemini. The page asks for one of two things:

- **A Worker URL**, recommended. A teacher puts the API key behind a small server function, so students never see it.
- **Your own Gemini API key** as a fallback, which you can get for free from Google AI Studio.

The examiner's voice can be Gemini's natural voice or the browser's built-in one, which is free. With auto-listen switched on, the page starts listening as soon as the examiner stops talking, so the conversation flows without buttons.

## The gesture mode

There is a second mode that is pure experiment: the camera turns on, a futuristic heads-up display appears, and you control everything with your hands. A pinch is a tap and an open palm opens the menu. It is not how most students will practise, but it was a way to test how far a browser page can go without a single tap.

## How it fits with FlareStamina

This is not the same as the Speaking section of [FlareStamina](/work/flarestamina/). That one is for classes: students record answers to 166 official topics and a teacher listens and leaves a band and notes. The Speaking Lab is for practising alone, with a machine on the other side, when no teacher is available.

Try it at [ielts-speaking-lab.pages.dev](https://ielts-speaking-lab.pages.dev). It works best with headphones and a quiet room.
