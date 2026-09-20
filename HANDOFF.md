# HANDOFF — tou.gg

Hamma kod tayyor va pushed. Quyidagi to‘rt ishni faqat **siz** qila olasiz,
chunki ular login yoki UI tugma talab qiladi. Har biri 2–5 daqiqa.
*(Each step below needs your login or a UI toggle — no token can do it.)*

---

## 1. GoatCounter — statistika hozir NOLNI yig‘yapti ⚠️

`https://tou.goatcounter.com` hali mavjud emas: har bir sahifa ochilishi
**400** qaytaryapti, ya’ni hech qanday tashrif yozilmayapti.

1. https://www.goatcounter.com/signup ga kiring (mavjud akkauntingiz bilan —
   `flarestamina`, `zedavlod` va h.k. o‘sha yerda).
2. **Add site** → code: `tou`
3. **Settings → Domain** ga `tou.gg` ni qo‘shing.
4. Tekshirish:

```bash
curl -sI "https://tou.goatcounter.com/count?p=/test" | head -1
```

`400` emas, `200` yoki `307` chiqsa — ishladi. Saytda hech narsa
o‘zgartirish shart emas, hisoblagich darrov ishlay boshlaydi.

---

## 2. GitHub Pages — HTTPS majburiy emas ⚠️

Hozir `http://tou.gg` **301 bermayapti, 200 qaytaryapti** — ya’ni sayt
shifrlanmagan HTTP orqali ham ochiladi. Bu SEO uchun dublikat, xavfsizlik
uchun esa yomon.

1. https://github.com/maqsudjon-cell/tou/settings/pages
2. **Enforce HTTPS** — belgilang.
3. Tekshirish:

```bash
curl -sI http://tou.gg | head -2
```

`HTTP/1.1 301` va `location: https://tou.gg/` chiqishi kerak.

> Bu sozlamani API orqali yoqib bo‘lmadi — token `pages` scope’iga ega emas.

---

## 3. Google Search Console

Sayt hali Search Console’da tasdiqlanmagan (DNS’da `TXT` yozuv yo‘q).

**Eng oson yo‘l — DNS (Cloudflare’da, domen allaqachon o‘sha yerda):**

1. https://search.google.com/search-console → **Add property** → **Domain** →
   `tou.gg`
2. Google bergan `TXT` qiymatini Cloudflare DNS’ga qo‘shing
   (`tou.gg`, type `TXT`, content `google-site-verification=...`).
3. **Verify**.

**Yoki HTML-tag usuli** (kod orqali, agar DNS’ga tegmoqchi bo‘lmasangiz):

1. Search Console **URL prefix** → `https://tou.gg` → **HTML tag** → tokenni
   nusxalang (`content="..."` ichidagi qism).
2. `src/content.mjs` ichida:

```js
googleSiteVerification: "BU_YERGA_TOKEN",
```

3. `node build.mjs && git commit -am "Search Console verification" && git push`
4. Search Console’da **Verify**.

Tasdiqlagach, **Sitemaps** bo‘limiga qo‘shing:

```
https://tou.gg/sitemap.xml
```

Sitemap 46 ta sahifani, har birini uch tilda, `hreflang` bilan e’lon qiladi.

**Indekslashni tezlashtirish:** Search Console → **URL Inspection** →
`https://tou.gg/` → **Request indexing**. Keyin `/uz/` va `/work/` uchun ham.

---

## 4. Ijtimoiy tarmoq kartasi va profil havolalari

- **OG rasm yangilandi** (eskisida `to you □ tou.gg` — kvadratcha bor edi).
  Telegram/X eski rasmni keshlagan bo‘lishi mumkin. Yangilash:
  - X: https://cards-dev.twitter.com/validator
  - Telegram: `@WebpageBot` ga `https://tou.gg` yuboring.
  - LinkedIn: https://www.linkedin.com/post-inspector/
- Bio havolasini `tou.gg` ga o‘zgartiring: X, Instagram, Telegram, GitHub
  profil, Hugging Face.

---

## Nima o‘zgardi (qisqacha)

| | Ilgari | Endi |
|---|---|---|
| Tillar | UZ/RU tugmalari **ishlamas edi** | `/`, `/uz/`, `/ru/` — to‘liq uch til + hreflang |
| Bosh sahifa mobilda | ~600px bo‘sh joy, matn 3 soniya ko‘rinmasdi | matn darrov o‘qiladi, bo‘shliq yo‘q |
| Header | skrollda matn ustiga yozilib ketardi | sticky, blur, chegara |
| Dizayn | bosh sahifa va ichki sahifalar **ikki xil** | bitta tizim, bitta generator |
| `then.uz` | jonli mahsulot sifatida ko‘rsatilgan (domen o‘lgan) | olib tashlandi |
| Raqamlar | 15 / 189 / 1,600+ / 113 | 15 / 191 / 3,000+ / 144 — hammasi tekshirilgan |
| OG rasm | `to you □ tou.gg` (tofu) | to‘g‘ri, shrift cmap’i tekshiriladi |
| Shrift | Space Grotesk yuklanmasdi (`@font-face` yo‘q edi) | yuklanadi; ortiqcha IBM Plex olib tashlandi |
| Canonical | `/work` (redirect’ga ko‘rsatardi) | `/work/` |
| Statistika | kod mavjud emas → nol | kod bor, faqat GoatCounter’da yaratish qoldi (§1) |

Batafsil: [NOTES.md](NOTES.md).

---

## Kundalik ish

```bash
node build.mjs && node scripts/check.mjs
git commit -am "..." && git push
```

Push’dan 1–2 daqiqa keyin tou.gg yangilanadi. `.html` fayllarni qo‘lda
tahrirlamang — ular generatsiya qilinadi. Matnni `src/content.mjs` va
`src/i18n.mjs` da o‘zgartiring.
