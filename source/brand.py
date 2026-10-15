#!/usr/bin/env python3
"""Make favicons and Open Graph images for tou.gg with headless Chrome. Output: src/brand/."""
import html, re, subprocess, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from build import parse_note, SRC

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = SRC / "brand"; (OUT / "og").mkdir(parents=True, exist_ok=True)
TMP = Path("/tmp") / "tou-brand"; TMP.mkdir(exist_ok=True)
PROFILE = TMP / "profile"

MARK = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        '<rect width="64" height="64" rx="14" fill="#16191D"/>'
        '<rect x="20" y="11" width="10" height="38" rx="2" fill="#FFFFFF"/>'
        '<rect x="12" y="21" width="27" height="9" rx="2" fill="#FFFFFF"/>'
        '<rect x="20" y="41" width="19" height="9" rx="2" fill="#FFFFFF"/>'
        '<circle cx="48" cy="45" r="6.5" fill="#FF7A1A"/></svg>')

def shoot(html_text, name, w, h):
    page = TMP / f"{name}.html"; page.write_text(html_text, encoding="utf-8")
    png = TMP / f"{name}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--user-data-dir={PROFILE}",
                    f"--window-size={w},{h}", "--virtual-time-budget=4000", "--default-background-color=00000000",
                    f"--screenshot={png}", f"file://{page}"], capture_output=True)
    return png

FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=Big+Shoulders+Stencil+Display:wght@800&family=Instrument+Sans:wght@500&family=Geist+Mono:wght@500&display=swap">'

def og_html(title, kicker, shot=None):
    img = f'<div class="shot"><img src="file://{SRC / "img" / shot}"></div>' if shot else '<div class="shot nums"><b>18</b><span>live sites</span><b>191</b><span>repos</span><b>3,146</b><span>commits</span></div>'
    return f"""<!doctype html><meta charset="utf-8">{FONTS}<style>
*{{box-sizing:border-box}}body{{margin:0;width:1200px;height:630px;background:#0E1012;font-family:'Instrument Sans',sans-serif;color:#ECE6DA;overflow:hidden}}
.wrap{{position:absolute;inset:0;display:grid;grid-template-columns:600px 1fr;gap:40px;padding:56px 0 56px 64px}}
.left{{display:flex;flex-direction:column;justify-content:space-between}}
.logo{{font-family:'Big Shoulders Stencil Display';font-weight:800;font-size:44px;letter-spacing:.02em;text-transform:uppercase}}.logo span{{color:#FF7A1A}}
.k{{font-family:'Geist Mono',monospace;font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:#FF7A1A;margin-bottom:18px}}
h1{{font-family:'Big Shoulders Display';font-weight:800;text-transform:uppercase;font-size:{70 if len(title) < 60 else 58}px;line-height:.95;letter-spacing:0;margin:0}}
.by{{font-size:22px;color:#8B9096}}
.shot{{border-radius:22px 0 0 22px;overflow:hidden;border:2px solid #2A2F35;border-right:0;background:#07080A;height:518px}}
.shot img{{width:100%;height:100%;object-fit:cover;object-position:top left}}
.nums{{background:#16191D;color:#ECE6DA;display:grid;grid-template-columns:auto 1fr;align-content:center;gap:10px 22px;padding:48px;font-family:'Geist Mono',monospace}}
.nums b{{font-family:'Big Shoulders Display';font-size:84px;font-weight:800;color:#FF7A1A;color:#fff}}.nums span{{font-size:24px;align-self:center;opacity:.7}}
</style><div class="wrap"><div class="left"><div class="logo">tou<span>.</span>gg</div>
<div><div class="k">{html.escape(kicker)}</div><h1>{html.escape(title)}</h1></div>
<div class="by">Maqsudjon Polatov · Tashkent</div></div>{img}</div>"""

# favicons
(OUT / "favicon.svg").write_text(MARK, encoding="utf-8")
icon = shoot(f'<!doctype html><style>html,body{{margin:0;background:transparent}}svg{{display:block;width:512px;height:512px}}</style>{MARK}', "icon", 512, 512)
for size, name in ((512, "icon-512.png"), (192, "icon-192.png"), (180, "apple-touch-icon.png"), (32, "icon-32.png")):
    subprocess.run(["sips", "-z", str(size), str(size), str(icon), "--out", str(OUT / name)], capture_output=True)
subprocess.run(["sips", "-s", "format", "ico", str(OUT / "icon-32.png"), "--out", str(OUT / "favicon.ico")], capture_output=True)

# site OG
png = shoot(og_html("I weld metal by day. I ship software by night.", "Product engineer"), "og", 1200, 630)
subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82", str(png), "--out", str(OUT / "og.jpg")], capture_output=True)

# one OG per note
for p in sorted((SRC / "notes").glob("*.md")):
    n = parse_note(p)
    kicker = n.get("project", "Note") if n["section"] == "work" else "Note · " + n["dt"].strftime("%-d %b %Y")
    png = shoot(og_html(n["title"], kicker, n.get("image")), n["slug"], 1200, 630)
    subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "82", str(png), "--out", str(OUT / "og" / f"{n['slug']}.jpg")], capture_output=True)
    print("og", n["slug"])
print("done")
