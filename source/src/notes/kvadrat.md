---
title: KVADRAT: the square-metre calculator I use on grille jobs
seo_title: KVADRAT, an offline m² calculator for window grilles and welding jobs
slug: kvadrat
section: work
order: 12
date: 2026-10-14
project: KVADRAT
url: https://kvdrt.maqsudjon.com
image: kvadrat.webp
tags: Welding, Tools, Offline, PDF
description: Three numbers in, a priceable area out. A calculator for window grilles that projects from the wall, built for a dusty phone held in one hand while the other holds a tape measure.
facts:
  - Live: [kvdrt.maqsudjon.com](https://kvdrt.maqsudjon.com)
  - Input: width, height, projection
  - Output: m², price, PDF
  - Works offline: yes
  - Languages in input: Uzbek, Russian
  - Built: August 2026
---
**KVADRAT** is the least glamorous thing I have built and probably the one I use most. It calculates the square metres of a window grille, which is how grilles are priced.

Welders in Tashkent, me included, used to price this on paper and then argue about the square metres on site. The calculator on the phone was a notes app and a guess.

## Three numbers

A grille on a window usually sticks out from the wall, so you do not just weld the front: you weld the front face plus four side faces. You type three numbers on one line, width, height and projection, and KVADRAT returns the area you actually price:

`width × height + 2 × projection × (width + height)`

For `120 130 30`: 1.20 × 1.30 + 2 × 0.30 × (1.20 + 1.30) = 1.56 + 1.50 = **3.06 m²**. A flat grille with no projection takes two numbers: `120 130` is 1.56 m².

## The hard part was the order

The whole design problem was making `120 130 30` mean width 120, height 130, projection 30, every single time, for someone holding a tape measure in one hand and a phone in the other. Getting that impossible to misread took longer than the arithmetic. The order is always the same and the screen says so; a drawing next to the input updates as you type, so you see what you are measuring.

## Written the way a welder writes

Nobody on a job fills in a form, so the input is free text:

- **Quantities** at the end of a line: `2 dona`, `2sht`, `2шт`, `x2` or `(2)`. The area is multiplied.
- **Decimals** with either separator: `145,5` or `145.5`.
- **Labels** before or after the numbers: `oshxona 120 130 30` saves it as "kitchen", and the name shows up in the PDF.
- **Comments** starting with `#` or `//`.
- **Units**: switch between centimetres and millimetres; the result is always in m².

Type a price per square metre and you get the total, which goes into the PDF. Leave it empty and you get square metres only. One button copies a summary formatted for Telegram, because that is where the customer is.

## Built for the shop

It works offline, because a construction site does not always have a signal. It is in Uzbek, and it understands Russian shorthand in the input, because that is how people in the trade write. It is used on real jobs, not as a portfolio piece.

It sits next to the workshop's two catalogues, [Payvandchi](/work/payvandchi/) and [Reshotkachi](/work/reshotkachi/). Open it at [kvdrt.maqsudjon.com](https://kvdrt.maqsudjon.com).
