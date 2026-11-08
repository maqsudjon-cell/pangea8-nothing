const lessons = {
  1: { title: 'Tanishuv', hanzi: 'AI小语，你好！', hero: '你好', headline: 'Salom deyishdan boshlaymiz.', description: 'Kundalik muloqotning ilk so‘zlari. Hikoya orqali bog‘lang, javobni faol eslang va chiziqlar tartibida yozib mustahkamlang.' },
  2: { title: 'Ism va tanishuv', hanzi: '我叫李文', hero: '名字', headline: 'Ismingizni ayting.', description: 'Ism so‘rash, uzr so‘rash va yangi odam bilan tanishish uchun zarur iboralar.' },
  3: { title: 'Mamlakat va ish', hanzi: '我是中国人', hero: '中国', headline: 'O‘zingizni tanishtiring.', description: 'Mamlakatlar, yaqin odamlar, kasb va kundalik bandlik haqida gapiring.' },
  4: { title: 'Oila', hanzi: '我有两个孩子', hero: '家', headline: 'Oilangizni tanishtiring.', description: 'Oila a’zolari, yosh va sonlarni ishlatib oila haqida sodda gaplar tuzing.' },
  5: { title: 'Sana va dam olish', hanzi: '今天我休息', hero: '今天', headline: 'Kuningizni rejalashtiring.', description: 'Sanalar, hafta kunlari, ovqat tayyorlash va yoqqan narsalar haqida gapiring.' },
  6: { title: 'Telefon va xarid', hanzi: '你的手机号是多少？', hero: '手机', headline: 'Bog‘laning va xarid qiling.', description: 'Telefon raqami, xarid, ovqat va transportga oid kundalik so‘zlar.' },
  7: { title: 'Vaqt va kino', hanzi: '我晚上六点半下班', hero: '现在', headline: 'Vaqtingizni boshqaring.', description: 'Soat, dars, ish, uchrashuv va kinoga borish haqida aniq gapiring.' },
  8: { title: 'Joy va kasb', hanzi: '我爸爸也在医院工作', hero: '医院', headline: 'Joyni va kasbni ayting.', description: 'Buyumlarning joyi, uchrashuv manzili va shifokorlik kasbi haqida so‘zlaring.' },
  9: { title: 'Reja va bo‘sh vaqt', hanzi: '我明天上午在学校学习', hero: '学习', headline: 'Rejangizni ayting.', description: 'Joy, vaqt, o‘qish va bo‘sh vaqt rejalaringiz haqida gapiring.' },
  10: { title: 'Narx va xarid', hanzi: '这儿的苹果真便宜！', hero: '便宜', headline: 'Narxni so‘rang va xarid qiling.', description: 'Pul, meva, kiyim va narxlar haqida do‘konda gaplashishni mashq qiling.' }
};

const words = [
  { id: 1, lesson: 1, hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'salom', type: 'ibora', parts: '你 = 亻 + 尔 · 好 = 女 + 子', story: 'Yoningizdagi ona va bolani ko‘rib, iliq tabassum bilan “Salom” deysiz. 你 — sen, 好 — yaxshi.' },
  { id: 2, lesson: 1, hanzi: '王老师', pinyin: 'Wáng lǎoshī', meaning: 'Wang ustoz (ayol)', type: 'maxsus ot', parts: '王 — familiya · 老师 — ustoz', story: 'Uch taxt chizig‘ini bir ustun bog‘lab turgan 王 familiyali keksa ustozni tasavvur qiling. U — Wang ustoz.' },
  { id: 13, lesson: 1, hanzi: '大家', pinyin: 'dàjiā', meaning: 'hamma', type: 'olmosh', parts: '大 — katta · 家 — uy, oila', story: 'Katta 大 uy 家 ichiga barcha tanishlaringiz yig‘ilgan. Xonadagi hamma birga gapiradi.' },
  { id: 14, lesson: 1, hanzi: '好', pinyin: 'hǎo', meaning: 'yaxshi', type: 'sifat', parts: '好 = 女 (ayol) + 子 (bola)', story: 'Ona 女 bolasini 子 quchoqlagan iliq manzarani tasavvur qiling. Bu manzara sizga juda yaxshi ta’sir qiladi.' },
  { id: 15, lesson: 1, hanzi: '学生', pinyin: 'xuésheng', meaning: 'o‘quvchi; talaba', type: 'ot', parts: '学 = ⺍ + 冖 + 子 · 生 — o‘sish, tug‘ilmoq', story: 'Tom 冖 ostidagi bola 子 o‘qib 学, kundan-kunga o‘sib 生 boradi. U — o‘quvchi.' },
  { id: 16, lesson: 1, hanzi: '们', pinyin: 'men', meaning: '-lar (ko‘plik qo‘shimchasi)', type: 'qo‘shimcha', parts: '们 = 亻 (kishi) + 门 (eshik)', story: 'Eshik 门 oldida bitta emas, bir nechta odam 亻 turibdi. Demak, ko‘plik uchun -lar qo‘shimchasi kerak.' },
  { id: 17, lesson: 1, hanzi: '老师', pinyin: 'lǎoshī', meaning: 'o‘qituvchi; ustoz', type: 'ot', parts: '老 — keksa, tajribali · 师 — ustoz', story: 'Tajribali 老 ustoz doska oldida turibdi. Uning har bir harakati sizga bilim beradigan 师 ustozni eslatadi.' },
  { id: 18, lesson: 1, hanzi: '您', pinyin: 'nín', meaning: 'siz (hurmat)', type: 'olmosh', parts: '您 = 你 (sen) + 心 (yurak)', story: '“Sen” so‘zining ostiga yurak 心 qo‘shing: suhbatdoshingizni yurakdan hurmat qilib “Siz” deysiz.' },
  { id: 19, lesson: 1, hanzi: '你们', pinyin: 'nǐmen', meaning: 'sizlar', type: 'olmosh', parts: '你 — sen · 们 — ko‘plik qo‘shimchasi', story: 'Sen 你 deganingizda bitta odam bor edi. Eshikdan boshqalar ham kirib 们, endi “Sizlar” deb murojaat qilasiz.' },
  { id: 9, lesson: 1, hanzi: '谢谢', pinyin: 'xièxie', meaning: 'rahmat', type: 'fe’l', parts: '谢 = 讠 (so‘z) + 射', story: 'Yordam bergan odamga ikki marta, samimiy so‘z 讠 bilan “Rahmat, rahmat” deysiz.' },
  { id: 10, lesson: 1, hanzi: '不客气', pinyin: 'bú kèqi', meaning: 'arzimaydi', type: 'ibora', parts: '不 — emas · 客 — mehmon · 气 — havo', story: 'Mehmon 客 sizga rahmat aytadi. Siz qo‘l silkitib: “Yo‘q 不, arzimaydi” deb havoni 气 yumshatasiz.' },
  { id: 11, lesson: 1, hanzi: '同学', pinyin: 'tóngxué', meaning: 'sinfdosh', type: 'ot', parts: '同 — bir xil · 学 — o‘rganmoq', story: 'Bir xil 同 tom ostida birga o‘qiyotgan 学 bolalarni ko‘ring — ular sinfdoshlar.' },
  { id: 12, lesson: 1, hanzi: '再见', pinyin: 'zàijiàn', meaning: 'xayr', type: 'fe’l', parts: '再 — yana · 见 — ko‘rmoq', story: 'Ketayotgan do‘stingizga qo‘l silkitasiz: “Yana 再 ko‘rishamiz 见!” Bu — xayrlashuv.' },
  { id: 3, lesson: 2, hanzi: '请问', pinyin: 'qǐngwèn', meaning: 'kechirasiz, so‘rasam…', type: 'ibora', parts: '请 = 讠 + 青 · 问 = 门 + 口', story: 'Eshik 门 oldida og‘iz 口 bilan savol berasiz. Odob bilan so‘rashdan oldin “Kechirasiz, so‘rasam…” deysiz.' },
  { id: 4, lesson: 2, hanzi: '你', pinyin: 'nǐ', meaning: 'sen', type: 'olmosh', parts: '你 = 亻 (kishi) + 尔', story: 'Yoningizdagi 亻 odam tomon qo‘l uzatib, aynan uni nazarda tutib “Sen” deysiz.' },
  { id: 5, lesson: 2, hanzi: '叫', pinyin: 'jiào', meaning: 'ismi … bo‘lmoq; chaqirmoq', type: 'fe’l', parts: '叫 = 口 (og‘iz) + 丩', story: 'Chap tomondagi og‘iz 口 bir kishini chaqirmoqda. Kimdir chaqirilganda uning ismi aytiladi.' },
  { id: 6, lesson: 2, hanzi: '什么', pinyin: 'shénme', meaning: 'nima', type: 'olmosh', parts: '什 = 亻 + 十 · 么 = 丿 + 厶', story: 'O‘n 十 narsa oldida turgan odam 亻 qaysi birini tanlashni bilmay: “Nima?” deb so‘raydi.' },
  { id: 7, lesson: 2, hanzi: '名字', pinyin: 'míngzi', meaning: 'ism', type: 'ot', parts: '名 = 夕 + 口 · 字 = 宀 + 子', story: 'Kechqurun 夕 og‘iz 口 bilan bolaning ismini chaqirishadi. Uy 宀 ichidagi bola 子 esa o‘z ismini yozadi.' },
  { id: 8, lesson: 2, hanzi: '我', pinyin: 'wǒ', meaning: 'men', type: 'olmosh', parts: '我 = 扌 (qo‘l obrazi) + 戈', story: 'O‘zingizni ko‘rsatib, qo‘lingizdagi buyumni oldingizga chiqarasiz va qat’iy ravishda “Men” deysiz.' }
];

let nextId = 20;
function addWord(lesson, hanzi, pinyin, meaning, type, parts, story) {
  words.push({ id: nextId++, lesson, hanzi, pinyin, meaning, type, parts, story });
}

addWord(2, '不', 'bù', 'yo‘q; emas', 'ravish', '不 = 一 + 丿 + 丨 + 丶', 'Oldingizga qat’iy to‘siq 不 qo‘ying va qo‘l bilan to‘xtating: “Yo‘q, emas!”');
addWord(2, '是', 'shì', 'bo‘lmoq; ha', 'fe’l', '是 = 日 + 疋', 'Quyosh 日 ostida to‘g‘ri va qat’iy qadam tashlang. Tasdiqlab: “Ha, shunday!” deysiz.');
addWord(2, '对不起', 'duìbuqǐ', 'uzr so‘rayman', 'ibora', '对 — to‘g‘ri · 不 — emas · 起 — ko‘tarilmoq', 'Bir kishiga to‘g‘ri javob bera olmagansiz. Oldinga egilib, keyin ko‘tarilib 起 samimiy “Uzr” deysiz.');
addWord(2, '没关系', 'méi guānxi', 'mayli; hechqisi yo‘q', 'ibora', '没 — yo‘q · 关系 — bog‘liqlik', 'Uzr so‘ragan odamga qo‘l silkitasiz: bu ishning siz bilan og‘ir bog‘liqligi yo‘q — “Mayli”.');
addWord(2, '没事', 'méishì', 'hech qanday muammo yo‘q', 'ibora', '没 — yo‘q · 事 — ish, muammo', 'Tashvishlangan do‘stingizga muammo belgisi 事 ustidan chizib: “Hech qanday ish yo‘q” deysiz.');
addWord(2, '很', 'hěn', 'juda', 'ravish', '很 = 彳 + 艮', 'Bir xilda yurish 彳 belgisi bilan qat’iy to‘xtagan obrazni ko‘ring: oddiy emas, “juda” kuchli.');
addWord(2, '高兴', 'gāoxìng', 'xursand', 'sifat', '高 — baland · 兴 — quvonch', 'Quvonchingiz baland 高 bino kabi ko‘tariladi. Yuzingiz yorishib: “Juda xursandman!” deysiz.');
addWord(2, '认识', 'rènshi', 'tanimoq; tanishmoq', 'fe’l', '认 = 讠 + 人 · 识 = 讠 + 只', 'Odam 人 bilan so‘z 讠 orqali gaplashasiz va uni tanib qolasiz. Suhbat — tanishuv kaliti.');
addWord(2, '也', 'yě', 'ham; ... ham', 'ravish', '也', 'Ikki odam bir xil ishni qiladi. Ikkinchisini ko‘rsatib: “U ham!” deysiz.');

addWord(3, '人', 'rén', 'odam; kishi', 'ot', '人 — ikki oyoqli odam obrazi', 'Ikki oyoq bilan yurayotgan odam siluetini ko‘ring. Sodda 人 belgisi — kishi.');
addWord(3, '的', 'de', '-ning (egalik qo‘shimchasi)', 'yordamchi so‘z', '的 = 白 + 勺', 'Oq 白 qoshiq 勺 kimniki? Egasini ko‘rsatib: “Bu mening qoshig‘im” — egalik uchun 的.');
addWord(3, '中国', 'Zhōngguó', 'Xitoy', 'maxsus ot', '中 — markaz · 国 — mamlakat', 'To‘rtburchak mamlakat 国 xaritasining aynan markaziga 中 bayroq qadang. Bu — Xitoy.');
addWord(3, '法国', 'Fǎguó', 'Fransiya', 'maxsus ot', '法 — qonun · 国 — mamlakat', 'Mamlakat 国 ichida qonun 法 kitobi va Eyfel minorasini tasavvur qiling. Bu — Fransiya.');
addWord(3, '中文', 'Zhōngwén', 'xitoy tili', 'ot', '中 — Xitoy · 文 — yozuv, til', 'Xitoyni bildiruvchi 中 yoniga chiroyli yozuv 文 qo‘ying: Xitoy yozuvi va tili — 中文.');
addWord(3, '这', 'zhè', 'bu', 'olmosh', '这 = 文 + 辶', 'Yoningizdagi yozuv 文 tomon qadam 辶 tashlab, yaqin narsani ko‘rsatasiz: “Bu”.');
addWord(3, '谁', 'shéi / shuí', 'kim', 'olmosh', '谁 = 讠 + 隹', 'Noma’lum odamga so‘z 讠 bilan murojaat qilib so‘raysiz: “U kim?”');
addWord(3, '女朋友', 'nǚpéngyou', 'qiz do‘st; sevgili qiz', 'ot', '女 — ayol · 朋友 — do‘st', 'Ikki oy 月 yonma-yon do‘stlikni, 友 esa qo‘llar yordamini eslatadi. Yaqin qiz do‘stingizni tasavvur qiling.');
addWord(3, '哪', 'nǎ', 'qaysi', 'olmosh', '哪 = 口 + 那', 'Bir necha narsadan birini ko‘rsatib, og‘iz 口 bilan so‘raysiz: “Qaysi biri?”');
addWord(3, '国', 'guó', 'mamlakat; davlat', 'ot', '国 = 囗 + 玉', 'Devor 囗 ichida qimmatbaho gavhar 玉 saqlanadi — qadrlanadigan mamlakat.');
addWord(3, '她', 'tā', 'u (ayol)', 'olmosh', '她 = 女 + 也', 'Ayol 女 belgisi yoniga 也 qo‘shing: gap aynan u ayol haqida.');
addWord(3, '泰国', 'Tàiguó', 'Tailand', 'maxsus ot', '泰 — tinch, farovon · 国 — mamlakat', 'Farovon 泰 mamlakat 国 ichida oltin ibodatxona va filni xayol qiling — Tailand.');
addWord(3, '喂', 'wèi', 'alo (telefonda); hey', 'undov', '喂 = 口 + 畏', 'Telefonni qulog‘ingizga olib, og‘iz 口 bilan aniq: “Alo!” deysiz.');
addWord(3, '姐姐', 'jiějie', 'opa (o‘zidan katta qiz)', 'ot', '姐 = 女 + 且', 'Katta opangiz sizni chaqiradi. Ayol 女 belgisi ikki marta — mehrli opa murojaati.');
addWord(3, '工作', 'gōngzuò', 'ish; ishlamoq', 'ot / fe’l', '工 — ish · 作 = 亻 + 乍', 'Odam 亻 ish 工 asbobini olib mehnat qiladi. Bu uning kundalik ishi.');
addWord(3, '还', 'hái', 'hali; yana', 'ravish', '还 = 不 + 辶', 'Ish hali tugamagan, yo‘l 辶 davom etmoqda: “Hali ham shu yerdaman”.');
addWord(3, '忙', 'máng', 'band', 'sifat', '忙 = 忄 + 亡', 'Yurak 忄 shoshilinch ishlar orasida nafas ololmaydi. Juda bandsiz.');
addWord(3, '吗', 'ma', 'ha-yo‘q savol yuklamasi', 'yuklama', '吗 = 口 + 马', 'Og‘iz 口 savol beradi, oxirida ovoz ko‘tariladi: “Bandmisiz?”');
addWord(3, '对', 'duì', 'to‘g‘ri; ha', 'sifat', '对 = 又 + 寸', 'Javob ustiga aniq belgi qo‘yasiz: “To‘g‘ri!”');
addWord(3, '太', 'tài', 'juda; haddan tashqari', 'ravish', '太 = 大 + 丶', 'Katta 大 belgisiga yana bir nuqta qo‘shing: kattadan ham ortiq, ya’ni juda.');
addWord(3, '我们', 'wǒmen', 'biz', 'olmosh', '我 — men · 们 — ko‘plik', 'O‘zingizni ko‘rsatib 我, yoningizdagilarni ham qamrab olasiz 们: “Biz”.');
addWord(3, '想', 'xiǎng', 'xohlamoq; o‘ylamoq', 'fe’l', '想 = 相 + 心', 'Xayolingizdagi manzara 相 yuragingizga 心 tushadi: uni juda xohlaysiz.');

addWord(4, '有', 'yǒu', 'bor; ega bo‘lmoq', 'fe’l', '有 = 𠂇 + 月', 'Qo‘lingizda bir narsa borligini ko‘rsatib: “Menda bor” deysiz.');
addWord(4, '多少', 'duōshao', 'nechta; qancha', 'olmosh', '多 — ko‘p · 少 — kam', 'Bir tomonda ko‘p 多, boshqa tomonda kam 少 narsa. Sonini bilmay so‘raysiz: “Nechta?”');
addWord(4, '个', 'gè', 'ta (umumiy o‘lchov birligi)', 'o‘lchov so‘z', '个 = 人 obrazi + 丨', 'Har bir buyumni bittadan sanang: bir 个, ikki 个, uch 个.');
addWord(4, '哥哥', 'gēge', 'aka (o‘zidan katta o‘g‘il)', 'ot', '哥 = 可 + 可', 'Katta akangizni chaqirganda ismini ikki marta mehr bilan aytgandek: “Aka, aka”.');
addWord(4, '呢', 'ne', 'savol yuklamasi; ...-chi?', 'yuklama', '呢 = 口 + 尼', 'Bir savolga javob oldingiz. Endi boshqani ko‘rsatib: “U-chi?” deb qisqa savol berasiz.');
addWord(4, '没有', 'méiyǒu', 'yo‘q; ega emas', 'fe’l', '没 — yo‘q · 有 — bor', 'Avval 有 bor edi, endi 没 uni inkor qiladi: “Menda yo‘q”.');
addWord(4, '家', 'jiā', 'uy; oila', 'ot', '家 = 宀 + 豕', 'Tom 宀 ostida sizni kutayotgan oila a’zolari bor. Issiq uyga qaytasiz.');
addWord(4, '几', 'jǐ', 'nechta (odatda 10 gacha)', 'olmosh', '几', 'Stolga bir nechta buyum qo‘yib, barmoq bilan sanashdan oldin: “Nechta?” deb so‘rang.');
addWord(4, '口', 'kǒu', 'og‘iz; oila a’zosi (o‘lchov)', 'ot / o‘lchov', '口 — ochiq og‘iz obrazi', 'Ochiq og‘iz shaklini ko‘ring. Oilada nechta og‘iz ovqatlanadi — shuncha kishi bor.');
addWord(4, '爸爸', 'bàba', 'dada; ota', 'ot', '爸 = 父 + 巴', 'Ota 父 belgisi ostida unga yopishgan bola bor. Mehr bilan: “Dada”.');
addWord(4, '妈妈', 'māma', 'ona', 'ot', '妈 = 女 + 马', 'Ayol 女 yonidagi bolani ko‘tarib turgan ona obrazini xayol qiling: “Ona”.');
addWord(4, '妹妹', 'mèimei', 'singil (o‘zidan kichik qiz)', 'ot', '妹 = 女 + 未', 'Kichik singlingiz ortingizdan yugurib keladi. Uni ikki marta mehr bilan chaqirasiz.');
addWord(4, '和', 'hé', 'va; bilan', 'bog‘lovchi', '和 = 禾 + 口', 'Ikki narsani bir joyga qo‘yasiz va orasiga ko‘prik qo‘shasiz: “Men va sen”.');
addWord(4, '儿子', 'érzi', 'o‘g‘il', 'ot', '儿 — bola · 子 — o‘g‘il bola', 'Ota-onaning yonida turgan o‘g‘il bolani ko‘ring: ularning 儿子.');
addWord(4, '孩子', 'háizi', 'bola; farzand', 'ot', '孩 = 子 + 亥 · 子 — bola', 'O‘ynab yurgan kichik bolani quchoqlang. 孩 ham, 子 ham uni farzand deb eslatadi.');
addWord(4, '女儿', 'nǚ’ér', 'qiz farzand', 'ot', '女 — ayol · 儿 — bola', 'Ota-ona qiz bolasini 女 儿 quchoqlab turibdi: ularning qizi.');
addWord(4, '岁', 'suì', 'yosh (… yoshda)', 'o‘lchov', '岁 = 山 + 夕', 'Har yil yangi tug‘ilgan kun shamlari yonadi. Son ayting va oxiriga 岁 qo‘shing.');
addWord(4, '他', 'tā', 'u (erkak)', 'olmosh', '他 = 亻 + 也', 'Odam 亻 belgisi bilan u erkakni ko‘rsating: “U”.');
addWord(4, '今年', 'jīnnián', 'bu yil', 'ot', '今 — hozirgi · 年 — yil', 'Kalendar shu yilning varag‘ida ochiq. Uni barmoq bilan ko‘rsating: “Bu yil”.');
addWord(4, '多', 'duō', 'ko‘p', 'sifat', '多 = 夕 + 夕', 'Ikki kechki 夕 qatlam ustma-ust tushgan — narsalar ko‘payib ketgan.');
addWord(4, '大', 'dà', 'katta', 'sifat', '大 = 人 + 一 obrazi', 'Qo‘l-oyog‘ini keng yozgan odam o‘zini katta ko‘rsatadi.');

addWord(5, '今天', 'jīntiān', 'bugun', 'ot', '今 — hozirgi · 天 — kun', 'Kalendar bugungi kunning atrofiga doira chizing: hozirgi 今 kun 天.');
addWord(5, '号', 'hào', 'sana; raqam', 'ot', '号 = 口 + 丂', 'Kalendar katakchasiga raqam yozing. Bugun nechanchi sana?');
addWord(5, '月', 'yuè', 'oy; oy (kalendarning)', 'ot', '月 — oy obrazi', 'Osmondagi yarim oy shaklini ko‘ring. U bir oylik kalendarni eslatadi.');
addWord(5, '日', 'rì', 'kun; quyosh', 'ot', '日 — quyosh obrazi', 'To‘rtburchak ichidagi quyosh 日 botib chiqishi bilan bir kun o‘tadi.');
addWord(5, '星期', 'xīngqī', 'hafta', 'ot', '星 — yulduz · 期 — davr', 'Hafta kunlarini yetti yulduz 星 kabi ketma-ket joylashtiring. Bu bir haftalik davr.');
addWord(5, '星期日', 'xīngqīrì', 'yakshanba', 'ot', '星期 — hafta · 日 — quyosh, kun', 'Haftaning quyoshli 日 dam olish kunini tasavvur qiling — yakshanba.');
addWord(5, '星期天', 'xīngqītiān', 'yakshanba', 'ot', '星期 — hafta · 天 — kun', 'Haftaning osmon 天 kabi ochiq, erkin kunini xayol qiling — yakshanba.');
addWord(5, '休息', 'xiūxi', 'dam olmoq', 'fe’l', '休 = 亻 + 木 · 息 = 自 + 心', 'Odam 亻 daraxt 木 soyasida to‘xtaydi, nafas oladi va yuragi 心 tinchlanadi.');
addWord(5, '会', 'huì', 'qila olmoq; bilmoq (mahorat)', 'modal fe’l', '会 = 人 + 云', 'Odam o‘rgangan mahoratini ishonch bilan ko‘rsatadi: “Men buni qila olaman”.');
addWord(5, '做饭', 'zuòfàn', 'ovqat pishirmoq', 'fe’l', '做 — qilmoq · 饭 — ovqat', 'Oshxonada idishni aralashtirasiz: ovqatni o‘z qo‘lingiz bilan tayyorlaysiz.');
addWord(5, '做', 'zuò', 'qilmoq; tayyorlamoq', 'fe’l', '做 = 亻 + 古 + 攵', 'Odam 亻 qo‘li bilan ishni bajaradi. Harakatni ko‘rsating: “Qildim”.');
addWord(5, '面条儿', 'miàntiáor', 'lag‘man; noodle', 'ot', '面 — un, xamir · 条 — uzun strip', 'Xamirdan uzun-uzun 条 noodle tortib, idishga soling.');
addWord(5, '饺子', 'jiǎozi', 'chuchvara; jiaozi', 'ot', '饺 = 饣+ 交 · 子', 'Xamir ichiga go‘sht solib, chetlarini mahkam yoping. Daming chuchvara tayyor.');
addWord(5, '一些', 'yīxiē', 'bir oz; ba’zi', 'son', '一 — bir · 些 — bir qadar', 'Katta miqdordan bir ozini ajratib oling: “Bir oz” yoki “ba’zi”.');
addWord(5, '菜', 'cài', 'taom; sabzavot', 'ot', '菜 = 艹 + 采', 'O‘simlik 艹 orasidan sabzavot terib 采 olib, mazali taom tayyorlang.');
addWord(5, '下班', 'xiàbān', 'ishdan qaytmoq; smenani tugatmoq', 'fe’l', '下 — pastga, tugatish · 班 — smena', 'Ish soati tugadi. Smena 班 pastga 下 tushdi — endi uyga qaytishingiz mumkin.');
addWord(5, '新', 'xīn', 'yangi', 'sifat', '新 = 立 + 木 + 斤', 'Qadoqni ochdingiz va ichidan yorqin yangi buyum chiqdi. Unda hech qanday iz yo‘q.');
addWord(5, '电脑', 'diànnǎo', 'kompyuter', 'ot', '电 — elektr · 脑 — miya', 'Elektr 电 bilan ishlaydigan sun’iy miya 脑 — kompyuter.');
addWord(5, '真', 'zhēn', 'haqiqiy; rostdan ham', 'sifat / ravish', '真 = 十 + 具 obrazi', 'Buyumni yaqindan tekshirdingiz: soxtalik yo‘q. “Rostdan ham haqiqiy!”');
addWord(5, '好看', 'hǎokàn', 'chiroyli; yoqimli ko‘rinishda', 'sifat', '好 — yaxshi · 看 — ko‘rmoq', 'Ko‘rishga 看 juda yoqimli 好 manzarani ko‘rib: “Qanday chiroyli!” deysiz.');
addWord(5, '喜欢', 'xǐhuan', 'yoqtirmoq; xush ko‘rmoq', 'fe’l', '喜 — quvonch · 欢 — xursandchilik', 'Bir narsani ko‘rib yuzingizga tabassum yuguradi. Yuragingiz: “Bu menga yoqadi” deydi.');
addWord(5, '它', 'tā', 'u (hayvon yoki narsa)', 'olmosh', '它 = 宀 + 匕', 'Odam emas, buyum yoki hayvonni ko‘rsating. U haqida gapirganda 它 ishlating.');

addWord(6, '手机', 'shǒujī', 'mobil telefon', 'ot', '手 — qo‘l · 机 — qurilma', 'Qo‘lingizdagi 手 kichik qurilma 机 jiringladi — mobil telefon.');
addWord(6, '电话', 'diànhuà', 'telefon', 'ot', '电 — elektr · 话 — gap, so‘z', 'Elektr 电 orqali uzoqdagi odam bilan gaplashasiz 话. Bu — telefon.');
addWord(6, '号', 'hào', 'raqam; …-raqam', 'ot', '号 = 口 + 丂', 'Telefon raqamingizni raqamlar ketma-ketligida ayting. Har bir raqam — 号 so‘zidagi tartib.');
addWord(6, '明天', 'míngtiān', 'ertaga', 'ot', '明 = 日 + 月 · 天 — kun', 'Quyosh 日 va oy 月 almashadi, yangi tong 明 ochiladi — ertangi kun.');
addWord(6, '去', 'qù', 'bormoq', 'fe’l', '去 = 土 + 厶', 'Bir joydan boshqa joy tomon qadam tashlang: “Men boraman”.');
addWord(6, '哪儿', 'nǎr', 'qayer', 'olmosh', '哪 — qaysi · 儿 — yer shaklidagi qo‘shimcha', 'Xaritada manzil topolmay so‘raysiz: “Qayerda?”');
addWord(6, '想', 'xiǎng', 'xohlamoq; niyat qilmoq', 'fe’l', '想 = 相 + 心', 'Ertangi rejani xayolingizda 相 chizing va yuragingiz 心 bilan istang: “Borgim keladi”.');
addWord(6, '超市', 'chāoshì', 'supermarket', 'ot', '超 — o‘ta, super · 市 — bozor', 'Oddiy bozordan 市 kattaroq, super 超 do‘konga kiribsiz — supermarket.');
addWord(6, '买', 'mǎi', 'sotib olmoq', 'fe’l', '买 = 乛 + 头', 'Pulni sotuvchiga berib, buyumni sumkangizga solasiz: “Sotib oldim”.');
addWord(6, '东西', 'dōngxi', 'narsa; buyum', 'ot', '东 — sharq · 西 — g‘arb', 'Sharqdan 东 ham, g‘arbdan 西 ham turli narsalar yig‘ilgan. Ularning barchasi — buyumlar.');
addWord(6, '些', 'xiē', 'bir oz; ba’zi', 'o‘lchov', '些 = 此 + 二', 'Bir nechta buyumdan ikki-uchtasini ajrating: “Ba’zilari”.');
addWord(6, '牛奶', 'niúnǎi', 'sut', 'ot', '牛 — sigir · 奶 — sut', 'Sigir 牛 dan sog‘ilgan oq sut 奶 stakaniga quyiladi.');
addWord(6, '吃', 'chī', 'yemoq', 'fe’l', '吃 = 口 + 乞', 'Og‘zingizga 口 bir luqma olib, mazali ovqatni yeyapsiz.');
addWord(6, '晚饭', 'wǎnfàn', 'kechki ovqat', 'ot', '晚 — kech · 饭 — ovqat', 'Quyosh botgach 晚 dasturxonga o‘tirasiz — kechki ovqat.');
addWord(6, '那边', 'nàbiān', 'u tomonda', 'olmosh', '那 — u · 边 — tomon', 'Yaqindagi narsani emas, uzoqdagi joyni qo‘l bilan ko‘rsating: “U tomonda”.');
addWord(6, '包子', 'bāozi', 'bozi, bug‘da pishirilgan xamir taom', 'ot', '包 — o‘ramoq · 子', 'Go‘shtli ichlikni xamirga o‘rap 包, yumaloq bozi tayyorlang.');
addWord(6, '非常', 'fēicháng', 'juda; o‘ta', 'ravish', '非 — oddiy emas · 常 — odatiy', 'Oddiy darajadan 常 tashqariga 非 chiqing: bu “juda” kuchli.');
addWord(6, '好吃', 'hǎochī', 'mazali', 'sifat', '好 — yaxshi · 吃 — yemoq', 'Bir luqma yeb 吃 ko‘rib, mamnun bo‘lib: “Juda mazali 好!” deysiz.');
addWord(6, '米饭', 'mǐfàn', 'pishgan guruch; palovdagi guruch', 'ot', '米 — guruch · 饭 — ovqat', 'Oq guruch 米 donalari idishda bug‘lanib turibdi — tayyor guruch ovqati.');
addWord(6, '怎么', 'zěnme', 'qanday; qanday qilib', 'olmosh', '怎 — qanday · 么 — savol yuklamasi', 'Bir ishni bajarish usulini bilmay qo‘l yoyasiz: “Qanday qilaman?”');
addWord(6, '坐', 'zuò', 'o‘tirmoq; transportda ketmoq', 'fe’l', '坐 = 人 + 人 + 土', 'Ikki odam 人 yer 土 ustidagi o‘rindiqda o‘tiradi. Avtobusga o‘tirib ketish ham shu.');
addWord(6, '出租车', 'chūzūchē', 'taksi', 'ot', '出 — chiqmoq · 租 — ijaraga olmoq · 车 — mashina', 'Ijaraga 租 olingan mashina 车 oldingizga keladi. Eshikdan chiqib 出 taksiga o‘tirasiz.');
addWord(6, '西安饭店', 'Xī’ān Fàndiàn', 'Xi’an mehmonxonasi / restorani', 'maxsus ot', '西安 — Xi’an shahri · 饭店 — mehmonxona, restoran', 'Xi’an shahridagi katta restoran eshigini xayol qiling. Uning nomi — 西安饭店.');

addWord(7, '现在', 'xiànzài', 'hozir', 'ot', '现 — hozirgi · 在 — shu damda', 'Soatning shu lahzadagi ko‘rsatkichini ko‘rsating: “Hozir”.');
addWord(7, '点', 'diǎn', 'soat (… soat)', 'o‘lchov', '点 = 占 + 灬', 'Soat raqamini ayting, so‘ng 点 qo‘shing: sakkiz 点 — soat sakkiz.');
addWord(7, '早上', 'zǎoshang', 'erta tong', 'ot', '早 — erta · 上 — yuqoriga', 'Quyosh erta 早 osmonga yuqoriga 上 ko‘tariladi — tong.');
addWord(7, '上午', 'shàngwǔ', 'tushdan oldin; ertalabki yarim kun', 'ot', '上 — oldingi · 午 — tush', 'Tush 午 yetmasdan oldingi 上 vaqt: tongdan tushgacha.');
addWord(7, '分', 'fēn', 'daqiqa; bo‘lmoq', 'ot / fe’l', '分 = 八 + 刀', 'Soat doirasini pichoq 刀 bilan kichik bo‘laklarga 分 bo‘ling — har biri daqiqa.');
addWord(7, '课', 'kè', 'dars; mashg‘ulot', 'ot', '课 = 讠 + 果', 'So‘z 讠 orqali berilgan bilim meva 果 beradi — bu dars.');
addWord(7, '下午', 'xiàwǔ', 'tushdan keyin', 'ot', '下 — keyingi, past · 午 — tush', 'Soat tushdan 午 o‘tdi, quyosh pastga 下 qarab harakatlanadi — tushdan keyin.');
addWord(7, '见', 'jiàn', 'uchrashmoq; ko‘rishmoq', 'fe’l', '见 — ko‘z va odam obrazi', 'Do‘stingiz bilan uchrashdingiz va bir-biringizni ko‘rdingiz: “Ikki soatda uchrashamiz”.');
addWord(7, '吧', 'ba', 'taklif yoki maslahat yuklamasi', 'yuklama', '吧 = 口 + 巴', 'Do‘stingizga yumshoq taklif ayting: “Boraylikchi?”, “Uchrashamiz-a?”.');
addWord(7, '电影院', 'diànyǐngyuàn', 'kinoteatr', 'ot', '电影 — kino · 院 — bino, hovli', 'Kino 电影 ko‘rsatiladigan katta bino 院 — kinoteatr.');
addWord(7, '看', 'kàn', 'ko‘rmoq; tomosha qilmoq; o‘qimoq', 'fe’l', '看 = 手 obrazi + 目', 'Qo‘lingizni qoshga qo‘yib, ko‘z 目 bilan uzoqqa qarang — diqqat bilan ko‘ring.');
addWord(7, '电影', 'diànyǐng', 'kino; film', 'ot', '电 — elektr · 影 — soya, tasvir', 'Elektr 电 ekranda harakatlanuvchi soyalarni 影 yaratadi — kino.');
addWord(7, '事', 'shì', 'ish; masala', 'ot', '事', 'Kundalik ro‘yxatingizdagi bitta muhim ishni belgilang: “Menda ish bor”.');
addWord(7, '上课', 'shàngkè', 'darsga kirmoq; darsda bo‘lmoq', 'fe’l', '上 — boshlamoq, chiqmoq · 课 — dars', 'Sinfga kirib darsni 课 boshladingiz 上. Endi darsdasiz.');
addWord(7, '呢', 'ne', 'davomiy holat yuklamasi', 'yuklama', '呢 = 口 + 尼', 'Hozir qilayotgan ishingizni davom ettiring: “Men hali darsdaman-da” — 呢 gapni yumshatadi.');
addWord(7, '半', 'bàn', 'yarim', 'son', '半', 'Bitta butun narsani aynan teng ikkiga bo‘ling: yarim soat, yarim non.');
addWord(7, '下课', 'xiàkè', 'darsni tugatmoq; darsdan chiqmoq', 'fe’l', '下 — tugatmoq, pastga · 课 — dars', 'Dars 课 tugadi 下, daftarni yopib sinfdan chiqasiz.');
addWord(7, '在', 'zài', 'bo‘lmoq; joylashmoq; -da', 'fe’l', '在 = 𠂇 + 土', 'Bir narsa yer 土 ustida aniq joyda turibdi. U shu yerda 在.');
addWord(7, '家', 'jiā', 'uy; oila', 'ot', '家 = 宀 + 豕', 'Tom 宀 ostida oila a’zolari sizni kutmoqda. Telefonda: “Men uydaman”.');
addWord(7, '里', 'lǐ / li', 'ichida; ichki tomon', 'ot', '里 = 日 + 土', 'Quti ichiga narsa qo‘ying va tashqaridan ko‘rsating: “Ichida”.');
addWord(7, '晚上', 'wǎnshang', 'kechqurun', 'ot', '晚 — kech · 上 — vaqt qismi', 'Quyosh botib 晚, chiroqlar yondi — kechqurun.');
addWord(7, '医院', 'yīyuàn', 'shifoxona', 'ot', '医 — tibbiyot · 院 — muassasa, bino', 'Tibbiyot 医 belgisi tushirilgan katta bino 院 — shifoxona.');
addWord(7, '上班', 'shàngbān', 'ishga ketmoq; ishda bo‘lmoq', 'fe’l', '上 — boshlamoq · 班 — smena', 'Ertalab ish smenangizni 班 boshladingiz 上. Endi ishga ketdingiz.');
addWord(7, '店', 'diàn', 'do‘kon', 'ot', '店 = 广 + 占', 'Kichik bino 广 oldida sotuvchi turibdi — bu do‘kon.');
addWord(7, '菜', 'cài', 'sabzavot; taom', 'ot', '菜 = 艹 + 采', 'Do‘kondan yashil o‘simlik 艹 sabzavotlarini terib 采 oling.');
addWord(7, '分钟', 'fēnzhōng', 'daqiqa', 'o‘lchov', '分 — bo‘lmoq · 钟 — soat', 'Soat 钟 katta bo‘laklarga 分 bo‘linadi; har kichik bo‘lak — daqiqa.');
addWord(7, '后', 'hòu', 'keyin; orqa', 'ot', '后', 'Avval bir harakat, so‘ng ikkinchisi. Vaqt chizig‘ida keyingi nuqtani belgilang.');

addWord(8, '房间', 'fángjiān', 'xona', 'ot', '房 — uy · 间 — oraliq, bo‘lim', 'Uy 房 ichidagi devorlar bilan ajratilgan bo‘lim 间 — xona.');
addWord(8, '外', 'wài', 'tashqari; tashqi', 'ot', '外 = 夕 + 卜', 'Uy eshigidan chiqib tashqarida turing. Ichki emas — 外.');
addWord(8, '只', 'zhī', 'ta (hayvonlar uchun o‘lchov)', 'o‘lchov', '只 = 口 + 八', 'Bir mushukni ko‘rsatib sanang: bir 只 mushuk. Bu yerda umumiy 个 emas, 只 ishlatiladi.');
addWord(8, '小', 'xiǎo', 'kichik', 'sifat', '小 — uch kichik nuqta obrazi', 'Katta buyumni xayoldan kichraytiring. Uch kichik chiziq — 小.');
addWord(8, '猫', 'māo', 'mushuk', 'ot', '猫 = 犭 + 苗', 'Hayvon 犭 belgisi yonida mushuk miyovlaydi: “Māo”.');
addWord(8, '没', 'méi', 'yo‘q; hali …magan', 'ravish', '没 = 氵+ 殳', 'Qo‘lingizda hech narsa yo‘qligini ko‘rsating. 有 oldiga kelib uni inkor qiladi.');
addWord(8, '看见', 'kànjiàn', 'ko‘rib qolmoq; ko‘rmoq', 'fe’l', '看 — qaramoq · 见 — ko‘rish natijasi', 'Bir tomonga qarab 看, narsani haqiqatan ko‘rib 见 qoldingiz: “Ko‘ryapman”.');
addWord(8, '桌子', 'zhuōzi', 'stol', 'ot', '桌 — stol · 子 — ot yasovchi', 'To‘rt oyoqli stol ustiga kitob qo‘ying. Bu — 桌子.');
addWord(8, '下', 'xià', 'ostida; past; pastga', 'ot / fe’l', '下 = 一 + 卜', 'Chiziqning pastiga nuqta qo‘ying: narsa chiziq ostida 下.');
addWord(8, '漂亮', 'piàoliang', 'chiroyli; go‘zal', 'sifat', '漂 — yorqin · 亮 — nurli', 'Yorqin va nurli 亮 libosdagi odamni ko‘rib: “Juda chiroyli!” deysiz.');
addWord(8, '在', 'zài', '-da; … joyda', 'predlog', '在 = 𠂇 + 土', 'Uchrashuv joyini xaritada belgilang: “Maktabda uchrashamiz”. Joydan oldin 在 keladi.');
addWord(8, '学校', 'xuéxiào', 'maktab', 'ot', '学 — o‘qimoq · 校 — ta’lim binosi', 'O‘qish 学 uchun bolalar keladigan bino 校 — maktab.');
addWord(8, '书店', 'shūdiàn', 'kitob do‘koni', 'ot', '书 — kitob · 店 — do‘kon', 'Javonlari kitob 书 bilan to‘la do‘kon 店 ga kirdingiz.');
addWord(8, '前', 'qián', 'old; oldinda', 'ot', '前', 'Bir odam ortingizda emas, yuzingiz oldida turibdi. Uni ko‘rsating: “Oldinda”.');
addWord(8, '能', 'néng', 'qila olmoq; mumkin', 'modal fe’l', '能 = 厶 + 月 + 匕 + 匕', 'Og‘ir buyumni ko‘tarib: “Men qila olaman” deb ishonch bildiring.');
addWord(8, '到', 'dào', 'yetib kelmoq; yetib bormoq', 'fe’l', '到 = 至 + 刂', 'Xaritadagi manzilga yetib keldingiz. Belgini qo‘ying: “Yetib keldim”.');
addWord(8, '午饭', 'wǔfàn', 'tushlik', 'ot', '午 — tush · 饭 — ovqat', 'Soat tushni 午 ko‘rsatdi, ovqat 饭 vaqti keldi — tushlik.');
addWord(8, '饭', 'fàn', 'ovqat; pishgan guruch', 'ot', '饭 = 饣+ 反', 'Ovqat 饣 idishi oldingizda. Och qoringaningizda: “Ovqat yeyman”.');
addWord(8, '大', 'dà', 'katta', 'sifat', '大 = 人 + 一 obrazi', 'Katta shifoxonani ko‘rsatib qo‘l-oyog‘ingizni keng oching: “Juda katta”.');
addWord(8, '病人', 'bìngrén', 'bemor', 'ot', '病 — kasallik · 人 — odam', 'Kasallik 病 tushgan odam 人 shifokor qabulida — bemor.');
addWord(8, '多', 'duō', 'ko‘p', 'sifat', '多 = 夕 + 夕', 'Shifoxona koridorida ko‘p 多 bemorni tasavvur qiling. Ikki qatlam 夕 miqdorning ko‘pligini eslatadi.');
addWord(8, '医生', 'yīshēng', 'shifokor', 'ot', '医 — tibbiyot · 生 — mutaxassis', 'Tibbiyot 医 biladigan mutaxassis 生 bemorga yordam beradi — shifokor.');
addWord(8, '工作', 'gōngzuò', 'ishlamoq', 'fe’l', '工 — ish · 作 = 亻 + 乍', 'Shifokor odam 亻 shifoxonada o‘z ishini 工 qiladi: “U shifoxonada ishlaydi”.');
addWord(8, '胡医生', 'Hú yīshēng', 'shifokor Hu', 'maxsus ot', '胡 — Hu familiyasi · 医生 — shifokor', 'Oq xalat kiygan Hu familiyali shifokorni tasavvur qiling. Murojaat: 胡医生.');

addWord(9, '前边', 'qiánbian', 'old; old tomon', 'ot', '前 — old · 边 — tomon', 'Maktabning old tomonida 前边 kinoteatr turibdi. Yuzingiz qarab turgan tomonga qadam tashlang.');
addWord(9, '边', 'bian / biān', 'tomon; chet (joy bildiradi)', 'qo‘shimcha / ot', '边 = 力 + 辶', 'Yo‘l 辶 bo‘ylab yurib, uning chetida 边 to‘xtang. Old 前, tashqari 外 kabi so‘zlar bilan joy bildiradi.');
addWord(9, '家', 'jiā', 'ta (oila yoki muassasa uchun)', 'o‘lchov so‘z', '家 = 宀 + 豕', 'Bitta oilani yoki bitta do‘konni sanang: bir 家. Tom 宀 ostidagi uy butun bir oilani eslatadi.');
addWord(9, '那个', 'nàge', 'u; o‘sha bitta', 'olmosh', '那 — u, o‘sha · 个 — umumiy o‘lchov', 'Yaqiningizdagi emas, uzoqroqdagi bitta narsani ko‘rsating: “O‘sha 那个”.');
addWord(9, '外边', 'wàibian', 'tashqari; tashqi tomon', 'ot', '外 — tashqari · 边 — tomon', 'Eshikdan chiqib, binoning tashqi 外 tomoniga 边 o‘ting. Endi siz tashqaridasiz.');
addWord(9, '椅子', 'yǐzi', 'stul', 'ot', '椅 = 木 + 奇 · 子 — ot yasovchi', 'Yog‘och 木 stulni ko‘ring va unga sekin o‘tiring. 椅子 — stul.');
addWord(9, '上', 'shang / shàng', 'ustida; yuqori qismi', 'ot', '上 — yuqori', 'Kitobni stolning ustiga qo‘ying: 桌子上. Narsa pastda emas, yuqorida 上.');
addWord(9, '本', 'běn', 'ta (kitoblar uchun)', 'o‘lchov so‘z', '本 = 木 + 一', 'Bir kitobni ikki qo‘lingizda ushlang: bir 本 kitob. 木 ostidagi 一 chiziq uning ildizini eslatib, kitobni mustahkam ushlang.');
addWord(9, '书', 'shū', 'kitob', 'ot', '书 — kitob', 'Kitobni oching va sahifasini varaqlang. 书 — o‘qiladigan kitob.');
addWord(9, '那', 'nà', 'u; o‘sha', 'olmosh', '那', 'Uzoqdagi bitta narsani barmoq bilan ko‘rsating: “O‘sha 那”.');
addWord(9, '第', 'dì', '-chi (tartib sonini bildiradi)', 'old qo‘shimcha', '第 = ⺮ + 弟', 'Navbatdagi odamlarni sanang: 第一 — birinchi, 第二 — ikkinchi. 第 tartibni boshlaydi.');
addWord(9, '学习', 'xuéxí', 'o‘rganmoq; o‘qimoq', 'fe’l', '学 — o‘rganmoq · 习 — mashq qilmoq', 'Avval yangi narsani o‘rganing 学, keyin mashq qiling 习. Bu ikki harakat — 学习.');
addWord(9, '做', 'zuò', 'qilmoq; shug‘ullanmoq', 'fe’l', '做 = 亻 + 古 + 攵', 'Odam 亻 qo‘li bilan bir ishni bajarib ko‘rsatadi. “Nima qilyapsiz?” — 做 nima?');
addWord(9, '白天', 'báitiān', 'kunduz', 'ot', '白 — oq, yorug‘ · 天 — kun, osmon', 'Oq 白 yorug‘ osmon 天 ostida quyosh charaqlaydi. Bu — kunduz.');
addWord(9, '读书', 'dúshū', 'kitob o‘qimoq; o‘qimoq', 'fe’l', '读 — o‘qimoq · 书 — kitob', 'Qo‘lingizga kitob 书 olib, uning satrlarini diqqat bilan o‘qing 读.');
addWord(9, '和', 'hé', 'bilan; … bilan', 'predlog', '和 = 禾 + 口', 'Do‘stingiz yoningizga kelsin: “Men u 和 birga o‘qiyman” — u bilan.');
addWord(9, '朋友', 'péngyou', 'do‘st', 'ot', '朋 — do‘st · 友 — do‘st, yordamchi', 'Ikki odam yonma-yon 朋 turib, qo‘ldan yordam beradi 友. Bu — do‘stlar.');
addWord(9, '唱', 'chàng', 'kuylamoq', 'fe’l', '唱 = 口 + 昌', 'Og‘iz 口 dan yoqimli ohang chiqadi. Mikrofonni olib qo‘shiq kuylang 唱.');
addWord(9, '歌', 'gē', 'qo‘shiq', 'ot', '歌 = 哥 + 欠', 'Sahna chirog‘i yonadi va yangi qo‘shiq 歌 boshlanadi. Ohangni tinglab, birga kuylang.');
addWord(9, '好听', 'hǎotīng', 'yoqimli eshitiladi; yoqimli ohangli', 'sifat', '好 — yaxshi · 听 — eshitmoq', 'Qo‘shiqni eshitib 听, yuzingizga tabassum yuguradi: “Juda yoqimli 好听!”');
addWord(9, '电视', 'diànshì', 'televizor', 'ot', '电 — elektr · 视 — ko‘rish, tomosha', 'Elektr 电 ishga tushirgan ekranda harakatlanuvchi tasvirni tomosha qilasiz 视 — televizor.');
addWord(9, '狗', 'gǒu', 'it', 'ot', '狗 = 犭 + 句', 'Hayvon 犭 belgisi yonidagi kichik it vovillaydi. Unga “Keling!” deb chaqiring.');
addWord(9, '玩', 'wán', 'o‘ynamoq; dam olmoq', 'fe’l', '玩 = 王 + 元', 'Ishni chetga qo‘yib, do‘stlaringiz bilan o‘yin o‘ynang. Birga quvoning — 玩.');

addWord(10, '杯子', 'bēizi', 'stakan; chashka', 'ot', '杯 = 木 + 不 · 子 — ot yasovchi', 'Qo‘lingizga chashka 杯子 olib, ichidan suv iching. Stol ustidagi aynan shu idishni eslab qoling.');
addWord(10, '售货员', 'shòuhuòyuán', 'sotuvchi', 'ot', '售 — sotmoq · 货 — tovar · 员 — xodim', 'Do‘kondagi xodim 员 tovarni 货 sizga sotadi 售. Bu — sotuvchi.');
addWord(10, '这边', 'zhèbiān', 'bu tomonda; bu yerda', 'olmosh', '这 — bu · 边 — tomon', 'Yaqin joyni qo‘l bilan ko‘rsating: “Bu tomon 这边”. Sotuvchi stakanlarni shu yerga qo‘yadi.');
addWord(10, '钱', 'qián', 'pul', 'ot', '钱 = 钅 + 戋', 'Metall 钅 tangalarni cho‘ntagingizdan olib, narxni to‘lang. Bu — pul.');
addWord(10, '这些', 'zhèxiē', 'bular', 'olmosh', '这 — bu · 些 — bir necha', 'Oldingizdagi bir nechta stakanni bir harakat bilan ko‘rsating: “Bular 这些 qancha?”');
addWord(10, '块', 'kuài', 'yuan (kundalik pul o‘lchovi); bo‘lak', 'o‘lchov so‘z', '块 = 土 + 夬', 'Narx yozilgan kartaga qo‘lingizni qo‘ying: besh 块 — besh yuan. Kundalik narxlarda 块 ishlatiladi.');
addWord(10, '那些', 'nàxiē', 'ular; o‘shalar', 'olmosh', '那 — u, o‘sha · 些 — bir necha', 'Uzoqdagi bir nechta buyumni ko‘rsating: “O‘shalar 那些”. Yaqin bo‘lsa 这些, uzoq bo‘lsa 那些.');
addWord(10, '这儿', 'zhèr', 'bu yer; shu yer', 'olmosh', '这 — bu · 儿 — yer shaklidagi qo‘shimcha', 'Turgan joyingizni barmoq bilan ko‘rsating: “Bu yer 这儿”.');
addWord(10, '水果', 'shuǐguǒ', 'meva', 'ot', '水 — suv, shirali · 果 — meva', 'Shirali 水 meva 果 idishini ko‘ring: olma va boshqa mevalar — 水果.');
addWord(10, '少', 'shǎo', 'kam; oz', 'sifat', '少 = 小 + 丿', 'To‘la idish va ichida ozgina narsa qolgan idishni solishtiring. Ikkinchisi — kam 少.');
addWord(10, '斤', 'jīn', 'jin (500 gramm)', 'o‘lchov so‘z', '斤 — vazn o‘lchovi', 'Taroziga yarim kilogramm olma qo‘ying: bir 斤. Xitoyda meva shu o‘lchov bilan sotiladi.');
addWord(10, '苹果', 'píngguǒ', 'olma', 'ot', '苹 — 苹果 so‘zining birinchi belgisi · 果 — meva', 'Qizil, shirali olmani qo‘lingizga olib bir luqma tishlang. 苹果 — olma.');
addWord(10, '便宜', 'piányi', 'arzon', 'sifat', '便 — qulay · 宜 — mos, qulay', 'Yoqimli narxni ko‘rib tabassum qilasiz: katta pul to‘lash shart emas. Bu — arzon 便宜.');
addWord(10, '商店', 'shāngdiàn', 'do‘kon', 'ot', '商 — savdo · 店 — do‘kon binosi', 'Eshigida tovarlar turgan bino 店 ga kirib xarid qilasiz. Savdo 商 joyi — do‘kon.');
addWord(10, '衣服', 'yīfu', 'kiyim', 'ot', '衣 — kiyim · 服 — kiyim, libos', 'Shkafdan kiyim 衣服 olib, ustingizga kiyib ko‘ring. Bu so‘z kiyimlarning umumiy nomi.');
addWord(10, '件', 'jiàn', 'ta (kiyim uchun o‘lchov)', 'o‘lchov so‘z', '件 = 亻 + 牛', 'Kiyimlarni bittadan sanang: bir 件 ko‘ylak, ikki 件 kiyim.');
addWord(10, '元', 'yuán', 'yuan (Xitoy pul birligi)', 'o‘lchov so‘z', '元 = 二 + 儿', 'Narx belgisiga “yuan” deb o‘qing: o‘n 元. Rasmiy yozuvda 元, kundalik gapda 块 ham ishlatiladi.');
addWord(10, '怎么样', 'zěnmeyàng', 'qanday; qanaqa', 'olmosh', '怎么 — qanday · 样 — ko‘rinish, tur', 'Kiyimni kiyib ko‘rib, do‘stingizdan so‘rang: “Qanday 怎么样? Yaraşdimi?”');
addWord(10, '贵', 'guì', 'qimmat', 'sifat', '贵 = 中 + 一 + 贝', 'Juda katta narx yozilgan kartani ko‘rib, cho‘ntagingizni ushlab qolasiz. Bu — qimmat 贵.');
addWord(10, '穿', 'chuān', 'kiymoq; kiyib olmoq', 'fe’l', '穿 = 穴 + 牙', 'Ko‘ylakni boshidan o‘tkazib, kiyib oling. Kiyinish harakati — 穿.');
addWord(10, '女', 'nǚ', 'ayol; qiz', 'sifat', '女 — ayol', 'Do‘konning ayollar kiyimlari bo‘limini ko‘rsating: 女. Erkaklar bo‘limi esa 男.');
addWord(10, '男', 'nán', 'erkak', 'sifat', '男 = 田 + 力', 'Maydon 田 va kuch 力 tasvirini erkaklar kiyimlari bo‘limi bilan bog‘lang: 男.');
addWord(10, '那儿', 'nàr', 'u yer; o‘sha yer', 'olmosh', '那 — u, o‘sha · 儿 — yer shaklidagi qo‘shimcha', 'Uzoqdagi joyni ko‘rsating: “U yer 那儿”. Bu yer 这儿 dan farq qiladi.');

const lessonOrder = {};
words.forEach(word => {
  lessonOrder[word.lesson] = (lessonOrder[word.lesson] || 0) + 1;
  word.order = lessonOrder[word.lesson];
});

const characterData = {
  '你': ['nǐ', 'sen', '亻 + 尔'], '好': ['hǎo', 'yaxshi', '女 + 子'],
  '王': ['wáng', 'Wang familiyasi; qirol', '三 + 丨'], '老': ['lǎo', 'keksa; tajribali', '耂 + 匕'],
  '师': ['shī', 'ustoz', '刂 + 帀'], '大': ['dà', 'katta', '人 + 一 obrazi'],
  '家': ['jiā', 'uy; oila', '宀 + 豕'], '学': ['xué', 'o‘rganmoq; o‘qimoq', '⺍ + 冖 + 子'],
  '生': ['shēng', 'tug‘ilmoq; o‘sish', '丿 + 三 + 丨'], '们': ['men', '-lar ko‘plik qo‘shimchasi', '亻 + 门'],
  '您': ['nín', 'siz (hurmat)', '你 + 心'], '谢': ['xiè', 'rahmat aytmoq', '讠 + 射'],
  '不': ['bù', 'yo‘q; emas', '一 + 丿 + 丨 + 丶'], '客': ['kè', 'mehmon', '宀 + 各'],
  '气': ['qì', 'havo', '气'], '同': ['tóng', 'bir xil; birga', '冂 + 一 + 口'],
  '再': ['zài', 'yana; qaytadan', '一 + 冂 + 土'], '见': ['jiàn', 'ko‘rmoq; uchrashmoq', '目 obrazi + 儿'],
  '请': ['qǐng', 'iltimos; taklif qilmoq', '讠 + 青'], '问': ['wèn', 'so‘ramoq', '门 + 口'],
  '叫': ['jiào', 'chaqirmoq; ismi … bo‘lmoq', '口 + 丩'], '什': ['shén', '什么 so‘zining birinchi belgisi', '亻 + 十'],
  '么': ['me', 'savol so‘zlaridagi yuklama', '丿 + 厶'], '名': ['míng', 'ism; nom', '夕 + 口'],
  '字': ['zì', 'harf; iyeroglif', '宀 + 子'], '我': ['wǒ', 'men', '扌 obrazi + 戈'],
  '是': ['shì', 'bo‘lmoq; ha', '日 + 疋'], '对': ['duì', 'to‘g‘ri', '又 + 寸'],
  '起': ['qǐ', 'ko‘tarilmoq', '走 + 己'], '没': ['méi', 'yo‘q; hali …magan', '氵 + 殳'],
  '关': ['guān', 'bog‘lamoq; yopmoq', '丷 + 天'], '系': ['xì', 'aloqa; bog‘lam', '丿 + 糸'],
  '事': ['shì', 'ish; masala', '事'], '很': ['hěn', 'juda', '彳 + 艮'],
  '高': ['gāo', 'baland', '亠 + 冂 + 口'], '兴': ['xìng', 'quvonch; qiziqish', '⺍ + 一 + 八'],
  '认': ['rèn', 'tanimoq', '讠 + 人'], '识': ['shi', 'bilmoq; tanish', '讠 + 只'],
  '也': ['yě', 'ham', '也'], '人': ['rén', 'odam; kishi', '人'],
  '的': ['de', '-ning egalik qo‘shimchasi', '白 + 勺'], '中': ['zhōng', 'markaz; Xitoy qisqartmasi', '口 + 丨'],
  '国': ['guó', 'mamlakat', '囗 + 玉'], '法': ['fǎ', 'qonun; usul', '氵 + 去'],
  '文': ['wén', 'yozuv; til', '亠 + 乂'], '这': ['zhè', 'bu', '文 + 辶'],
  '谁': ['shéi / shuí', 'kim', '讠 + 隹'], '女': ['nǚ', 'ayol; qiz', '女'],
  '朋': ['péng', 'do‘st', '月 + 月'], '友': ['yǒu', 'do‘st', '𠂇 + 又'],
  '哪': ['nǎ', 'qaysi', '口 + 那'], '她': ['tā', 'u (ayol)', '女 + 也'],
  '泰': ['tài', 'tinch; farovon', '𡗗 + 氺'], '喂': ['wèi', 'alo; hey', '口 + 畏'],
  '姐': ['jiě', 'opa', '女 + 且'], '工': ['gōng', 'ish; mehnat', '工'],
  '作': ['zuò', 'qilmoq; ish', '亻 + 乍'], '还': ['hái', 'hali; yana', '不 + 辶'],
  '忙': ['máng', 'band', '忄 + 亡'], '吗': ['ma', 'ha-yo‘q savol yuklamasi', '口 + 马'],
  '太': ['tài', 'juda', '大 + 丶'], '想': ['xiǎng', 'xohlamoq; o‘ylamoq', '相 + 心'],
  '有': ['yǒu', 'bor; ega bo‘lmoq', '𠂇 + 月'], '多': ['duō', 'ko‘p', '夕 + 夕'],
  '少': ['shao', 'kam', '小 + 丿'], '个': ['gè', 'ta (umumiy o‘lchov)', '人 obrazi + 丨'],
  '哥': ['gē', 'aka', '可 + 可'], '呢': ['ne', 'savol yuklamasi', '口 + 尼'],
  '几': ['jǐ', 'nechta', '几'], '口': ['kǒu', 'og‘iz', '口'],
  '爸': ['bà', 'dada', '父 + 巴'], '妈': ['mā', 'ona', '女 + 马'],
  '妹': ['mèi', 'singil', '女 + 未'], '和': ['hé', 'va; bilan', '禾 + 口'],
  '儿': ['ér', 'bola; o‘g‘il', '儿'], '子': ['zi', 'bola; so‘z yasovchi', '子'],
  '孩': ['hái', 'bola', '子 + 亥'], '岁': ['suì', 'yosh', '山 + 夕'],
  '他': ['tā', 'u (erkak)', '亻 + 也'], '今': ['jīn', 'hozirgi; shu', '人 + 一 + 𠃌'],
  '年': ['nián', 'yil', '年'], '天': ['tiān', 'kun; osmon', '一 + 大'],
  '号': ['hào', 'sana; raqam', '口 + 丂'], '月': ['yuè', 'oy', '月'],
  '日': ['rì', 'kun; quyosh', '日'], '星': ['xīng', 'yulduz', '日 + 生'],
  '期': ['qī', 'davr', '其 + 月'], '休': ['xiū', 'dam olmoq', '亻 + 木'],
  '息': ['xi', 'nafas; tinchlanish', '自 + 心'], '会': ['huì', 'qila olmoq; bilmoq', '人 + 云'],
  '做': ['zuò', 'qilmoq', '亻 + 古 + 攵'], '饭': ['fàn', 'ovqat', '饣 + 反'],
  '面': ['miàn', 'un; xamir; yuz', '面'], '条': ['tiáo', 'uzun strip', '夂 + 朩'],
  '饺': ['jiǎo', 'chuchvara', '饣 + 交'], '一': ['yī', 'bir', '一'],
  '些': ['xiē', 'bir oz; ba’zi', '此 + 二'], '菜': ['cài', 'taom; sabzavot', '艹 + 采'],
  '下': ['xià', 'past; ostida', '一 + 卜'], '班': ['bān', 'smena; sinf', '王 + 丿 + 王'],
  '新': ['xīn', 'yangi', '立 + 木 + 斤'], '电': ['diàn', 'elektr', '日 + 乚'],
  '脑': ['nǎo', 'miya', '月 + 亠 + 凶'], '真': ['zhēn', 'haqiqiy; rostdan', '十 + 具 obrazi'],
  '看': ['kàn', 'ko‘rmoq; tomosha qilmoq', '手 obrazi + 目'], '喜': ['xǐ', 'quvonch', '士 + 口 + 丷 + 口'],
  '欢': ['huan', 'xursandchilik', '又 + 欠'], '它': ['tā', 'u (narsa yoki hayvon)', '宀 + 匕'],
  '手': ['shǒu', 'qo‘l', '手'], '机': ['jī', 'qurilma', '木 + 几'],
  '话': ['huà', 'gap; so‘z', '讠 + 舌'], '明': ['míng', 'yorqin; ertangi', '日 + 月'],
  '去': ['qù', 'bormoq', '土 + 厶'], '超': ['chāo', 'o‘tmoq; super', '走 + 召'],
  '市': ['shì', 'bozor; shahar', '亠 + 巾'], '买': ['mǎi', 'sotib olmoq', '乛 + 头'],
  '东': ['dōng', 'sharq', '东'], '西': ['xī', 'g‘arb', '西'],
  '牛': ['niú', 'sigir', '牛'], '奶': ['nǎi', 'sut', '女 + 乃'],
  '吃': ['chī', 'yemoq', '口 + 乞'], '晚': ['wǎn', 'kech', '日 + 免'],
  '那': ['nà', 'u; o‘sha', '那'], '边': ['biān', 'tomon', '力 + 辶'],
  '包': ['bāo', 'o‘ramoq; bozi', '勹 + 巳'], '非': ['fēi', 'emas; oddiy emas', '非'],
  '常': ['cháng', 'odatiy; tez-tez', '⺌ + 冖 + 口 + 巾'], '米': ['mǐ', 'guruch', '米'],
  '怎': ['zěn', 'qanday', '乍 + 心'], '坐': ['zuò', 'o‘tirmoq', '人 + 人 + 土'],
  '出': ['chū', 'chiqmoq', '凵 + 山 obrazi'], '租': ['zū', 'ijaraga olmoq', '禾 + 且'],
  '车': ['chē', 'mashina; transport', '车'], '安': ['ān', 'tinch; xavfsiz', '宀 + 女'],
  '现': ['xiàn', 'hozirgi; ko‘rinmoq', '王 + 见'], '在': ['zài', 'bo‘lmoq; -da', '𠂇 + 土'],
  '点': ['diǎn', 'soat; nuqta', '占 + 灬'], '早': ['zǎo', 'erta', '日 + 十'],
  '上': ['shàng', 'yuqori; boshlamoq', '上'], '午': ['wǔ', 'tush', '午'],
  '分': ['fēn', 'daqiqa; bo‘lmoq', '八 + 刀'], '课': ['kè', 'dars', '讠 + 果'],
  '吧': ['ba', 'taklif yuklamasi', '口 + 巴'], '影': ['yǐng', 'soya; tasvir', '景 + 彡'],
  '院': ['yuàn', 'bino; muassasa', '阝 + 完'], '半': ['bàn', 'yarim', '半'],
  '里': ['lǐ / li', 'ichida', '日 + 土'], '医': ['yī', 'tibbiyot', '匚 + 矢'],
  '店': ['diàn', 'do‘kon', '广 + 占'], '钟': ['zhōng', 'soat', '钅 + 中'],
  '后': ['hòu', 'keyin; orqa', '后'], '房': ['fáng', 'uy; xona', '户 + 方'],
  '间': ['jiān', 'oraliq; bo‘lim', '门 + 日'], '外': ['wài', 'tashqari', '夕 + 卜'],
  '只': ['zhī', 'ta (hayvonlar o‘lchovi)', '口 + 八'], '小': ['xiǎo', 'kichik', '小'],
  '猫': ['māo', 'mushuk', '犭 + 苗'], '桌': ['zhuō', 'stol', '卜 + 日 + 木'],
  '漂': ['piào', '漂亮 so‘zining birinchi belgisi', '氵 + 票'], '亮': ['liang', 'nurli; yorqin', '亠 + 口 + 冖 + 几'],
  '校': ['xiào', 'maktab; ta’lim binosi', '木 + 交'], '书': ['shū', 'kitob', '书'],
  '前': ['qián', 'old; oldinda', '前'], '能': ['néng', 'qila olmoq', '厶 + 月 + 匕 + 匕'],
  '到': ['dào', 'yetib kelmoq', '至 + 刂'], '病': ['bìng', 'kasallik', '疒 + 丙'],
  '胡': ['hú', 'Hu familiyasi', '古 + 月'],
  '椅': ['yǐ', 'stul', '木 + 奇'], '本': ['běn', 'kitob; ta (kitoblar uchun)', '木 + 一'],
  '第': ['dì', 'tartib soni belgisi', '⺮ + 弟'], '习': ['xí', 'mashq qilmoq; o‘rganmoq', '习'],
  '白': ['bái', 'oq; yorug‘', '白'], '读': ['dú', 'o‘qimoq', '讠 + 卖'],
  '唱': ['chàng', 'kuylamoq', '口 + 昌'], '歌': ['gē', 'qo‘shiq', '哥 + 欠'],
  '听': ['tīng', 'eshitmoq; tinglamoq', '口 + 斤'], '视': ['shì', 'ko‘rish; tomosha qilish', '礻 + 见'],
  '狗': ['gǒu', 'it', '犭 + 句'], '玩': ['wán', 'o‘ynamoq', '王 + 元'],
  '杯': ['bēi', 'stakan; chashka', '木 + 不'], '售': ['shòu', 'sotmoq', '隹 + 口'],
  '货': ['huò', 'tovar', '化 + 贝'], '员': ['yuán', 'xodim; a’zo', '口 + 贝'],
  '钱': ['qián', 'pul', '钅 + 戋'], '块': ['kuài', 'bo‘lak; yuan', '土 + 夬'],
  '水': ['shuǐ', 'suv', '水'], '果': ['guǒ', 'meva; natija', '日 + 木'],
  '斤': ['jīn', 'jin; 500 gramm', '斤'], '苹': ['píng', '苹果 so‘zining birinchi belgisi', '艹 + 平'],
  '便': ['pián / biàn', 'arzon; qulay', '亻 + 更'], '宜': ['yí', 'qulay; mos', '宀 + 且'],
  '商': ['shāng', 'savdo; tijorat', '商'], '衣': ['yī', 'kiyim', '衣'],
  '服': ['fu', 'kiyim; libos', '月 + 卩 + 又'], '件': ['jiàn', 'ta; buyum', '亻 + 牛'],
  '元': ['yuán', 'yuan; Xitoy pul birligi', '二 + 儿'], '样': ['yàng', 'ko‘rinish; tur', '木 + 羊'],
  '贵': ['guì', 'qimmat', '中 + 一 + 贝'], '穿': ['chuān', 'kiymoq; teshib o‘tmoq', '穴 + 牙'],
  '男': ['nán', 'erkak', '田 + 力']
};

const characters = {};
words.forEach(word => {
  const used = new Set();
  [...word.hanzi].forEach(char => {
    if (used.has(char) || characters[char]) return;
    used.add(char);
    const info = characterData[char] || [word.pinyin, word.meaning, word.parts];
    characters[char] = {
      pinyin: info[0], meaning: info[1], parts: info[2],
      story: `${char} belgisini ${word.hanzi} (${word.meaning}) so‘zi bilan bog‘lang. ${word.story}`,
      lessons: []
    };
  });
  [...new Set(word.hanzi)].forEach(char => {
    if (characters[char] && !characters[char].lessons.includes(word.lesson)) characters[char].lessons.push(word.lesson);
  });
});
