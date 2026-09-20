/**
 * tou.gg content model.
 *
 * Every string a visitor can read lives here, in three languages.
 * Pages are generated from this file by build.mjs — there is no second copy
 * of the copy anywhere in the repo.
 *
 * Numbers in `stats` and `products[].metric` were counted, not estimated.
 * See NOTES.md for how each one was verified and how to re-verify it.
 */

export const LOCALES = ["en", "uz", "ru"];
export const DEFAULT_LOCALE = "en";

export const site = {
  origin: "https://tou.gg",
  domain: "tou.gg",
  repo: "https://github.com/maqsudjon-cell/tou",
  name: "Maqsudjon Polatov",
  handle: "@toudotgg",
  role: { en: "Product engineer", uz: "Mahsulot muhandisi", ru: "Продуктовый инженер" },
  city: { en: "Tashkent", uz: "Toshkent", ru: "Ташкент" },
  email: "polatovmaqsudjon1@gmail.com",
  tel: "+998959059493",
  telDisplay: "+998 95 905 94 93",
  telegram: "https://t.me/toudotgg",
  x: "https://x.com/toudotgg",
  instagram: "https://instagram.com/toudotgg",
  github: "https://github.com/maqsudjon-cell",
  huggingface: "https://huggingface.co/Maqsudjonpolatov",
  dataset: "https://huggingface.co/datasets/Maqsudjonpolatov/uz-lexicon-skeleton",
  lab: "https://maqsudjon.com",
  goatcounter: "https://tou.goatcounter.com/count",
  stats_url: "https://tou.goatcounter.com",
  // Search Console, URL-prefix property https://tou.gg/, HTML-tag method.
  // Do not remove this once verified — Google re-checks it.
  googleSiteVerification: "On9oW2bT9G3wndosR-K_KcL85-D6v_XpetjXbPEVUaY",
  updated: "2026-09-20",
  // Bump with scripts/brand.py OG_VERSION when the share card changes.
  ogImage: "/og-2026-09.jpg",
};

/* Verified 2026-09-20. Re-verify: see NOTES.md §Numbers. */
export const stats = [
  { n: 15, label: { en: "live sites", uz: "ishlayotgan sayt", ru: "живых сайтов" } },
  { n: 191, label: { en: "public repos", uz: "ochiq repozitoriy", ru: "публичных репозиториев" } },
  { n: 3000, plus: true, label: { en: "commits", uz: "kommit", ru: "коммитов" } },
  { n: 144, label: { en: "IELTS tests live", uz: "jonli IELTS testi", ru: "тестов IELTS в проде" } },
  { n: 19, label: { en: "months solo", uz: "oy yakka o‘zim", ru: "месяцев соло" } },
];

export const tags = {
  education: { en: "Education", uz: "Ta’lim", ru: "Образование" },
  ai: { en: "AI & language", uz: "AI va til", ru: "AI и язык" },
  tools: { en: "Tools", uz: "Vositalar", ru: "Инструменты" },
  music: { en: "Music", uz: "Musiqa", ru: "Музыка" },
  steel: { en: "Code & steel", uz: "Kod va temir", ru: "Код и сталь" },
  client: { en: "Client work", uz: "Buyurtma ish", ru: "Клиентские" },
  studio: { en: "Studio", uz: "Studiya", ru: "Студия" },
  lab: { en: "Lab", uz: "Laboratoriya", ru: "Лаборатория" },
};

/**
 * Live sites. Order = the order they are shown.
 * `case: true` means a case study page is generated at /work/<slug>/.
 */
export const products = [
  {
    slug: "flarestamina",
    name: "FlareStamina",
    domain: "flarestamina.com",
    url: "https://flarestamina.com",
    tag: "education",
    hue: "#ff6b35",
    flagship: true,
    case: true,
    metric: { n: "144", label: { en: "tests live", uz: "test jonli", ru: "тестов в проде" } },
    dek: {
      en: "Free IELTS Academic platform. 144 timed mocks, AI writing feedback, a speaking lab. Teachers run it with a class.",
      uz: "Bepul IELTS Academic platformasi. 144 ta vaqtli mock, AI yozma tahlili, speaking laboratoriyasi. O‘qituvchilar sinf bilan ishlatadi.",
      ru: "Бесплатная платформа IELTS Academic. 144 теста на время, AI-разбор письма, speaking-лаб. Преподаватели ведут по ней группы.",
    },
    stack: ["Firebase", "Supabase", "PWA", "Claude API"],
    story: {
      problem: {
        en: "IELTS prep in Uzbekistan is paywalled, fragmented, and often a PDF dump. Teachers needed something they could actually run with a class. Students needed something they could open on a phone.",
        uz: "O‘zbekistonda IELTSga tayyorgarlik pullik, tarqoq, ko‘pincha shunchaki PDF uyumi. O‘qituvchiga sinfda ishlata oladigan narsa kerak edi. Talabaga telefonda ochiladigan narsa.",
        ru: "Подготовка к IELTS в Узбекистане — платная, разрозненная, часто просто свалка PDF. Преподавателю нужно было то, что можно вести с группой. Студенту — то, что открывается на телефоне.",
      },
      constraint: {
        en: "Solo. Welding days, Tashkent evenings. No content team. If a feature needed a babysitter, it would die the week I went back to the shop.",
        uz: "Yakka o‘zim. Kunduzi payvand, kechqurun Toshkent. Kontent jamoasi yo‘q. Agar funksiya doim qarovga muhtoj bo‘lsa, ustaxonaga qaytgan haftamda o‘lardi.",
        ru: "Один. Днём сварка, вечером Ташкент. Никакой контент-команды. Если фича требует няньки — она умрёт на той неделе, когда я вернусь в цех.",
      },
      shipped: {
        en: "144 tests in production and 10 tools. AI essay feedback. A speaking lab. A 40-day tracker. PWA. The login walls came down — most of it is free, because a wall in front of a practice test is just another fee.",
        uz: "Prodda 144 ta test va 10 ta vosita. AI esse tahlili. Speaking laboratoriyasi. 40 kunlik tracker. PWA. Login devorlari olib tashlandi — ko‘p qismi bepul, chunki mashq testi oldidagi devor ham bir turdagi to‘lov.",
        ru: "144 теста в проде и 10 инструментов. AI-фидбэк по эссе. Speaking-лаб. 40-дневный трекер. PWA. Стены логина убраны — почти всё бесплатно: стена перед пробным тестом это та же плата.",
      },
      hard: {
        en: "Scoring and content quality at volume, without a newsroom or a publishing house behind it. pangea8 is the rebrand case: the product outgrew the name.",
        uz: "Katta hajmda baholash va kontent sifati — orqada na tahririyat, na nashriyot bor. pangea8 — rebrending misoli: mahsulot nomdan o‘sib chiqdi.",
        ru: "Оценка и качество контента на объёме, без редакции и издательства за спиной. pangea8 — кейс ребрендинга: продукт перерос имя.",
      },
    },
  },
  {
    slug: "ailenta",
    name: "AI Lenta",
    domain: "ailenta.uz",
    url: "https://ailenta.uz",
    tag: "ai",
    hue: "#00d4ff",
    flagship: true,
    case: true,
    metric: { n: "24", label: { en: "sources, unattended", uz: "manba, qarovsiz", ru: "источника, без няньки" } },
    dek: {
      en: "Uzbek AI news wire. 24 sources, LLM summaries on a schedule, every item cites the original. Nobody in the loop.",
      uz: "O‘zbekcha AI yangiliklar lentasi. 24 manba, jadval bo‘yicha LLM xulosalari, har bir xabar manbaga havola qiladi. Jarayonda odam yo‘q.",
      ru: "Узбекская AI-новостная лента. 24 источника, LLM-сводки по расписанию, каждая заметка ссылается на оригинал. Человека в цикле нет.",
    },
    stack: ["Claude API", "Cron", "RSS", "Telegram"],
    story: {
      problem: {
        en: "Uzbek AI news is either a Russian translation with the names left in, or nothing. People who want a wire in their own language get a Facebook dump.",
        uz: "O‘zbekcha AI yangiliklari yo ismlari tarjima qilinmagan ruscha ko‘chirma, yo umuman yo‘q. O‘z tilida lenta istaganlar Facebook uyumini oladi.",
        ru: "Узбекские AI-новости — это либо перевод с русского с непереведёнными именами, либо ничего. Кто хочет ленту на своём языке, получает свалку из Facebook.",
      },
      constraint: {
        en: "I cannot sit on a news desk. It has to publish while I am on a balcony with a grinder in my hand.",
        uz: "Men tahririyatda o‘tira olmayman. U men qo‘limda bolgarka bilan balkonda turganimda ham chiqishi kerak.",
        ru: "Я не могу сидеть в редакции. Лента должна выходить, пока я на балконе с болгаркой в руках.",
      },
      shipped: {
        en: "24 sources. Scheduled LLM summaries. Every item linked to the original. RSS and Telegram. Nobody in the loop once the pipeline is up.",
        uz: "24 manba. Jadval bo‘yicha LLM xulosalari. Har bir xabar asl manbaga bog‘langan. RSS va Telegram. Quvur ishga tushgach, jarayonda odam qolmaydi.",
        ru: "24 источника. LLM-сводки по расписанию. Каждая заметка со ссылкой на оригинал. RSS и Telegram. После запуска пайплайна человека в цикле нет.",
      },
      hard: {
        en: "Uzbek LLM quality. A summary that invents a source is worse than silence. The link back to the original is the load-bearing wall.",
        uz: "O‘zbek tilida LLM sifati. Manbani o‘ylab topgan xulosa sukutdan yomonroq. Asl manbaga havola — bu yuk ko‘taruvchi devor.",
        ru: "Качество LLM на узбекском. Сводка, выдумавшая источник, хуже молчания. Ссылка на оригинал — несущая стена.",
      },
    },
  },
  {
    slug: "chertma",
    name: "Chertma",
    domain: "chertma.maqsudjon.com",
    url: "https://chertma.maqsudjon.com",
    tag: "ai",
    hue: "#00ff88",
    flagship: true,
    case: true,
    metric: { n: "4.89M", label: { en: "word forms, open", uz: "so‘z shakli, ochiq", ru: "словоформ, открыто" } },
    // Chertma shows itself working: the ASCII a keyboard can type, corrected
    // in place to the New Latin it should have been.
    demo: { from: "to'g'ri o'zbekcha", to: "to‘g‘ri o‘zbekcha", label: "ascii → ş ç ö ğ" },
    dek: {
      en: "Type ASCII, get correct Uzbek New Latin — ş ç ö ğ. Offline. An open 28-million-row lexicon underneath.",
      uz: "ASCII yozing — to‘g‘ri o‘zbek yangi lotinini oling: ş ç ö ğ. Oflayn. Ostida 28 million qatorli ochiq leksikon.",
      ru: "Печатаешь ASCII — получаешь правильную узбекскую новую латиницу: ş ç ö ğ. Офлайн. Под ним открытый лексикон на 28 млн строк.",
    },
    stack: ["Vanilla JS", "Telegram bot", "Hugging Face"],
    links: [
      { label: "@Chertmabot", url: "https://t.me/chertmabot" },
      { label: "uz-lexicon-skeleton", url: "https://huggingface.co/datasets/Maqsudjonpolatov/uz-lexicon-skeleton" },
    ],
    story: {
      problem: {
        en: "Uzbek New Latin (ş ç ö ğ) is a pain on a normal keyboard. People skip the marks. Search breaks. Keyboards pretend the language is ASCII.",
        uz: "Oddiy klaviaturada o‘zbek yangi lotini (ş ç ö ğ) azob. Odamlar belgilarni tashlab ketadi. Qidiruv buziladi. Klaviaturalar tilni ASCII deb o‘ylaydi.",
        ru: "Узбекская новая латиница (ş ç ö ğ) на обычной клавиатуре — мучение. Люди пропускают знаки. Поиск ломается. Клавиатуры делают вид, что язык — это ASCII.",
      },
      constraint: {
        en: "Keyboard in, marks out. No install, no account, works with the plane in airplane mode.",
        uz: "Klaviaturadan kiradi, belgilar bilan chiqadi. O‘rnatish yo‘q, akkaunt yo‘q, samolyot rejimida ham ishlaydi.",
        ru: "Вошло с клавиатуры — вышло со знаками. Без установки, без аккаунта, работает в авиарежиме.",
      },
      shipped: {
        en: "A converter, a Telegram bot, and a dataset: 4.89M word forms, 23.2M bigrams, a skeleton index for keyboard-indistinguishable forms. CC BY 4.0. The dataset feeds the tool.",
        uz: "Konvertor, Telegram bot va dataset: 4,89 mln so‘z shakli, 23,2 mln bigramma, klaviaturada farqlanmaydigan shakllar uchun skelet indeks. CC BY 4.0. Dataset vositani oziqlantiradi.",
        ru: "Конвертер, Telegram-бот и датасет: 4,89 млн словоформ, 23,2 млн биграмм, скелет-индекс для неразличимых на клавиатуре форм. CC BY 4.0. Датасет кормит инструмент.",
      },
      hard: {
        en: "Keyboard-indistinguishable forms. The skeleton index is the product. The bot is only the door.",
        uz: "Klaviaturada farqlanmaydigan shakllar. Asl mahsulot — skelet indeks. Bot faqat eshik.",
        ru: "Формы, неразличимые на клавиатуре. Продукт — это скелет-индекс. Бот только дверь.",
      },
    },
  },
  {
    slug: "nullsample",
    name: "Nullsample",
    domain: "nullsample.maqsudjon.com",
    url: "https://nullsample.maqsudjon.com",
    tag: "music",
    hue: "#c084fc",
    case: true,
    metric: { n: "6", label: { en: "stems, zero samples", uz: "stem, nol sempl", ru: "стема, ноль сэмплов" } },
    dek: {
      en: "Music from code. Zero samples, six stems, same seed = same track. Source public.",
      uz: "Koddan musiqa. Nol sempl, olti stem, bir xil seed = bir xil trek. Manba ochiq.",
      ru: "Музыка из кода. Ноль сэмплов, шесть стемов, тот же seed = тот же трек. Исходник открыт.",
    },
    stack: ["Web Audio", "AGPL-3.0"],
    story: {
      problem: {
        en: "Most ‘generative music’ is a sample pack with a seed on top. You cannot hear how it was made, and you cannot make it again.",
        uz: "Ko‘pchilik ‘generativ musiqa’ — ustiga seed qo‘yilgan sempl to‘plami. Qanday yasalganini eshitib bo‘lmaydi, qaytadan yasab ham bo‘lmaydi.",
        ru: "Большинство «генеративной музыки» — это сэмпл-пак с seed сверху. Не слышно, как это сделано, и повторить нельзя.",
      },
      constraint: {
        en: "Zero samples. Seed-reproducible. In the browser. Source public.",
        uz: "Nol sempl. Seed bo‘yicha qayta takrorlanadi. Brauzerda. Manba ochiq.",
        ru: "Ноль сэмплов. Воспроизводимо по seed. В браузере. Исходник открыт.",
      },
      shipped: {
        en: "Six stems. Web Audio. Same seed, same track, every time. AGPL-3.0 — the code is the instrument.",
        uz: "Olti stem. Web Audio. Bir xil seed — har safar bir xil trek. AGPL-3.0 — kodning o‘zi asbob.",
        ru: "Шесть стемов. Web Audio. Тот же seed — тот же трек, каждый раз. AGPL-3.0 — код и есть инструмент.",
      },
      hard: {
        en: "Seed-deterministic audio that still sounds like a track, not a demo of Math.random().",
        uz: "Seedga bog‘liq deterministik audio, lekin baribir trekdek yangraydi — Math.random() demosi emas.",
        ru: "Детерминированное по seed аудио, которое всё-таки звучит как трек, а не как демо Math.random().",
      },
    },
  },
  {
    slug: "tadam",
    name: "Tadam",
    domain: "tadam.uz",
    url: "https://tadam.uz",
    tag: "tools",
    hue: "#ffb347",
    case: true,
    metric: { n: "1", label: { en: "QR, no app", uz: "QR, ilovasiz", ru: "QR, без приложения" } },
    dek: {
      en: "Wedding photos in one album. One QR, no app, no signup. Used at a real wedding the week it shipped.",
      uz: "To‘y suratlari bitta albomda. Bitta QR, ilova yo‘q, ro‘yxatdan o‘tish yo‘q. Chiqqan haftasidayoq haqiqiy to‘yda ishlatildi.",
      ru: "Свадебные фото в одном альбоме. Один QR, без приложения, без регистрации. На настоящей свадьбе в неделю запуска.",
    },
    stack: ["Cloudflare Workers", "R2", "No signup"],
    story: {
      problem: {
        en: "A wedding produces a thousand photos on a hundred cameras. Someone makes a WhatsApp group. The album dies in six threads.",
        uz: "Bitta to‘y yuzta kamerada mingta surat qoldiradi. Kimdir WhatsApp guruh ochadi. Albom olti xil chatda yo‘qoladi.",
        ru: "Свадьба — это тысяча фото на сотне камер. Кто-то создаёт группу в WhatsApp. Альбом умирает в шести переписках.",
      },
      constraint: {
        en: "No app store. No signup. No database bill. One QR on the table, because that is what a guest will actually scan.",
        uz: "App Store yo‘q. Ro‘yxatdan o‘tish yo‘q. Baza uchun hisob yo‘q. Stol ustida bitta QR — mehmon aynan shuni skanerlaydi.",
        ru: "Никакого стора. Никакой регистрации. Никакого счёта за базу. Один QR на столе — именно его гость и правда отсканирует.",
      },
      shipped: {
        en: "Guests drop photos into one album. Export the whole thing as one file. Used at a real wedding the week it shipped.",
        uz: "Mehmonlar suratlarni bitta albomga tashlaydi. Hammasini bitta fayl qilib yuklab olasiz. Chiqqan haftasida haqiqiy to‘yda ishlatildi.",
        ru: "Гости скидывают фото в один альбом. Выгрузка — одним файлом. На настоящей свадьбе в неделю запуска.",
      },
      hard: {
        en: "A no-app photo album that does not become a graveyard of accounts. If the guest has to install something, you already lost.",
        uz: "Ilovasiz albom, lekin akkauntlar qabristoniga aylanmasligi kerak. Mehmon biror narsa o‘rnatishi kerak bo‘lsa, siz allaqachon yutqazgansiz.",
        ru: "Альбом без приложения, который не превращается в кладбище аккаунтов. Если гостю надо что-то установить — вы уже проиграли.",
      },
    },
  },
  {
    slug: "kvadrat",
    name: "KVADRAT",
    domain: "kvdrt.maqsudjon.com",
    url: "https://kvdrt.maqsudjon.com",
    tag: "steel",
    hue: "#7dd3fc",
    case: true,
    metric: { n: "m²", label: { en: "priced on site", uz: "obyektda hisoblanadi", ru: "считается на объекте" } },
    dek: {
      en: "m² calculator for window grilles. Free-text Uzbek and Russian. Offline, PDF out. Built for the shop I work in.",
      uz: "Panjaralar uchun m² hisoblagich. O‘zbekcha va ruscha erkin matn. Oflayn, PDF chiqaradi. O‘zim ishlaydigan ustaxona uchun qilingan.",
      ru: "Калькулятор m² для оконных решёток. Свободный текст на узбекском и русском. Офлайн, вывод в PDF. Сделан для цеха, где я работаю.",
    },
    stack: ["Free-text parser", "PDF", "Offline"],
    story: {
      problem: {
        en: "Welders price window grilles on paper, then argue about square metres on site. The calculator on the phone is a notes app and a guess.",
        uz: "Payvandchilar panjara narxini qog‘ozda hisoblaydi, keyin obyektda kvadrat metr ustida tortishadi. Telefondagi ‘hisoblagich’ — bu bloknot va taxmin.",
        ru: "Сварщики считают решётки на бумаге, потом спорят о квадратных метрах на объекте. «Калькулятор» в телефоне — это заметки и догадка.",
      },
      constraint: {
        en: "Offline. Dusty phones. Uzbek and Russian free text. Built for people who were doing this on paper — including me.",
        uz: "Oflayn. Changli telefonlar. O‘zbekcha va ruscha erkin matn. Buni qog‘ozda qilib yurganlar uchun — shu jumladan o‘zim uchun.",
        ru: "Офлайн. Пыльные телефоны. Свободный текст на узбекском и русском. Для тех, кто делал это на бумаге — включая меня.",
      },
      shipped: {
        en: "Type the opening, get the m² and a PDF quote. Used on actual jobs, not as a portfolio toy.",
        uz: "O‘lchamni yozasiz — m² va PDF hisob-kitob chiqadi. Portfolio o‘yinchog‘i emas, haqiqiy buyurtmalarda ishlatiladi.",
        ru: "Вводишь проём — получаешь m² и PDF-смету. Используется на реальных заказах, а не как игрушка для портфолио.",
      },
      hard: {
        en: "Parsing “2.1 ga 1.4, 6 dona, tepa 15” into a quote without a form wizard the shop will never fill in.",
        uz: "“2.1 ga 1.4, 6 dona, tepa 15” ni hisob-kitobga aylantirish — ustaxona hech qachon to‘ldirmaydigan forma sehrgarisiz.",
        ru: "Разобрать «2.1 ga 1.4, 6 dona, tepa 15» в смету — без мастера форм, который в цеху никто не заполнит.",
      },
    },
  },
  {
    slug: "davomat",
    name: "Davomat",
    domain: "davomat.maqsudjon-polatov.workers.dev",
    url: "https://davomat.maqsudjon-polatov.workers.dev",
    tag: "education",
    hue: "#2dd4bf",
    beta: true,
    dek: {
      en: "Attendance for university group monitors, inside Telegram. 25 students marked in under a minute, offline-safe.",
      uz: "Guruh sardorlari uchun yo‘qlama — Telegram ichida. 25 talaba bir daqiqadan kam vaqtda, oflaynda ham ishlaydi.",
      ru: "Посещаемость для старост, прямо в Telegram. 25 студентов меньше чем за минуту, работает офлайн.",
    },
  },
  {
    slug: "chzq",
    name: "Chiziq / CHZQ",
    domain: "chzq.uz",
    url: "https://chzq.uz",
    tag: "studio",
    hue: "#22d3ee",
    dek: {
      en: "Productised web studio: fixed scopes, fixed prices, live portfolio in an iframe instead of screenshots.",
      uz: "Mahsulotlashtirilgan veb-studiya: aniq hajm, aniq narx, skrinshot emas — iframe’dagi jonli portfolio.",
      ru: "Продуктизированная веб-студия: фиксированный объём, фиксированная цена, живое портфолио в iframe вместо скриншотов.",
    },
  },
  {
    slug: "pierics",
    name: "Pierics",
    domain: "pierics.com",
    url: "https://pierics.com",
    tag: "education",
    hue: "#fb7185",
    dek: {
      en: "Daily IELTS vocabulary game. One round a day, no account.",
      uz: "Har kunlik IELTS lug‘at o‘yini. Kuniga bitta raund, akkauntsiz.",
      ru: "Ежедневная игра на лексику IELTS. Один раунд в день, без аккаунта.",
    },
  },
  {
    slug: "minnos",
    name: "Minnos",
    domain: "minnos.cc",
    url: "https://minnos.cc",
    tag: "education",
    hue: "#fbbf24",
    dek: {
      en: "26 English cat idioms, with audio, explained in Uzbek.",
      uz: "26 ta inglizcha mushuk iborasi — audio bilan, o‘zbekcha izohlangan.",
      ru: "26 английских «кошачьих» идиом с аудио, с объяснением на узбекском.",
    },
  },
  {
    slug: "zedavlod",
    name: "ZED AVLOD School",
    domain: "zedavlod.uz",
    url: "https://zedavlod.uz",
    tag: "client",
    hue: "#34d399",
    dek: {
      en: "Language school in To‘raqo‘rg‘on. English, IELTS, CEFR, Ibrat, DTM. Real results, no invented ones.",
      uz: "To‘raqo‘rg‘ondagi til markazi. Ingliz tili, IELTS, CEFR, Ibrat, DTM. Natijalar haqiqiy, o‘ylab topilgani yo‘q.",
      ru: "Языковая школа в Тюракургане. Английский, IELTS, CEFR, Ibrat, DTM. Результаты настоящие, выдуманных нет.",
    },
  },
  {
    slug: "ctnlc",
    name: "CTN Language Centre",
    domain: "ctnlc.uz",
    url: "https://ctnlc.uz",
    tag: "client",
    hue: "#60a5fa",
    dek: {
      en: "Tashkent language centre. A1–C1, IELTS intensive, kids, speaking club. Trilingual, one file.",
      uz: "Toshkentdagi til markazi. A1–C1, IELTS intensiv, bolalar, speaking klub. Uch tilli, bitta fayl.",
      ru: "Языковой центр в Ташкенте. A1–C1, интенсив IELTS, дети, speaking club. Три языка, один файл.",
    },
  },
  {
    slug: "payvandchi",
    name: "Payvandchi",
    domain: "payvandchi.maqsudjon.com",
    url: "https://payvandchi.maqsudjon.com",
    tag: "steel",
    hue: "#f97316",
    dek: {
      en: "Catalogue for the metal workshop. Grilles, railings, canopies — photographed on the job, not staged.",
      uz: "Temirchilik ustaxonasi katalogi. Panjara, panjaralik, soyabon — obyektda suratga olingan, sahnalashtirilmagan.",
      ru: "Каталог металлоцеха. Решётки, перила, навесы — сняты на объекте, не постановочно.",
    },
  },
  {
    slug: "reshotkachi",
    name: "Reshotkachi",
    domain: "reshotkachi.maqsudjon.com",
    url: "https://reshotkachi.maqsudjon.com",
    tag: "steel",
    hue: "#94a3b8",
    dek: {
      en: "Second grille catalogue, Russian-first, built as a 3D wall of 123 real photos.",
      uz: "Ikkinchi panjara katalogi, ruschaga mo‘ljallangan, 123 ta haqiqiy surat 3D devor sifatida.",
      ru: "Второй каталог решёток, по-русски, собран как 3D-стена из 123 настоящих фото.",
    },
  },
  {
    slug: "maqsudjon",
    name: "maqsudjon.com",
    domain: "maqsudjon.com",
    url: "https://maqsudjon.com",
    tag: "lab",
    hue: "#e6edf3",
    dek: {
      en: "The lab and the build log. Long-form notes on every ship, in English and Uzbek.",
      uz: "Laboratoriya va build log. Har bir chiqarilgan ish haqida uzun yozuvlar — inglizcha va o‘zbekcha.",
      ru: "Лаборатория и build log. Длинные заметки по каждому релизу, на английском и узбекском.",
    },
  },
];

export const posts = [
  {
    slug: "why-tou",
    date: "2026-09-19",
    title: {
      en: "Why a three-letter .gg",
      uz: "Nega uch harfli .gg",
      ru: "Почему трёхбуквенный .gg",
    },
    dek: {
      en: "maqsudjon.com stays the lab. tou.gg is the front door.",
      uz: "maqsudjon.com laboratoriya bo‘lib qoladi. tou.gg — kirish eshigi.",
      ru: "maqsudjon.com остаётся лабораторией. tou.gg — парадная дверь.",
    },
    body: {
      en: [
        "I already had a site. maqsudjon.com is the lab — the ASCII engine, the build log, the long name on the certificate. It is a good lab. It is a bad front door.",
        "I wanted a shape that does not pin the work to a country or to one product. Three letters and a neutral TLD do that. A course, a tool, a stream can all live under it, and the root still means the person.",
        "TOU is “to you.” The work is pointed at a student in Namangan, a welder pricing a grille, a guest at a wedding with a phone full of photos. Not at a category. Not at an “ecosystem.”",
        ".uz is home, and I will keep shipping .uz products. .gg is the handshake for everything else — lab.tou.gg, chat.tou.gg, whatever gets built next, without renaming the person every six months.",
        "pangea8 became FlareStamina because a product should be allowed to grow a real name. The umbrella should not have to. That is why this domain is three letters and a joke that is not a joke: shipped to you.",
      ],
      uz: [
        "Mening saytim allaqachon bor edi. maqsudjon.com — laboratoriya: ASCII dvigateli, build log, sertifikatdagi uzun ism. Laboratoriya sifatida yaxshi. Kirish eshigi sifatida yomon.",
        "Menga ishni na mamlakatga, na bitta mahsulotga bog‘lab qo‘ymaydigan shakl kerak edi. Uch harf va neytral domen zonasi shuni beradi. Kurs ham, vosita ham, striming ham shu ostida yashaydi, ildiz esa baribir odamni bildiradi.",
        "TOU — bu “to you”, ya’ni “sizga”. Ish Namangandagi talabaga, panjara narxini hisoblayotgan payvandchiga, telefoni to‘y suratlariga to‘lgan mehmonga qaratilgan. Kategoriyaga emas. “Ekotizim”ga emas.",
        ".uz — uy, va men .uz mahsulotlarini chiqaraveraman. .gg — qolgan hammasi uchun qo‘l berish: lab.tou.gg, chat.tou.gg, keyin nima qurilsa ham — har olti oyda odamning nomini o‘zgartirmasdan.",
        "pangea8 FlareStaminaga aylandi, chunki mahsulotga haqiqiy nom o‘sib chiqishga ruxsat berish kerak. Soyabonga esa shart emas. Shuning uchun bu domen uch harf va hazilga o‘xshagan rost: sizga yetkazildi.",
      ],
      ru: [
        "У меня уже был сайт. maqsudjon.com — это лаборатория: ASCII-движок, build log, длинное имя на сертификате. Как лаборатория — хорошо. Как парадная дверь — плохо.",
        "Мне нужна была форма, которая не привязывает работу ни к стране, ни к одному продукту. Три буквы и нейтральная зона это дают. Курс, инструмент, стрим — всё живёт под ней, а корень по-прежнему означает человека.",
        "TOU — это «to you», «вам». Работа направлена на студента в Намангане, на сварщика, который считает решётку, на гостя свадьбы с телефоном, полным фото. Не на категорию. Не на «экосистему».",
        ".uz — это дом, и я продолжу выпускать .uz-продукты. .gg — рукопожатие для всего остального: lab.tou.gg, chat.tou.gg, что угодно следующее — без переименования человека каждые полгода.",
        "pangea8 стал FlareStamina, потому что продукту нужно разрешать вырастить настоящее имя. Зонтику — не обязательно. Поэтому домен из трёх букв и шутка, которая не шутка: доставлено вам.",
      ],
    },
  },
  {
    slug: "code-and-steel",
    date: "2026-09-19",
    title: {
      en: "Code and steel",
      uz: "Kod va temir",
      ru: "Код и сталь",
    },
    dek: {
      en: "The workshop is the engineering school. Measure, join, load-test the seam.",
      uz: "Ustaxona — muhandislik maktabi. O‘lchang, ulang, chokni yuk bilan sinang.",
      ru: "Цех — это инженерная школа. Замерь, соедини, нагрузи шов.",
    },
    body: {
      en: [
        "The shop is loud. Steel does not autocomplete. You measure the opening. You cut. You tack. You check the square. You run the seam. Then you hang your weight on it — or you do not ship it to a balcony on the fifth floor.",
        "That is the whole engineering loop. Software pretends the loop is optional, because the failure is a 500 and not a railing that lets go.",
        "I weld during the day in Tashkent. I specify for agents at night. The method is the same: write the joint, inspect the bead, load-test. If the agent hallucinated a library, that is a cold shut — grind it out, run it again.",
        "People treat the welding as a plot twist. It is the school. The useful diploma is the habit of not shipping a seam you would not stand on.",
      ],
      uz: [
        "Ustaxona shovqinli. Temirda avtoto‘ldirish yo‘q. O‘lchaysiz. Kesasiz. Nuqtalab ulaysiz. Burchakni tekshirasiz. Chokni yurgizasiz. Keyin unga o‘z vazningizni osasiz — yo beshinchi qavat balkoniga chiqarmaysiz.",
        "Muhandislik sikli — shundan iborat. Dasturiy ta’minot bu siklni ixtiyoriy deb ko‘rsatadi, chunki u yerdagi nosozlik — 500 xatosi, qo‘yib yuboradigan panjara emas.",
        "Kunduzi Toshkentda payvand qilaman. Kechqurun agentlarga spetsifikatsiya yozaman. Usul bir xil: chokni yozing, ulanishni tekshiring, yuk bilan sinang. Agent kutubxonani o‘ylab topgan bo‘lsa — bu ‘sovuq chok’: kesib tashlang va qaytadan yurgizing.",
        "Odamlar payvandchilikni kutilmagan burilish deb qabul qiladi. Aslida u maktab. Foydali diplom — o‘zing turolmaydigan chokni chiqarmaslik odati.",
      ],
      ru: [
        "В цеху шумно. У стали нет автодополнения. Ты замеряешь проём. Режешь. Прихватываешь. Проверяешь угол. Ведёшь шов. Потом виснешь на нём всем весом — или не отправляешь его на балкон пятого этажа.",
        "Это и есть весь инженерный цикл. Софт делает вид, что цикл необязателен, потому что отказ — это 500, а не перила, которые отпустили.",
        "Днём я варю в Ташкенте. Ночью пишу спецификации для агентов. Метод тот же: напиши шов, осмотри валик, нагрузи. Если агент выдумал библиотеку — это непровар: вырезать и пройти заново.",
        "Сварку воспринимают как сюжетный поворот. Это школа. Полезный диплом — привычка не сдавать шов, на котором сам не встанешь.",
      ],
    },
  },
];

/* Long-form archive, published on the lab. Titles are not translated: they are the titles. */
export const outbound = [
  { date: "2026-08-27", title: "Tadam: a wedding album with no app and no database", url: "https://maqsudjon.com/log/log-2026-08-27-tadam-wedding-photo-album.html" },
  { date: "2026-08-27", title: "Seven sites in six weeks", url: "https://maqsudjon.com/log/log-2026-08-27-seven-sites-six-weeks.html" },
  { date: "2026-08-24", title: "FlareStamina — login walls came down", url: "https://maqsudjon.com/log/log-2026-08-24-flarestamina-walls-hub-news-tools.html" },
  { date: "2026-08-22", title: "Rebuilt FlareStamina in a weekend, deleted the framework", url: "https://maqsudjon.com/log/log-2026-08-22-flarestamina-paper-redesign.html" },
  { date: "2026-08-07", title: "KVADRAT", url: "https://maqsudjon.com/log/log-2026-08-07-kvadrat-calculator.html" },
  { date: "2026-08-04", title: "Reshotkachi, second build", url: "https://maqsudjon.com/log/log-2026-08-04-reshotkachi-second-build.html" },
  { date: "2026-08-01", title: "Payvandchi workshop online", url: "https://maqsudjon.com/log/log-2026-08-01-payvandchi-workshop.html" },
  { date: "2026-07-25", title: "Chiziq web studio", url: "https://maqsudjon.com/log/log-2026-07-25-chiziq-web-studio.html" },
  { date: "2026-07-23", title: "Zed Avlod school", url: "https://maqsudjon.com/log/log-2026-07-23-zed-avlod-school.html" },
  { date: "2026-07-21", title: "CTN Language Centre", url: "https://maqsudjon.com/log/log-2026-07-21-ctn-language-centre.html" },
  { date: "2026-07-10", title: "pangea8 is now FlareStamina", url: "https://maqsudjon.com/log/log-2026-07-10-pangea8-is-now-flarestamina.html" },
];

export const languages = [
  {
    native: "O‘zbekcha", latin: { en: "Uzbek", uz: "O‘zbek", ru: "Узбекский" }, cefr: "C2", fill: 100, hue: "#00ff88",
    badge: { en: "Native", uz: "Ona tili", ru: "Родной" },
    story: { en: "Working language of the LLM pipelines", uz: "LLM quvurlarining ish tili", ru: "Рабочий язык LLM-пайплайнов" },
    sample: "Mendan — sizga. Chertma imloni tuzatadi, shevani emas.",
  },
  {
    native: "English", latin: { en: "English", uz: "Ingliz", ru: "Английский" }, cefr: "B2", fill: 72, hue: "#ff6b35",
    badge: { en: "IELTS 6.0", uz: "IELTS 6.0", ru: "IELTS 6.0" },
    story: { en: "12 Aug 2026 · L6.0 · R5.0 · W5.5 · S6.5", uz: "2026-yil 12-avgust · L6.0 · R5.0 · W5.5 · S6.5", ru: "12 авг 2026 · L6.0 · R5.0 · W5.5 · S6.5" },
    sample: "I weld metal by day. I ship software by night.",
  },
  {
    native: "한국어", latin: { en: "Korean", uz: "Koreys", ru: "Корейский" }, cefr: "A2", fill: 38, hue: "#ff4d8d",
    badge: { en: "TOPIK 2", uz: "TOPIK 2", ru: "TOPIK 2" },
    story: { en: "Certificate, 2023", uz: "Sertifikat, 2023", ru: "Сертификат, 2023" },
    sample: "안녕하세요. 타슈켄트에서 왔습니다.",
  },
  {
    native: "Русский", latin: { en: "Russian", uz: "Rus", ru: "Русский" }, cefr: "A2", fill: 25, hue: "#8b9cb3",
    badge: { en: "Receptive", uz: "Tushunaman", ru: "Пассивный" },
    story: { en: "Workplace and reading", uz: "Ish joyida va o‘qishda", ru: "Работа и чтение" },
    sample: "Понимаю. Говорю мало.",
  },
  {
    native: "中文", latin: { en: "Chinese", uz: "Xitoy", ru: "Китайский" }, cefr: "A0", fill: 4, hue: "#ffb347", live: true,
    badge: { en: "Day", uz: "Kun", ru: "День" },
    story: { en: "Started 19 Sep 2026", uz: "2026-yil 19-sentabrda boshlandi", ru: "Начал 19 сен 2026" },
    sample: "你好。我是马苏德。",
  },
];

export const cv = {
  summary: {
    en: "Independent product engineer. I direct AI coding agents end to end — spec, architecture, build, DNS and TLS, operations. Fifteen live sites in nineteen months while welding full-time in Tashkent. Flagship: FlareStamina, a free IELTS Academic platform with 144 tests in production.",
    uz: "Mustaqil mahsulot muhandisi. AI kod agentlarini boshdan oxirigacha boshqaraman — spetsifikatsiya, arxitektura, qurilish, DNS va TLS, ekspluatatsiya. Toshkentda to‘liq stavkada payvandchi bo‘lib ishlagan holda 19 oyda 15 ta jonli sayt. Asosiysi: FlareStamina — 144 ta testi prodda ishlayotgan bepul IELTS Academic platformasi.",
    ru: "Независимый продуктовый инженер. Веду AI-агентов от начала до конца — спецификация, архитектура, сборка, DNS и TLS, эксплуатация. Пятнадцать живых сайтов за девятнадцать месяцев, работая сварщиком на полную ставку в Ташкенте. Флагман: FlareStamina — бесплатная платформа IELTS Academic со 144 тестами в проде.",
  },
  jobs: [
    {
      role: { en: "Independent product engineer", uz: "Mustaqil mahsulot muhandisi", ru: "Независимый продуктовый инженер" },
      org: { en: "tou.gg · Tashkent / remote", uz: "tou.gg · Toshkent / masofadan", ru: "tou.gg · Ташкент / удалённо" },
      period: { en: "2025 — present", uz: "2025 — hozirgacha", ru: "2025 — настоящее время" },
      points: {
        en: [
          "Shipped 15 live sites in 19 months while welding full-time.",
          "Direct AI coding agents end to end: spec, architecture, build, DNS/TLS, operations.",
          "FlareStamina: 144 IELTS Academic tests in production, AI writing feedback, speaking lab. Most of it is free.",
          "AI Lenta: unattended Uzbek news wire, 24 sources, every item cites the original.",
          "Open-sourced uz-lexicon-skeleton (28,052,730 rows, CC BY 4.0) to back Chertma.",
        ],
        uz: [
          "To‘liq stavkada payvandchi bo‘lib ishlagan holda 19 oyda 15 ta jonli sayt chiqardim.",
          "AI kod agentlarini boshdan oxirigacha boshqaraman: spetsifikatsiya, arxitektura, qurilish, DNS/TLS, ekspluatatsiya.",
          "FlareStamina: prodda 144 ta IELTS Academic testi, AI yozma tahlili, speaking laboratoriyasi. Katta qismi bepul.",
          "AI Lenta: qarovsiz ishlaydigan o‘zbek yangiliklar lentasi, 24 manba, har bir xabar manbaga havola qiladi.",
          "Chertma ostida turadigan uz-lexicon-skeleton (28 052 730 qator, CC BY 4.0) ochiq kodga chiqarildi.",
        ],
        ru: [
          "Выпустил 15 живых сайтов за 19 месяцев, работая сварщиком на полную ставку.",
          "Веду AI-агентов от начала до конца: спецификация, архитектура, сборка, DNS/TLS, эксплуатация.",
          "FlareStamina: 144 теста IELTS Academic в проде, AI-фидбэк по письму, speaking-лаб. Большая часть бесплатна.",
          "AI Lenta: узбекская новостная лента без оператора, 24 источника, каждая заметка со ссылкой на оригинал.",
          "Выложил в открытый доступ uz-lexicon-skeleton (28 052 730 строк, CC BY 4.0) как основу Chertma.",
        ],
      },
    },
    {
      role: { en: "Metal fabricator", uz: "Payvandchi / temirchi", ru: "Сварщик по металлу" },
      org: { en: "Workshop · Tashkent", uz: "Ustaxona · Toshkent", ru: "Цех · Ташкент" },
      period: { en: "2023 — present", uz: "2023 — hozirgacha", ru: "2023 — настоящее время" },
      points: {
        en: [
          "Design, fabricate and install window grilles, balcony railings and canopies.",
          "Built KVADRAT — an offline m² calculator used on actual jobs, not as a demo.",
        ],
        uz: [
          "Panjara, balkon panjaraligi va soyabonlarni loyihalash, yasash va o‘rnatish.",
          "KVADRAT yasadim — demo emas, haqiqiy buyurtmalarda ishlatiladigan oflayn m² hisoblagich.",
        ],
        ru: [
          "Проектирую, изготавливаю и монтирую решётки, балконные перила и навесы.",
          "Сделал KVADRAT — офлайн-калькулятор m², который используется на реальных заказах, а не как демо.",
        ],
      },
    },
  ],
  education: [
    {
      title: { en: "BA English Philology", uz: "Ingliz filologiyasi (bakalavr)", ru: "Бакалавриат: английская филология" },
      org: { en: "AIFU, Tashkent · 1st year, evening", uz: "AIFU, Toshkent · 1-kurs, kechki", ru: "AIFU, Ташкент · 1 курс, вечернее" },
      period: { en: "2026 —", uz: "2026 —", ru: "2026 —" },
    },
    {
      title: { en: "IELTS Academic 6.0", uz: "IELTS Academic 6.0", ru: "IELTS Academic 6.0" },
      org: { en: "CEFR B2 · L 6.0 · R 5.0 · W 5.5 · S 6.5", uz: "CEFR B2 · L 6.0 · R 5.0 · W 5.5 · S 6.5", ru: "CEFR B2 · L 6.0 · R 5.0 · W 5.5 · S 6.5" },
      period: { en: "12 Aug 2026", uz: "12.08.2026", ru: "12 авг 2026" },
    },
    {
      title: { en: "Electrician", uz: "Elektrik", ru: "Электрик" },
      org: { en: "Diploma with honours", uz: "Qizil diplom", ru: "Красный диплом" },
      period: { en: "", uz: "", ru: "" },
    },
    {
      title: { en: "Trucking", uz: "Trucking", ru: "Trucking" },
      org: { en: "MBA certificate, First Class", uz: "MBA sertifikati, First Class", ru: "Сертификат MBA, First Class" },
      period: { en: "", uz: "", ru: "" },
    },
  ],
  stack: ["JS / TS", "Node", "Python", "Cloudflare Workers", "D1 / R2", "Firebase", "Supabase", "Claude API", "GitHub Actions", "Pages", "Web Audio", "Canvas"],
};

export const method = [
  { n: "01", label: { en: "Specify", uz: "Spetsifikatsiya", ru: "Спецификация" } },
  { n: "02", label: { en: "Direct the agents", uz: "Agentlarni boshqarish", ru: "Управление агентами" } },
  { n: "03", label: { en: "Review", uz: "Tekshirish", ru: "Ревью" } },
  { n: "04", label: { en: "Ship", uz: "Chiqarish", ru: "Релиз" } },
  { n: "05", label: { en: "Operate", uz: "Yuritish", ru: "Эксплуатация" } },
];
