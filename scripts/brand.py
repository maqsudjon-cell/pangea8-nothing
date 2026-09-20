#!/usr/bin/env python3
"""
tou.gg brand assets — generated from the same woff2 files the site ships.

    python3 scripts/brand.py

Writes, into the repo root:
    favicon.svg            square t> mark, crisp at 16px
    apple-touch-icon.svg   the same mark with iOS padding
    icon-32/192/512.png    rasterised from the SVG (cairosvg)
    apple-touch-icon.png
    og.svg og.png og.jpg   1200x630 share card

No stock art, no image model, no font that is not already in /fonts.
Every glyph is checked against the font's cmap before it is drawn, so a
missing arrow shows up as a build error instead of a tofu box in every
Telegram preview.
"""

from __future__ import annotations

import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"

BG = (8, 11, 20)
INK = (233, 238, 248)
MUTED = (166, 178, 198)
FAINT = (125, 138, 163)
WELD = (255, 107, 53)
HOT = (255, 179, 71)

OG_VERSION = "2026-09"
STATS = "15 live sites · 191 repos · 3,000+ commits · 144 IELTS tests"
MANIFEST = ["flarestamina.com", "ailenta.uz", "chertma", "nullsample", "tadam.uz", "kvdrt", "chzq.uz"]
WHO = "MAQSUDJON POLATOV · PRODUCT ENGINEER · TASHKENT"
LINE = "from me — to you"


def load(name: str, size: int) -> ImageFont.FreeTypeFont:
    """woff2 -> in-memory ttf -> PIL font."""
    src = FONTS / name
    if not src.exists():
        sys.exit(f"missing font: {src}")
    f = TTFont(str(src))
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


def covers(name: str, text: str) -> list[str]:
    """Characters the font has no glyph for."""
    cmap = TTFont(str(FONTS / name)).getBestCmap()
    return [c for c in set(text) if c not in (" ", "\n") and ord(c) not in cmap]


def glow(img: Image.Image, xy, radius, color, alpha) -> None:
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([xy[0] - radius, xy[1] - radius, xy[0] + radius, xy[1] + radius], fill=(*color, alpha))
    img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius / 2.2)))


def seam(draw: ImageDraw.ImageDraw, x0, y0, x1, h) -> None:
    """Weld gradient: orange at the left, amber at the right."""
    span = max(1, x1 - x0)
    for i in range(span):
        k = i / span
        c = tuple(round(WELD[j] + (HOT[j] - WELD[j]) * k) for j in range(3))
        draw.rectangle([x0 + i, y0, x0 + i + 1, y0 + h], fill=c)


# --------------------------------------------------------------------- icons
MARK_SVG = """<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <title>tou.gg</title>
  <rect width="32" height="32" rx="{r}" fill="#080B14"/>
  <!-- t -->
  <rect x="{p}" y="{t_bar}" width="9" height="3" fill="#E9EEF8"/>
  <rect x="{t_stem}" y="{t_top}" width="3" height="{t_h}" fill="#E9EEF8"/>
  <rect x="{t_stem}" y="{foot}" width="7" height="3" fill="#E9EEF8"/>
  <!-- caret -->
  <path d="M{c_x} {c_top}l{c_w} {c_half}-{c_w} {c_half}" fill="none" stroke="#FF6B35"
        stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
"""


def mark(rounded: int, pad: int) -> str:
    return MARK_SVG.format(
        r=rounded,
        p=pad + 1,
        t_bar=pad + 6,
        t_stem=pad + 4,
        t_top=pad + 2,
        t_h=32 - 2 * pad - 8,
        foot=32 - pad - 6,
        c_x=32 - pad - 11,
        c_top=pad + 8,
        c_w=6,
        c_half=8 - pad // 2,
    )


def write_icons() -> None:
    import cairosvg

    favicon = mark(rounded=0, pad=3)
    touch = mark(rounded=7, pad=5)
    (ROOT / "favicon.svg").write_text(favicon, encoding="utf-8")
    (ROOT / "apple-touch-icon.svg").write_text(touch, encoding="utf-8")
    for size, out, svg in [
        (32, "icon-32.png", favicon),
        (192, "icon-192.png", favicon),
        (512, "icon-512.png", favicon),
        (180, "apple-touch-icon.png", touch),
    ]:
        cairosvg.svg2png(bytestring=svg.encode(), write_to=str(ROOT / out),
                         output_width=size, output_height=size)
        print("  icon", out, size)


# ------------------------------------------------------------------------ og
def write_og() -> None:
    W, H = 1200, 630
    # The site's display face is the mono; the card must match it.
    display = "jetbrains-mono-latin-700-normal.woff2"
    mono = "jetbrains-mono-latin-400-normal.woff2"

    for font_file, text in ((display, "tou.gg"), (mono, WHO + STATS + LINE + "".join(MANIFEST))):
        missing = covers(font_file, text)
        if missing:
            sys.exit(f"{font_file} has no glyph for {missing!r} — fix the copy or the font, "
                     f"do not ship a tofu box in the share card")

    f_mark = load(display, 150)
    f_who = load(mono, 24)
    f_line = load(mono, 30)
    f_stats = load(mono, 23)

    img = Image.new("RGBA", (W, H), (*BG, 255))
    glow(img, (W * 0.86, -40), 420, WELD, 44)
    glow(img, (60, H * 0.9), 340, (56, 217, 255), 22)
    d = ImageDraw.Draw(img)

    m = 84
    d.text((m, 92), WHO, font=f_who, fill=FAINT)

    # tou.gg — white word, weld-orange domain.
    base_y = 214
    tou_w = d.textlength("tou", font=f_mark)
    d.text((m, base_y), "tou", font=f_mark, fill=INK)
    d.text((m + tou_w, base_y), ".gg", font=f_mark, fill=WELD)

    d.text((m, 430), LINE, font=f_line, fill=MUTED)

    # A quiet manifest down the right edge — the card should say what is behind it.
    f_man = load(mono, 21)
    right = W - m
    for i, dom in enumerate(MANIFEST):
        y = 232 + i * 34
        w = d.textlength(dom, font=f_man)
        d.text((right - w, y), dom, font=f_man, fill=(48, 60, 84))
        d.rectangle([right - w - 18, y + 10, right - w - 10, y + 12], fill=(60, 44, 40))

    seam(d, m, 512, m + 150, 3)
    d.text((m, 548), STATS, font=f_stats, fill=FAINT)
    seam(d, 0, H - 4, W, 4)

    rgb = img.convert("RGB")
    rgb.save(ROOT / "og.png", optimize=True)
    rgb.save(ROOT / "og.jpg", quality=92, optimize=True, progressive=True)
    # Same bytes under a versioned name. Telegram, X and LinkedIn cache an image
    # by URL, so a redesigned card only reaches them under a URL they have not
    # seen. Bump OG_VERSION whenever the card changes; keep og.jpg as well, for
    # anything that already links to it.
    rgb.save(ROOT / f"og-{OG_VERSION}.jpg", quality=92, optimize=True, progressive=True)
    print(f"  og.png / og.jpg / og-{OG_VERSION}.jpg 1200x630")

    # A vector twin, for anything that prefers SVG.
    (ROOT / "og.svg").write_text(f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <title>tou.gg — from me, to you</title>
  <defs><linearGradient id="seam" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#FF6B35"/><stop offset="100%" stop-color="#FFB347"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="#080B14"/>
  <text x="84" y="116" font-family="JetBrains Mono, monospace" font-size="24" fill="#7D8AA3">{WHO}</text>
  <text x="84" y="356" font-family="JetBrains Mono, ui-monospace, monospace" font-size="150" font-weight="700" fill="#E9EEF8">tou<tspan fill="#FF6B35">.gg</tspan></text>
  <text x="84" y="460" font-family="JetBrains Mono, monospace" font-size="30" fill="#A6B2C6">{LINE}</text>
  <rect x="84" y="512" width="150" height="3" fill="url(#seam)"/>
  <text x="84" y="570" font-family="JetBrains Mono, monospace" font-size="23" fill="#7D8AA3">{STATS}</text>
  <rect x="0" y="626" width="1200" height="4" fill="url(#seam)"/>
</svg>
""", encoding="utf-8")


if __name__ == "__main__":
    print("tou.gg brand assets")
    write_icons()
    write_og()
    print("done")
