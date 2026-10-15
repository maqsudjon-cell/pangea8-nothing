#!/usr/bin/env python3
"""Join src/shop/*.html into src/home.html and fill the grille with one pane per project."""
import html
from pathlib import Path
ROOT = Path(__file__).resolve().parent
P = [
 ("flarestamina","FlareStamina","IELTS","144 free IELTS tests in real exam mode.","flarestamina.webp"),
 ("zitou","Zitou","Chinese","Chinese in Uzbek, ten minutes a day.","zitou.webp"),
 ("ailenta","AI Lenta","News","AI news in Uzbek, every number checked.","ailenta.webp"),
 ("zh-tou-gg","zh.tou.gg","Chinese","Homework in the order of the slides.","zh.webp"),
 ("chertma","Chertma","Uzbek","Plain ASCII in, correct Uzbek out.","chertma.webp"),
 ("davomat","Davomat","Telegram","Group attendance in four taps.","davomat.webp"),
 ("tadam","Tadam","Events","Every wedding photo in one album.","tadam.webp"),
 ("nullsample","Nullsample","Music","Music from arithmetic, zero samples.","nullsample.webp"),
 ("pierics","Pierics","Game","A five-letter word game for IELTS.","pierics.webp"),
 ("minnos","Minnos","English","A cat who brings you idioms.","minnos.webp"),
 ("speaking-lab","Speaking Lab","Experiment","Talk to an AI IELTS examiner.","speaking.webp"),
 ("kvadrat","KVADRAT","Workshop","Square metres for grilles, offline.","kvadrat.webp"),
 ("payvandchi","Payvandchi","Workshop","Grilles, railings and canopies.","payvandchi.webp"),
 ("reshotkachi","Reshotkachi","Workshop","123 real photos on a 3D wall.","reshotkachi.webp"),
 ("zed-avlod","ZED AVLOD","Client","A school with real results.","zedavlod.webp"),
 ("ctn","CTN","Client","A whole school site in one file.","ctnlc.webp"),
 ("maqsudjon-com","maqsudjon.com","Lab","The lab and the build log.","maqsudjon.webp"),
 ("tou-gg","tou.gg","You are here","This page, and how it is built.",None),
]
cells = []
for slug, name, tag, line, img in P:
    pic = f'<img src="/img/{img}" alt="" width="800" height="500" loading="lazy">' if img else ''
    cells.append(f'<a class="cell" href="/work/{slug}/">{pic}<span class="curl" aria-hidden="true"></span>'
                 f'<span class="info"><span class="tag">{html.escape(tag)}</span><b>{html.escape(name)}</b>'
                 f'<span class="l">{html.escape(line)}</span></span></a>')
D = ROOT / "src" / "shop"
s = "".join((D / f).read_text() for f in ["01-style.html", "02-style.html", "03-body.html", "04-script.html"])
(ROOT / "src" / "home.html").write_text(s.replace("<!--CELLS-->", "\n      " + "\n      ".join(cells) + "\n    "))
print("home.html composed:", len(cells), "panes")
