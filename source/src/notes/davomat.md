---
title: Davomat: group attendance in four taps, inside Telegram
seo_title: Davomat, a free Telegram attendance app for university group monitors
slug: davomat
section: work
order: 6
date: 2026-10-14
project: Davomat
url: https://chzq.uz
image: davomat.webp
tags: Telegram, Tools, Offline, Privacy
description: A free attendance app for university group monitors: mark 25 students in four taps, let the bot ask absentees why, and never miss a birthday. Built by a student for his own group.
facts:
  - Live: [chzq.uz](https://chzq.uz)
  - Bot: [@Chzquzbot](https://t.me/chzquzbot)
  - 25 students: 4 taps
  - Works offline: yes, syncs later
  - Price: free, no ads
  - Started: September 2026
---
At my university every group has a monitor, a *sardor*, and the monitor has the same three chores every day: take attendance, find out why the absent people are absent, and remember birthdays. I am a student at AIFU too, and taking attendance on paper at the start of every class, then chasing people to ask where they were, took far too long. So I built **Davomat** for my own group. When it worked, I opened it to other groups.

It lives at [chzq.uz](https://chzq.uz) and runs inside Telegram through [@Chzquzbot](https://t.me/chzquzbot). The domain used to host my web studio, Chiziq; it now hosts Davomat.

## Three jobs, and nothing else

**Attendance.** The app opens straight to today's lesson with everyone marked present. You tap only the people who are missing. Each tap cycles the status: present, absent, late, excused. Marking 25 students usually takes four taps.

**Reasons.** When someone is absent, the bot writes to them and asks why. The student taps a button, the reason is recorded and the monitor is notified. Most of the time nobody has to call anybody.

**Birthdays.** Today, this week and this month on one screen. In the morning the bot posts a congratulation in the group chat by itself, and it reminds the monitor three days in advance.

## Why inside Telegram

The group is already in Telegram. Asking 25 people to install another app and register would be the end of it. In Davomat, nobody leaves the chat.

University Wi-Fi drops. Davomat keeps working without a connection and sends everything when it is back online.

## Setting up a group

Open the bot and type your group's name; you become the monitor. The app gives you a six-character code, and you drop it in the group chat. Each student fills in their own name, phone, address and birthday, so the monitor does not type 25 people's details by hand.

## Privacy that a monitor can explain

Collecting phone numbers and home addresses for a whole group is sensitive, so the rules are strict and simple:

- Only the monitor and the deputy can see contacts. Nobody else.
- A student can never see another student's phone number or address.
- The list shows names only. An address is loaded only when someone asks for it, and every time someone opens an address it is logged, so you know who looked.

No ads, no data sold, nothing paid inside. It was made by a student for students and it will stay free. If something is wrong or missing, write to the bot; I read it myself.

Open it at [chzq.uz](https://chzq.uz).
