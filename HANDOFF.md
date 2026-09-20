# HANDOFF — tou.gg

**Holati (2026-09-20):** GoatCounter, HTTPS va Search Console **bajarildi**.
Qolgani — repolarni bittaga yig‘ish (§0) va Telegram/LinkedIn keshi (§4).

---

## 0. Ikkita repo bitta domenda ⚠️

Audit paytida chiqdi: **tou.gg aslida `maqsudjon-cell/tou` dan emas,
`maqsudjon-cell/pangea8-nothing` dan tarqatilyapti.** Ikkala repoda bir xil
commit tarixi bor, lekin GitHub Pages custom domain `tou.gg` — eskisida
(iyun oyidagi "pangea8 landing" testi qayta ishlatilgan).

Shu sababli `tou` ga push qilish saytni **umuman yangilamas edi**.

Hozircha men yangi kodni **ikkala repoga ham** yubordim, shuning uchun sayt
ishlaydi. Lekin uzoq muddatga bu chalkash: sayt "Source" havolasi `tou` ga
ko'rsatadi, domen esa boshqa repoda.

**Tavsiya — bittaga yig'ish (5 daqiqa, sizning qaroringiz):**

1. https://github.com/maqsudjon-cell/pangea8-nothing/settings/pages →
   **Custom domain** ni bo'shatib, **Save**.
2. https://github.com/maqsudjon-cell/tou/settings/pages →
   Source: **Deploy from a branch** → `main` / `(root)` → **Save**,
   Custom domain: `tou.gg` → **Save**.
3. Sertifikat chiqqach **Enforce HTTPS** (quyida 2-bandga qarang).
4. `pangea8-nothing` ni arxivlang yoki o'chiring.

Buni qilmaguningizcha **har o'zgarishdan keyin ikkala repoga ham push qiling**:

```bash
git push origin main && git push live main
```

(`live` remote allaqachon sozlangan: `git remote -v` bilan ko'rasiz.)

---

## 1. GoatCounter — ✅ BAJARILDI

`tou` kodi yaratildi, domen `tou.gg` qilib belgilandi, hisoblagich ishlayapti
(`/count` endi **200** qaytaryapti, ilgari 400 edi). Dashboard:
https://tou.goatcounter.com — boshqa saytlaringiz kabi **faqat login qilgan
foydalanuvchilar uchun**. Shu sababli saytning pastki qismidagi ommaviy
"Stats" havolasi olib tashlandi: mehmon uni bossa login oynasini ko‘rardi.

<details><summary>Ilgari nima bo‘lgan edi</summary>

`https://tou.goatcounter.com` mavjud emas edi: har bir sahifa ochilishi
**400** qaytarardi, ya’ni hech qanday tashrif yozilmasdi.

1. https://www.goatcounter.com/signup ga kiring (mavjud akkauntingiz bilan —
   `flarestamina`, `zedavlod` va h.k. o‘sha yerda).
2. **Add site** → code: `tou`
3. **Settings → Domain** ga `tou.gg` ni qo‘shing.
4. Tekshirish:

```bash
curl -sI "https://tou.goatcounter.com/count?p=/test" | head -1
```

`400` emas, `200` chiqsa — ishladi.
</details>

---

## 2. GitHub Pages HTTPS — ✅ BAJARILDI

`https_enforced` API orqali yoqildi (`pangea8-nothing` repo’sida — domen
o‘sha yerda). Tekshirildi:

```
http://tou.gg      → 301 https://tou.gg/
http://tou.gg/uz/  → 301
http://www.tou.gg  → 301
```

<details><summary>Ilgari nima bo‘lgan edi</summary>

`http://tou.gg` **301 bermasdi, 200 qaytarardi** — sayt shifrlanmagan HTTP
orqali ham ochilardi. SEO uchun dublikat, xavfsizlik uchun yomon.

1. https://github.com/maqsudjon-cell/tou/settings/pages
2. **Enforce HTTPS** — belgilang.
3. Tekshirish:

```bash
curl -sI http://tou.gg | head -2
```

`HTTP/1.1 301` va `location: https://tou.gg/` chiqishi kerak.

</details>

---

## 3. Google Search Console — ✅ BAJARILDI

- Resurs: **`https://tou.gg/`** (URL-prefiks), **HTML teg** usuli bilan
  tasdiqlandi. Token `src/content.mjs` da — **o‘chirmang**, Google uni
  qayta-qayta tekshiradi.
- **Sitemap yuborildi**: `https://tou.gg/sitemap.xml` → holati **“Muvaffaqiyatli”**
  (46 sahifa × 3 til, hreflang bilan).
- **Indekslash so‘raldi**: `/`, `/uz/`, `/ru/work/` emas — `/`, `/uz/`, `/work/`.
  Qolganini Google sitemap orqali o‘zi topadi.

Bir-ikki kundan keyin Search Console’da “Sahifalar” bo‘limiga qarang.

> Eslatma: **Domain resursi** (DNS TXT) qilinmadi — u Cloudflare’ga kirishni
> talab qiladi, brauzerda Cloudflare login qilinmagan. URL-prefiks resursi
> `https://tou.gg/` uchun yetarli. Keyinchalik `lab.tou.gg` kabi subdomenlar
> qo‘shsangiz, Domain resursini ham qo‘shib qo‘yish foydali.

<details><summary>Eski yo‘riqnoma (endi kerak emas)</summary>

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

</details>

---

## 4. Ijtimoiy tarmoq kartasi — qisman ⚠️

**Qilindi:** OG rasm qayta yasaldi va **yangi manzilga** qo‘yildi —
`/og-2026-09.jpg`. Ijtimoiy tarmoqlar rasmni **URL bo‘yicha** keshlaydi,
shuning uchun yangi manzil = yangi rasm. Eski `/og.jpg` ham joyida qoldi.

**Sizdan qolgani (login kerak, brauzerda kirilmagan):**

- **Telegram** — telefonda `@WebpageBot` ga `https://tou.gg` yuboring.
  Telegram *sahifani* keshlaydi, faqat shu bot tozalaydi. 10 soniyalik ish.
- **LinkedIn** — https://www.linkedin.com/post-inspector/ (login talab qiladi).
- **X** — alohida validator endi yo‘q, yangi post yozilganda o‘zi qayta oladi.

**Bio havolalari** — X, Instagram, Telegram, GitHub profil, Hugging Face’da
`tou.gg` ga o‘zgartiring.

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
