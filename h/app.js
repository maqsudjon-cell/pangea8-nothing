const STORAGE_KEY = 'hanzi-lesson-1-v2';
const DAY = 86400000;
const INTERVALS = [1, 2, 4, 7, 14];
const speakerIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h4l5 4V6l-5 4zM17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></svg>';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

function loadState() {
  try {
    const old = JSON.parse(localStorage.getItem('hanzi-lesson-1-v1') || '{}');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const legacyBest = Number(saved.best || old.best) || 0;
    return {
      learned: new Set((saved.learned || old.learned || []).map(Number)),
      bests: saved.bests || (legacyBest ? { 1: legacyBest } : {}),
      reviews: saved.reviews || {},
      written: new Set(saved.written || []),
      lesson: Number(saved.lesson) >= 1 && Number(saved.lesson) <= 8 ? Number(saved.lesson) : 1
    };
  } catch {
    return { learned: new Set(), bests: {}, reviews: {}, written: new Set(), lesson: 1 };
  }
}

const saved = loadState();
const state = {
  view: 'words', lesson: saved.lesson, filter: 'all', search: '',
  learned: saved.learned, bests: saved.bests, reviews: saved.reviews, written: saved.written,
  cardIndex: 0, revealed: false, direction: 'meaning', quiz: null, find: null,
  writer: null, writerVersion: 0, writeChar: '你', writeMode: 'show'
};
let activeWords = [];
let activeCharacters = [];

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      learned: [...state.learned], bests: state.bests, reviews: state.reviews,
      written: [...state.written], lesson: state.lesson
    }));
  } catch {}
}

let toastTimer;
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

function speak(word, button) {
  if (!('speechSynthesis' in window)) return toast('Bu brauzerda ovozli talaffuz mavjud emas.');
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.hanzi);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.78;
  const chineseVoice = window.speechSynthesis.getVoices().find(voice => voice.lang.toLowerCase().startsWith('zh'));
  if (chineseVoice) utterance.voice = chineseVoice;
  $$('.icon-button.speaking').forEach(el => el.classList.remove('speaking'));
  if (button) {
    button.classList.add('speaking');
    utterance.onend = utterance.onerror = () => button.classList.remove('speaking');
  }
  window.speechSynthesis.speak(utterance);
}

function isDue(word) {
  return !state.learned.has(word.id) || !state.reviews[word.id] || state.reviews[word.id].due <= Date.now();
}

function updateProgress() {
  const count = activeWords.filter(word => state.learned.has(word.id)).length;
  const percent = Math.round(count / activeWords.length * 100);
  $('#goal-label').textContent = `${state.lesson}-dars natijasi`;
  $('#goal-percent').textContent = `${percent}%`;
  $('#goal-bar').style.width = `${percent}%`;
  $('#goal-count').textContent = count;
  $('#goal-total').textContent = activeWords.length;
  $('#learned-stat').textContent = count;
  $('#due-count').textContent = activeWords.filter(isDue).length;
  $('#best-stat').textContent = state.bests[state.lesson] ? `${state.bests[state.lesson]}%` : '—';
}

function reviewLabel(wordId) {
  const review = state.reviews[wordId];
  if (!review || !state.learned.has(wordId)) return '';
  if (review.due <= Date.now()) return 'Hozir takrorlang';
  const days = Math.ceil((review.due - Date.now()) / DAY);
  return days < 1 ? 'Bugun yana qaytadi' : `${days} kundan keyin takror`;
}

function renderLesson() {
  const lesson = lessons[state.lesson];
  const heroWord = words.find(word => word.hanzi === lesson.hero) || activeWords[0];
  document.title = `Hanzi — ${state.lesson}-dars: ${lesson.title}`;
  $('#lesson-select').value = state.lesson;
  $('#topbar-lesson').textContent = `${state.lesson}-dars`;
  $('#lesson-label').textContent = `${state.lesson}-DARS · ${lesson.title.toLocaleUpperCase('uz')}`;
  $('#words-title').textContent = lesson.headline;
  $('#lesson-description').textContent = `${lesson.description} Darsda ${activeWords.length} ta New Words yozuvi bor.`;
  $('#hero-character').textContent = lesson.hero;
  $('#hero-character').classList.toggle('long', lesson.hero.length > 2);
  $('#hero-pinyin').textContent = `${heroWord.pinyin} · ${heroWord.meaning}`;
  $('#words-stat').textContent = activeWords.length;
  $('#find-kicker').textContent = `${state.lesson}-DARS · HANZINI TOPISH`;
  $('#quiz-kicker').textContent = `${state.lesson}-DARS · TEST`;
}

function renderWords() {
  const query = state.search.trim().toLocaleLowerCase();
  const filtered = activeWords.filter(word => {
    const matchesFilter = state.filter === 'all' || (state.filter === 'learned' && state.learned.has(word.id)) || (state.filter === 'learning' && !state.learned.has(word.id));
    return matchesFilter && (!query || `${word.hanzi} ${word.pinyin} ${word.meaning}`.toLocaleLowerCase().includes(query));
  });
  $('#word-grid').innerHTML = filtered.map(word => {
    const learned = state.learned.has(word.id);
    return `<article class="word-card${learned ? ' learned' : ''}">
      <div class="word-card-top"><span class="type-pill">${escapeHTML(word.type)}</span>${learned ? '<span class="learned-badge">✓ O‘rganilgan</span>' : `<span class="word-number">№ ${word.order}</span>`}</div>
      <div class="word-main"><div><h3 class="word-hanzi" lang="zh">${word.hanzi}</h3><p class="word-pinyin">${word.pinyin}</p></div><button class="icon-button" data-speak="${word.id}" aria-label="${word.hanzi} talaffuzini tinglash">${speakerIcon}</button></div>
      <p class="word-meaning">${escapeHTML(word.meaning)}</p><p class="review-date">${reviewLabel(word.id)}</p>
      <div class="word-note" id="note-${word.id}" hidden><strong>${escapeHTML(word.parts)}</strong><p>${escapeHTML(word.story)}</p><small>Yodlash hikoyasi, etimologiya emas.</small></div>
      <div class="word-footer"><button class="note-toggle" data-note="${word.id}">Yodlash usuli</button><button class="learn-toggle" data-learned="${word.id}">${learned ? 'Belgilashni olish' : 'O‘rgandim deb belgilash'}</button></div>
    </article>`;
  }).join('');
  $('#visible-count').textContent = `${filtered.length} / ${activeWords.length} ta so‘z`;
  $('#empty-state').hidden = filtered.length > 0;
  updateProgress();
}

function switchView(view) {
  state.view = view;
  $$('.view').forEach(el => {
    el.hidden = el.id !== `view-${view}`;
    el.classList.toggle('active', el.id === `view-${view}`);
  });
  $$('.nav-item').forEach(el => {
    const active = el.dataset.view === view;
    el.classList.toggle('active', active);
    if (active) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  if (view === 'cards') renderCard();
  if (view === 'quiz' && !state.quiz) renderQuizStart();
  if (view === 'find' && !state.find) renderFindStart();
  if (view === 'write') mountWriter();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setLesson(lesson, initial = false) {
  state.lesson = Number(lesson);
  activeWords = words.filter(word => word.lesson === state.lesson).sort((a, b) => a.order - b.order);
  activeCharacters = [...new Set(activeWords.flatMap(word => [...word.hanzi]))];
  state.cardIndex = 0;
  state.revealed = false;
  state.quiz = null;
  state.find = null;
  state.search = '';
  state.filter = 'all';
  state.writeChar = activeCharacters.includes(state.writeChar) ? state.writeChar : activeCharacters[0];
  $('#search').value = '';
  $$('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === 'all'));
  renderLesson();
  renderWords();
  refreshCharacterPicker();
  if (!initial) persist();
  if (state.view === 'cards') renderCard();
  if (state.view === 'quiz') renderQuizStart();
  if (state.view === 'find') renderFindStart();
  if (state.view === 'write') mountWriter();
}

function renderCard() {
  const word = activeWords[state.cardIndex];
  const meaningMode = state.direction === 'meaning';
  const review = state.reviews[word.id] || { step: 0 };
  $('#card-position').textContent = `${state.cardIndex + 1} / ${activeWords.length} · ${activeWords.filter(isDue).length} ta takror`;
  $('#card-bar').style.width = `${(state.cardIndex + 1) / activeWords.length * 100}%`;
  $('#card-type').textContent = word.type;
  $('#recall-prompt').textContent = meaningMode ? 'MA’NOSIDAN HANZINI ESLANG' : 'HANZINING MA’NOSINI ESLANG';
  $('#card-hanzi').textContent = word.hanzi;
  $('#card-pinyin').textContent = word.pinyin;
  $('#card-meaning').textContent = word.meaning;
  $('#card-hanzi').classList.toggle('concealed-text', meaningMode && !state.revealed);
  $('#card-pinyin').classList.toggle('concealed-text', meaningMode && !state.revealed);
  $('#card-answer').classList.toggle('concealed', !meaningMode && !state.revealed);
  $('#card-answer').setAttribute('aria-hidden', String(!meaningMode && !state.revealed));
  $('#answer-label').textContent = meaningMode ? 'SAVOL: O‘ZBEKCHA MA’NOSI' : 'O‘ZBEKCHA MA’NOSI';
  $('#reveal-card').innerHTML = state.revealed ? 'Javobni yashirish <kbd>Space</kbd>' : 'Javobni ko‘rsatish <kbd>Space</kbd>';
  $('#card-note').hidden = !state.revealed;
  $('#card-story').textContent = word.story;
  $('#card-parts').textContent = word.parts;
  $('#good-interval').textContent = `${INTERVALS[Math.min(review.step + 1, 4)]} kundan keyin`;
  $('#easy-interval').textContent = `${INTERVALS[Math.min(review.step + 2, 4)]} kundan keyin`;
  $$('[data-direction]').forEach(button => button.classList.toggle('active', button.dataset.direction === state.direction));
}

function moveCard(direction, dueOnly = false) {
  let pool = activeWords;
  if (dueOnly) {
    const due = activeWords.filter(word => isDue(word) && word.id !== activeWords[state.cardIndex].id);
    if (due.length) pool = due;
  }
  const current = pool.findIndex(word => word.id === activeWords[state.cardIndex].id);
  const next = pool[(current + direction + pool.length) % pool.length];
  state.cardIndex = activeWords.findIndex(word => word.id === next.id);
  state.revealed = false;
  renderCard();
}

function reviewWord(grade) {
  const word = activeWords[state.cardIndex];
  const old = state.reviews[word.id] || { step: 0, reviews: 0 };
  let step, due;
  if (grade === 'hard') {
    step = 0;
    due = Date.now() + 600000;
    state.learned.delete(word.id);
  } else {
    step = Math.min(old.step + (grade === 'easy' ? 2 : 1), 4);
    due = Date.now() + INTERVALS[step] * DAY;
    state.learned.add(word.id);
  }
  state.reviews[word.id] = { step, due, reviews: old.reviews + 1 };
  persist();
  updateProgress();
  moveCard(1, true);
}

function flagDifficult(word) {
  const old = state.reviews[word.id] || { reviews: 0 };
  state.learned.delete(word.id);
  state.reviews[word.id] = { step: 0, due: Date.now() + 600000, reviews: old.reviews + 1 };
  persist();
  updateProgress();
}

function markRecognized(word) {
  const old = state.reviews[word.id] || { reviews: 0 };
  state.learned.add(word.id);
  state.reviews[word.id] = { step: Math.max(old.step || 0, 0), due: Date.now() + DAY, reviews: old.reviews + 1 };
  persist();
  updateProgress();
}

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function renderQuizStart() {
  const count = Math.min(10, activeWords.length);
  $('#quiz-area').innerHTML = `<div class="quiz-start"><div class="quiz-start-icon" lang="zh">试</div><h2>${count} ta savolga tayyormisiz?</h2><p>Savollar ${state.lesson}-darsdagi ${activeWords.length} ta so‘zdan tasodifiy tanlanadi. Javob berganingizdan keyin to‘g‘ri variant ko‘rsatiladi.</p><div class="quiz-meta"><span>${count} savol</span><span>4 variant</span><span>Vaqt cheklanmagan</span></div><button class="primary-button" id="start-quiz">Testni boshlash <span aria-hidden="true">→</span></button></div>`;
}

function startQuiz() {
  state.quiz = { questions: shuffled(activeWords).slice(0, Math.min(10, activeWords.length)), index: 0, score: 0, answered: false, options: {} };
  renderQuiz();
}

function quizOptions(word) {
  if (!state.quiz.options[word.id]) state.quiz.options[word.id] = shuffled([word, ...shuffled(activeWords.filter(item => item.id !== word.id)).slice(0, 3)]);
  return state.quiz.options[word.id];
}

function renderQuiz() {
  const quiz = state.quiz;
  if (!quiz) return renderQuizStart();
  if (quiz.index >= quiz.questions.length) return renderQuizResult();
  const word = quiz.questions[quiz.index];
  const options = quizOptions(word);
  $('#quiz-area').innerHTML = `<div class="quiz-card"><div class="quiz-status"><span>Savol <strong>${quiz.index + 1} / ${quiz.questions.length}</strong></span><span>To‘g‘ri javob: <strong>${quiz.score}</strong></span></div><div class="progress-track"><span style="width:${quiz.index / quiz.questions.length * 100}%"></span></div><div class="quiz-prompt"><span>BU SO‘ZNING MA’NOSI QAYSI?</span><h2 lang="zh">${word.hanzi}</h2><p>${word.pinyin}</p></div><div class="quiz-options">${options.map((option, index) => `<button class="quiz-option" data-answer="${option.id}" ${quiz.answered ? 'disabled' : ''}><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option.meaning)}</span></button>`).join('')}</div><button class="primary-button quiz-next" id="next-question" hidden>${quiz.index === quiz.questions.length - 1 ? 'Natijani ko‘rish' : 'Keyingi savol'} <span aria-hidden="true">→</span></button></div>`;
}

function answerQuiz(answerId) {
  const quiz = state.quiz;
  if (!quiz || quiz.answered) return;
  quiz.answered = true;
  const word = quiz.questions[quiz.index];
  if (answerId === word.id) quiz.score++;
  else flagDifficult(word);
  $$('.quiz-option').forEach(button => {
    const id = Number(button.dataset.answer);
    button.disabled = true;
    if (id === word.id) button.classList.add('correct');
    if (id === answerId && answerId !== word.id) button.classList.add('wrong');
  });
  $('.quiz-status span:last-child strong').textContent = quiz.score;
  $('#next-question').hidden = false;
  $('#next-question').focus();
}

function renderQuizResult() {
  const quiz = state.quiz;
  const percent = Math.round(quiz.score / quiz.questions.length * 100);
  const isNewBest = percent > (state.bests[state.lesson] || 0);
  if (isNewBest) {
    state.bests[state.lesson] = percent;
    persist();
    updateProgress();
  }
  const message = percent >= 80 ? 'Ajoyib natija! So‘zlarni yaxshi eslab qolibsiz.' : percent >= 50 ? 'Yaxshi boshlanish. Kartochkalarni takrorlab, yana urinib ko‘ring.' : 'Mashq davom etsin. Avval kartochkalardagi ma’nolarni takrorlang.';
  $('#quiz-area').innerHTML = `<div class="quiz-result"><span class="section-kicker">TEST YAKUNLANDI</span><div class="result-score">${quiz.score}/${quiz.questions.length}</div><h2>${percent >= 80 ? 'Barakalla!' : 'Yaxshi urinish!'}</h2><p>${message}${isNewBest ? ' Bu sizning eng yaxshi natijangiz.' : ''}</p><div class="result-actions"><button class="secondary-button" data-go="cards">Kartochkalar</button><button class="primary-button" id="restart-quiz">Qayta ishlash <span aria-hidden="true">↻</span></button></div></div>`;
}

function renderFindStart() {
  $('#find-area').innerHTML = `<div class="find-start"><div class="find-start-demo" aria-hidden="true"><span>工作</span><span class="demo-missed">里</span><span>米饭</span><span>谁</span></div><span class="section-kicker">DOSKA O‘YINI</span><h2>${activeWords.length} ta hanzini toping</h2><p>Har savolda pinyin va ma’no beriladi. Xato qilsangiz yoki “Bilmadim” desangiz, to‘g‘ri hanzi qizil doiraga olinadi va so‘z keyin yana chiqadi.</p><div class="quiz-meta"><span>+100 ball</span><span>Seriya bonusi</span><span>Qiyin so‘z qaytadi</span></div><button class="primary-button" id="start-find">O‘yinni boshlash <span aria-hidden="true">→</span></button></div>`;
}

function startFind() {
  state.find = {
    queue: shuffled(activeWords), solved: new Set(), score: 0, streak: 0, bestStreak: 0,
    attempts: 0, correctAttempts: 0, answered: false, currentWrong: false,
    wrongIds: [], mistakes: {}, lastCorrect: null
  };
  renderFind();
}

function findWordStyle(word, index) {
  const palette = ['#292b29', '#8052a0', '#c7547a', '#358c89', '#b38a27', '#3c70a5', '#66923e'];
  const sizes = [30, 34, 38, 32, 36];
  const tilts = [-3, 2, -1, 3, 0, -2];
  const shifts = [-5, 3, 0, 5, -2];
  const seed = word.id + index;
  return `--word-color:${palette[seed % palette.length]};--font-size:${sizes[seed % sizes.length]}px;--tilt:${tilts[seed % tilts.length]}deg;--dx:${shifts[seed % shifts.length]}px;--dy:${shifts[(seed + 2) % shifts.length]}px`;
}

function renderFind() {
  const game = state.find;
  if (!game.queue.length) return renderFindResult();
  const word = game.queue[0];
  const accuracy = game.attempts ? Math.round(game.correctAttempts / game.attempts * 100) : 100;
  const board = activeWords.map((item, index) => {
    const classes = ['find-word'];
    if (game.solved.has(item.id)) classes.push('solved');
    if (game.answered && item.id === word.id) classes.push(game.lastCorrect ? 'correct-target' : 'missed-target');
    if (game.answered && game.wrongIds.includes(item.id)) classes.push('wrong-choice');
    return `<button class="${classes.join(' ')}" style="${findWordStyle(item, index)}" data-find-id="${item.id}" lang="zh" aria-label="${item.hanzi}" ${game.answered || game.solved.has(item.id) ? 'disabled' : ''}>${item.hanzi}<span aria-hidden="true">✓</span></button>`;
  }).join('');
  let feedback = '<div class="find-feedback neutral"><strong>Hanzini doskadan toping</strong><span>Javobni xayolda ayting, keyin belgini bosing.</span></div>';
  if (game.answered && game.lastCorrect) feedback = `<div class="find-feedback correct" role="status"><strong>To‘g‘ri — ${word.hanzi}</strong><span>${game.currentWrong ? 'Bu safar topdingiz. So‘z o‘rganilganlar qatoriga qo‘shildi.' : `+${100 + Math.max(0, game.streak - 1) * 10} ball. Seriya davom etmoqda!`}</span></div>`;
  if (game.answered && !game.lastCorrect) feedback = `<div class="find-feedback wrong" role="status"><strong>To‘g‘ri javob: ${word.hanzi}</strong><span>${escapeHTML(word.story)}</span><small>Bu so‘z navbat oxiriga qo‘shildi — keyin yana topasiz.</small></div>`;
  $('#find-area').innerHTML = `<div class="find-game">
    <div class="find-stats"><div><span>BALL</span><strong>${game.score}</strong></div><div><span>SERIYA</span><strong>${game.streak}×</strong></div><div><span>ANQLIK</span><strong>${accuracy}%</strong></div><div><span>TOPILDI</span><strong>${game.solved.size}/${activeWords.length}</strong></div></div>
    <div class="progress-track find-progress"><span style="width:${game.solved.size / activeWords.length * 100}%"></span></div>
    <div class="find-prompt"><div><span>SHU HANZINI TOPING</span><h2>${word.pinyin}</h2><p>${escapeHTML(word.meaning)}</p></div><button class="icon-button" id="find-speak" aria-label="Talaffuzni tinglash">${speakerIcon}</button></div>
    <div class="find-board" aria-label="Hanzi doskasi">${board}</div>
    ${feedback}
    <div class="find-controls"><button class="secondary-button" id="restart-find">Qayta boshlash</button><button class="dont-know-button" id="find-unknown" ${game.answered ? 'disabled' : ''}>Bilmadim</button><button class="primary-button" id="next-find" ${game.answered ? '' : 'hidden'}>${game.solved.size === activeWords.length ? 'Natijani ko‘rish' : 'Keyingi savol'} <span aria-hidden="true">→</span></button></div>
  </div>`;
}

function answerFind(answerId) {
  const game = state.find;
  if (!game || game.answered) return;
  const word = game.queue[0];
  const correct = answerId === word.id;
  game.attempts++;
  game.answered = true;
  game.lastCorrect = correct;
  game.wrongIds = correct ? [] : [answerId].filter(Boolean);
  if (correct) {
    game.correctAttempts++;
    game.solved.add(word.id);
    if (!game.currentWrong) {
      game.score += 100 + game.streak * 10;
      game.streak++;
    } else {
      game.score += 40;
      game.streak = 0;
    }
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    markRecognized(word);
  } else {
    game.currentWrong = true;
    game.streak = 0;
    game.mistakes[word.id] = (game.mistakes[word.id] || 0) + 1;
    game.queue.push(word);
    flagDifficult(word);
  }
  renderFind();
  if (game.answered) $('#next-find').focus();
}

function nextFind() {
  const game = state.find;
  if (!game || !game.answered) return;
  game.queue.shift();
  game.answered = false;
  game.currentWrong = false;
  game.wrongIds = [];
  game.lastCorrect = null;
  renderFind();
}

function renderFindResult() {
  const game = state.find;
  const accuracy = game.attempts ? Math.round(game.correctAttempts / game.attempts * 100) : 0;
  const difficult = Object.entries(game.mistakes).sort((a, b) => b[1] - a[1]).map(([id, count]) => ({ word: activeWords.find(item => item.id === Number(id)), count }));
  $('#find-area').innerHTML = `<div class="find-result"><span class="section-kicker">DOSKA TOZALANDI</span><div class="result-score">${accuracy}%</div><h2>${difficult.length ? 'Yana bir muhim qadam!' : 'Barcha so‘zlar topildi!'}</h2><p>${game.score} ball · eng uzun seriya ${game.bestStreak}× · ${game.attempts} ta urinish</p>${difficult.length ? `<div class="difficult-list"><h3>Keyingi mashq uchun qiyin so‘zlar</h3>${difficult.map(({ word, count }) => `<div><span lang="zh">${word.hanzi}</span><p><strong>${word.pinyin}</strong>${escapeHTML(word.meaning)}</p><small>${count} xato</small></div>`).join('')}</div>` : '<p class="perfect-note">Hech qanday xato yo‘q. Endi Yoddan yozish bilan mustahkamlang.</p>'}<div class="result-actions"><button class="secondary-button" data-go="cards">Qiyinlarini takrorlash</button><button class="primary-button" id="restart-find">Yana o‘ynash <span aria-hidden="true">↻</span></button></div></div>`;
}

const strokeCache = new Map();
function getStrokes(char) {
  if (!strokeCache.has(char)) strokeCache.set(char, fetch(`strokes/${encodeURIComponent(char)}.json`).then(response => {
    if (!response.ok) throw new Error('Yozuv ma’lumoti yuklanmadi');
    return response.json();
  }).catch(error => {
    strokeCache.delete(char);
    throw error;
  }));
  return strokeCache.get(char);
}

function refreshCharacterPicker() {
  $('#write-character').innerHTML = activeCharacters.map(char => `<option value="${char}">${char} — ${escapeHTML(characters[char].meaning)}</option>`).join('');
  renderCharacterList();
}

function renderCharacterList() {
  $('#character-list').innerHTML = activeCharacters.map(char => `<button class="character-button${char === state.writeChar ? ' active' : ''}${state.written.has(char) ? ' written' : ''}" data-char="${char}" aria-label="${char} — ${escapeHTML(characters[char].meaning)}">${char}${state.written.has(char) ? '<i>✓</i>' : ''}</button>`).join('');
}

function updateWritingInfo() {
  const char = state.writeChar;
  const info = characters[char];
  $('#write-character').value = char;
  $('#write-hanzi').textContent = char;
  $('#write-pinyin').textContent = info.pinyin;
  $('#write-meaning').textContent = info.meaning;
  $('#write-parts').textContent = info.parts;
  $('#write-story').textContent = info.story;
  renderCharacterList();
}

async function mountWriter(mode = 'show') {
  if (typeof HanziWriter === 'undefined') {
    $('#writer-status').textContent = 'Yozuv moduli yuklanmadi.';
    return;
  }
  const char = state.writeChar;
  const version = ++state.writerVersion;
  state.writeMode = mode;
  if (state.writer) {
    try { state.writer.cancelQuiz(); } catch {}
  }
  $('#hanzi-writer').innerHTML = '';
  updateWritingInfo();
  const size = Math.min(360, Math.max(250, $('#hanzi-writer').clientWidth || 320));
  $('#writer-status').textContent = 'Yozuv tayyorlanmoqda…';
  try {
    const data = await getStrokes(char);
    if (char !== state.writeChar || version !== state.writerVersion) return;
    state.writer = HanziWriter.create('hanzi-writer', char, {
      width: size, height: size, padding: 20, renderer: 'svg', showOutline: true, showCharacter: true,
      strokeColor: '#282923', outlineColor: '#e2ddd3', drawingColor: '#c84b3c', highlightColor: '#c84b3c',
      drawingWidth: 12, strokeAnimationSpeed: 1, delayBetweenStrokes: 220,
      charDataLoader: (character, complete) => complete(data)
    });
    $('#writer-status').textContent = 'Namunani kuzating yoki mashqni boshlang.';
  } catch {
    $('#writer-status').textContent = 'Yozuv ma’lumotini ochib bo‘lmadi. Sahifani Hanzi.command orqali ishga tushiring.';
  }
}

function startWriting(mode) {
  if (!state.writer) return;
  state.writeMode = mode;
  state.writer.cancelQuiz();
  const mistakes = { count: 0 };
  $('#writer-status').textContent = mode === 'trace' ? 'Kulrang shablon ustidan chiziqlar tartibida yozing.' : 'Shablonsiz, yoddan yozing. Xato qilsangiz yordam chiqadi.';
  if (mode === 'recall') state.writer.hideOutline();
  else state.writer.showOutline();
  state.writer.hideCharacter();
  state.writer.quiz({
    showHintAfterMisses: mode === 'trace' ? 1 : 3, markStrokeCorrectAfterMisses: 5, leniency: mode === 'trace' ? 1.15 : 1,
    onMistake: () => {
      mistakes.count++;
      $('#writer-status').textContent = `Davom eting — ${mistakes.count} ta xato. Keyingi chiziqni kuzating.`;
    },
    onCorrectStroke: () => { $('#writer-status').textContent = 'To‘g‘ri! Keyingi chiziqni yozing.'; },
    onComplete: summary => {
      state.written.add(state.writeChar);
      persist();
      renderCharacterList();
      $('#writer-status').textContent = `Barakalla! ${state.writeChar} yozildi${summary.totalMistakes ? ` — ${summary.totalMistakes} xato bilan` : ' — xatosiz'}. Yana bir bor takrorlang.`;
      toast('Yozish mashqi yakunlandi. Zo‘r!');
    }
  });
}

$('#lesson-select').innerHTML = Object.entries(lessons).map(([id, lesson]) => `<option value="${id}">${id}-dars · ${lesson.title} (${words.filter(word => word.lesson === Number(id)).length})</option>`).join('');
$('#lesson-select').addEventListener('change', event => setLesson(event.target.value));
$('#reset-progress').addEventListener('click', () => {
  if (!window.confirm('Barcha darslardagi o‘rganilgan so‘zlar, test va yozish natijalari o‘chirilsinmi?')) return;
  state.learned.clear();
  state.written.clear();
  state.reviews = {};
  state.bests = {};
  state.quiz = null;
  state.find = null;
  setLesson(1);
  switchView('words');
  toast('Barcha natijalar tozalandi. Yangidan boshlashingiz mumkin.');
});
$('#word-grid').addEventListener('click', event => {
  const speakButton = event.target.closest('[data-speak]');
  const learnedButton = event.target.closest('[data-learned]');
  const noteButton = event.target.closest('[data-note]');
  if (speakButton) speak(activeWords.find(word => word.id === Number(speakButton.dataset.speak)), speakButton);
  if (noteButton) {
    const note = $(`#note-${noteButton.dataset.note}`);
    note.hidden = !note.hidden;
    noteButton.textContent = note.hidden ? 'Yodlash usuli' : 'Hikoyani yashirish';
  }
  if (learnedButton) {
    const id = Number(learnedButton.dataset.learned);
    if (state.learned.has(id)) {
      state.learned.delete(id);
      delete state.reviews[id];
    } else {
      state.learned.add(id);
      state.reviews[id] = { step: 0, due: Date.now() + DAY, reviews: 0 };
    }
    persist();
    renderWords();
  }
});
$('#search').addEventListener('input', event => {
  state.search = event.target.value;
  renderWords();
});
$$('.filter').forEach(button => button.addEventListener('click', () => {
  state.filter = button.dataset.filter;
  $$('.filter').forEach(el => el.classList.toggle('active', el === button));
  renderWords();
}));
$$('[data-view]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
document.addEventListener('click', event => {
  const go = event.target.closest('[data-go]');
  if (go) switchView(go.dataset.go);
});
$('.brand').addEventListener('click', event => {
  event.preventDefault();
  switchView('words');
});
$$('[data-direction]').forEach(button => button.addEventListener('click', () => {
  state.direction = button.dataset.direction;
  state.revealed = false;
  renderCard();
}));
$('#card-speak').addEventListener('click', () => {
  if (state.direction === 'meaning' && !state.revealed) return toast('Avval o‘zingiz eslang, keyin talaffuzni tinglang.');
  speak(activeWords[state.cardIndex], $('#card-speak'));
});
$('#reveal-card').addEventListener('click', () => {
  state.revealed = !state.revealed;
  renderCard();
});
$('#prev-card').addEventListener('click', () => moveCard(-1));
$('#next-card').addEventListener('click', () => moveCard(1));
$('#shuffle-card').addEventListener('click', () => {
  let next = state.cardIndex;
  while (next === state.cardIndex) next = Math.floor(Math.random() * activeWords.length);
  state.cardIndex = next;
  state.revealed = false;
  renderCard();
});
$('#review-hard').addEventListener('click', () => reviewWord('hard'));
$('#review-good').addEventListener('click', () => reviewWord('good'));
$('#review-easy').addEventListener('click', () => reviewWord('easy'));
$('#write-character').addEventListener('change', event => {
  state.writeChar = event.target.value;
  mountWriter();
});
$('#character-list').addEventListener('click', event => {
  const button = event.target.closest('[data-char]');
  if (button) {
    state.writeChar = button.dataset.char;
    mountWriter();
  }
});
$('#animate-writer').addEventListener('click', () => {
  if (state.writer) {
    state.writer.cancelQuiz();
    state.writer.showOutline();
    state.writer.hideCharacter();
    state.writer.animateCharacter();
    $('#writer-status').textContent = 'Chiziqlarning ketma-ketligini diqqat bilan kuzating.';
  }
});
$('#trace-writer').addEventListener('click', () => startWriting('trace'));
$('#recall-writer').addEventListener('click', () => startWriting('recall'));
$('#quiz-area').addEventListener('click', event => {
  if (event.target.closest('#start-quiz') || event.target.closest('#restart-quiz')) startQuiz();
  const answer = event.target.closest('[data-answer]');
  if (answer) answerQuiz(Number(answer.dataset.answer));
  if (event.target.closest('#next-question')) {
    state.quiz.index++;
    state.quiz.answered = false;
    renderQuiz();
  }
});
$('#find-area').addEventListener('click', event => {
  if (event.target.closest('#start-find') || event.target.closest('#restart-find')) startFind();
  const answer = event.target.closest('[data-find-id]');
  if (answer) answerFind(Number(answer.dataset.findId));
  if (event.target.closest('#find-unknown')) answerFind(null);
  if (event.target.closest('#next-find')) nextFind();
  if (event.target.closest('#find-speak') && state.find) speak(state.find.queue[0], $('#find-speak'));
});
document.addEventListener('keydown', event => {
  if (['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(document.activeElement.tagName)) return;
  if (state.view === 'cards') {
    if (event.code === 'Space') {
      event.preventDefault();
      state.revealed = !state.revealed;
      renderCard();
    }
    if (event.key === 'ArrowRight') moveCard(1);
    if (event.key === 'ArrowLeft') moveCard(-1);
  }
  if (state.view === 'find' && event.key === 'Enter' && state.find?.answered) nextFind();
});

const now = new Date();
const weekdays = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
$('#today').textContent = `${now.getDate()}-${months[now.getMonth()]}, ${weekdays[now.getDay()]}`;
setLesson(state.lesson, true);
