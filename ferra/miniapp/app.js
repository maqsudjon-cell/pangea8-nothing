"use strict";

const API_BASE_URL = window.FERRA_API_BASE_URL || "https://ferra-api.maqsudjon-polatov.workers.dev";
let tg = window.Telegram?.WebApp;
const STARTERS = [
  { name: "Researcher", subtitle: "Explore any topic", task: "Find, compare and summarize reliable information. Be concise and note uncertainty.", model: "dots-studio/dots-3-note-preview:free", color: "#efb66f", glyph: "R" },
  { name: "Inbox Manager", subtitle: "Draft with confidence", task: "Draft clear, friendly emails and organize communication. Never send anything without explicit approval.", model: "dots-studio/dots-3-note-preview:free", color: "#85d7dc", glyph: "I" },
  { name: "Study Coach", subtitle: "Learn by doing", task: "Explain concepts step by step, create practice questions and help the user learn.", model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", color: "#acd3a4", glyph: "S" }
];
const GLYPHS = {
  A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30], C: [14, 17, 16, 16, 16, 17, 14], D: [30, 17, 17, 17, 17, 17, 30], E: [31, 16, 16, 30, 16, 16, 31], F: [31, 16, 16, 30, 16, 16, 16], G: [14, 17, 16, 23, 17, 17, 14], H: [17, 17, 17, 31, 17, 17, 17], I: [14, 4, 4, 4, 4, 4, 14], J: [7, 2, 2, 2, 18, 18, 12], K: [17, 18, 20, 24, 20, 18, 17], L: [16, 16, 16, 16, 16, 16, 31], M: [17, 27, 21, 21, 17, 17, 17], N: [17, 25, 21, 19, 17, 17, 17], O: [14, 17, 17, 17, 17, 17, 14], P: [30, 17, 17, 30, 16, 16, 16], Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17], S: [15, 16, 16, 14, 1, 17, 30], T: [31, 4, 4, 4, 4, 4, 4], U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 21, 10], X: [17, 17, 10, 4, 10, 17, 17], Y: [17, 17, 10, 4, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
  0: [14, 17, 19, 21, 25, 17, 14], 1: [4, 12, 4, 4, 4, 4, 14], 2: [14, 17, 1, 2, 4, 8, 31], 3: [30, 1, 1, 14, 1, 1, 30], 4: [2, 6, 10, 18, 31, 2, 2], 5: [31, 16, 16, 30, 1, 1, 30], 6: [14, 16, 16, 30, 17, 17, 14], 7: [31, 1, 2, 4, 8, 8, 8], 8: [14, 17, 17, 14, 17, 17, 14], 9: [14, 17, 17, 15, 1, 1, 14]
};
const COLORS = ["#efb66f", "#85d7dc", "#acd3a4", "#b2a7e7", "#e8b64c", "#e8a5a5"];
const TRANSLATIONS = {
  en: { agents: "Agents", chat: "Chat", usage: "Usage", settings: "Settings", yourAgents: "Your agents", capable: "A capable team, ready when you are.", custom: "Create custom agent", yourOwn: "Your own agent", oneJob: "One name. One job. Any model.", add: "Add", added: "Added", create: "Create", cancel: "Cancel", name: "Name", task: "One task", model: "Model", chooseModel: "Choose a model", searchModels: "Search models or paste an ID", ask: "Ask your agent", thinking: "Thinking…", working: "Working…", report: "Report", newChat: "New chat", noAgents: "Create your first agent to start chatting.", connect: "Connect key", removeKey: "Remove key", signOut: "Sign out", delete: "Delete account", tryAgain: "Try again", close: "Close", back: "Back", privacy: "Privacy Policy", terms: "Terms of Use", support: "Support", send: "Send" },
  uz: { agents: "Agentlar", chat: "Suhbat", usage: "Sarflar", settings: "Sozlamalar", yourAgents: "Agentlaringiz", capable: "Ishonchli jamoa, har doim tayyor.", custom: "Maxsus agent yaratish", yourOwn: "O‘z agentingiz", oneJob: "Bitta nom. Bitta vazifa. Istalgan model.", add: "Qo‘shish", added: "Qo‘shilgan", create: "Yaratish", cancel: "Bekor qilish", name: "Nomi", task: "Bitta vazifa", model: "Model", chooseModel: "Model tanlang", searchModels: "Model qidiring yoki ID kiriting", ask: "Agentingizga yozing", thinking: "O‘ylayapti…", working: "Ishlamoqda…", report: "Shikoyat", newChat: "Yangi suhbat", noAgents: "Suhbatni boshlash uchun agent yarating.", connect: "Kalitni ulash", removeKey: "Kalitni olib tashlash", signOut: "Chiqish", delete: "Akkauntni o‘chirish", tryAgain: "Qayta urinish", close: "Yopish", back: "Orqaga", privacy: "Maxfiylik siyosati", terms: "Foydalanish shartlari", support: "Yordam", send: "Yuborish" }
};
const state = {
  token: localStorage.getItem("ferra_mini_token") || "",
  user: null,
  locale: localStorage.getItem("ferra_mini_locale") || "en",
  bots: [],
  activeBot: null,
  threads: [],
  activeThread: null,
  messages: [],
  pendingActions: [],
  models: [],
  modelProvider: "all",
  modelCallback: null,
  sending: false,
  attachment: null,
  attachmentUrl: null,
  toastTimer: null,
  authInProgress: false
};

function t(key) {
  return (TRANSLATIONS[state.locale] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function dotAvatar(name, size = "", id = "") {
  const initial = (String(name || "F").trim().charAt(0) || "F").toUpperCase();
  const glyph = GLYPHS[initial] || GLYPHS.F;
  const color = COLORS[(initial.charCodeAt(0) || 0) % COLORS.length];
  const dots = [];
  glyph.forEach((row, rowIndex) => {
    for (let column = 0; column < 5; column += 1) {
      const visible = row & (1 << (4 - column));
      dots.push(`<span style="visibility:${visible ? "visible" : "hidden"};--i:${dots.length};--dx:${(column - 2) * .7}px;--dy:${(rowIndex - 3) * .6}px"></span>`);
    }
  });
  return `<div ${id ? `id="${escapeHtml(id)}"` : ""} class="dot-avatar ${size}" style="--agent-color:${color}" aria-hidden="true">${dots.join("")}</div>`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => { toast.hidden = true; }, 4200);
}

function showView(name) {
  for (const view of document.querySelectorAll(".view")) view.hidden = view.id !== `view-${name}`;
  const navigation = document.querySelector(".bottom-nav");
  navigation.hidden = name === "loading" || name === "error";
  for (const button of navigation.querySelectorAll("button")) button.classList.toggle("active", button.dataset.tab === name);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function showError(message) {
  document.getElementById("error-message").textContent = message;
  showView("error");
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 204) return null;
  let payload;
  try { payload = await response.json(); } catch { payload = {}; }
  if (!response.ok) {
    const error = new Error(payload.detail || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function applyTranslations() {
  document.documentElement.lang = state.locale;
  document.getElementById("language-button").textContent = state.locale === "uz" ? "UZ" : "EN";
  for (const button of document.querySelectorAll(".bottom-nav button")) {
    button.querySelector("span").textContent = t(button.dataset.tab);
  }
  document.getElementById("show-agent-form").textContent = t("custom");
  document.querySelector("#custom-card h2").textContent = t("yourOwn");
  document.querySelector("#custom-card p").textContent = t("oneJob");
  document.querySelector(".page-heading h1").textContent = t("agents");
  document.querySelector(".page-subtitle").textContent = t("capable");
  document.querySelector(".section-title h2").textContent = t("yourAgents");
  document.querySelector("#agent-form label:nth-of-type(1)").textContent = t("name");
  document.querySelector("#agent-form label:nth-of-type(2)").textContent = t("task");
  document.querySelector("#agent-form label:nth-of-type(3)").textContent = t("model");
  document.getElementById("cancel-agent-form").textContent = t("cancel");
  document.querySelector("#agent-form .primary-button").textContent = t("create");
  document.querySelector("#model-dialog h2").textContent = t("chooseModel");
  document.getElementById("model-search").placeholder = t("searchModels");
  document.getElementById("message-input").placeholder = t("ask");
  document.getElementById("retry-auth").textContent = t("tryAgain");
  document.querySelector("#view-settings h1").textContent = t("settings");
  document.querySelector("#view-usage h1").textContent = t("usage");
}

async function signIn() {
  if (state.authInProgress) return;
  state.authInProgress = true;
  try {
    const initData = window.Telegram?.WebApp?.initData || tg?.initData || "";
    if (!initData) {
      showError("Open Ferra from its Telegram bot menu. Browser-only sign-in is not supported.");
      return;
    }
    const telegramLocale = tg?.initDataUnsafe?.user?.language_code;
    const locale = state.locale || (telegramLocale === "uz" ? "uz" : "en");
    const result = await api("/v1/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ init_data: initData, locale })
    });
    state.token = result.token;
    state.user = result.user;
    state.locale = result.user.locale || locale;
    localStorage.setItem("ferra_mini_token", state.token);
    localStorage.setItem("ferra_mini_locale", state.locale);
    applyTranslations();
    await Promise.all([loadBots(), loadModels()]);
    showView("agents");
  } catch (error) {
    localStorage.removeItem("ferra_mini_token");
    state.token = "";
    showError(error.status === 401 ? "Telegram sign-in could not be verified. Open Ferra again from the bot menu." : error.message);
  } finally {
    state.authInProgress = false;
  }
}

async function loadBots() {
  const result = await api("/v1/bots");
  state.bots = result.bots;
  renderAgents();
}

function renderAgents() {
  const starters = document.getElementById("starter-list");
  starters.className = "starter-grid";
  starters.innerHTML = STARTERS.map(starter => {
    const added = state.bots.some(bot => bot.name === starter.name);
    return `<article class="starter-card">${dotAvatar(starter.name)}<h2>${escapeHtml(starter.name)}</h2><p>${escapeHtml(starter.subtitle)}</p><button class="add-button" type="button" data-action="add-starter" data-name="${escapeHtml(starter.name)}" ${added ? "disabled" : ""}>${added ? t("added") : t("add")}</button></article>`;
  }).join("");
  document.getElementById("custom-avatar").outerHTML = dotAvatar("Ferra", "large", "custom-avatar");
  document.getElementById("agent-count").textContent = state.bots.length ? `· ${state.bots.length}` : "";
  const list = document.getElementById("agent-list");
  if (!state.bots.length) {
    list.innerHTML = `<p class="empty-state">${t("noAgents")}</p>`;
    return;
  }
  list.innerHTML = state.bots.map(bot => `<button class="agent-row" type="button" data-action="open-bot" data-id="${escapeHtml(bot.id)}">${dotAvatar(bot.name)}<span class="agent-row-main"><h3>${escapeHtml(bot.name)}</h3><p>${escapeHtml(bot.task)}</p><small>${escapeHtml(bot.model)}</small></span><span class="agent-chevron">›</span></button>`).join("");
}

async function addStarter(name) {
  const starter = STARTERS.find(item => item.name === name);
  if (!starter) return;
  const button = document.querySelector(`[data-action="add-starter"][data-name="${CSS.escape(name)}"]`);
  if (button) button.disabled = true;
  try {
    await api("/v1/bots", { method: "POST", body: JSON.stringify({ name: starter.name, task: starter.task, model: starter.model }) });
    await loadBots();
  } catch (error) {
    if (button) button.disabled = false;
    showToast(error.message);
  }
}

async function createAgent(event) {
  event.preventDefault();
  const name = document.getElementById("agent-name").value.trim();
  const task = document.getElementById("agent-task").value.trim();
  const model = document.getElementById("new-agent-model").dataset.model || "openrouter/auto";
  if (!name || !task) return;
  const submit = event.target.querySelector("button[type=submit]");
  submit.disabled = true;
  try {
    const bot = await api("/v1/bots", { method: "POST", body: JSON.stringify({ name, task, model }) });
    event.target.reset();
    event.target.hidden = true;
    document.getElementById("custom-card").hidden = false;
    await loadBots();
    await openBot(bot.id);
  } catch (error) {
    showToast(error.message);
  } finally {
    submit.disabled = false;
  }
}

async function loadModels() {
  const result = await api("/v1/models");
  state.models = result.models;
  renderModelOptions();
}

function renderProviderFilters() {
  const providers = [...new Set(state.models.map(model => model.provider))].sort();
  const root = document.getElementById("provider-filters");
  root.innerHTML = `<button type="button" data-provider="all" class="${state.modelProvider === "all" ? "active" : ""}">All</button>` + providers.map(provider => `<button type="button" data-provider="${escapeHtml(provider)}" class="${state.modelProvider === provider ? "active" : ""}">${escapeHtml(provider)}</button>`).join("");
}

function renderModelOptions() {
  renderProviderFilters();
  const query = document.getElementById("model-search").value.trim().toLowerCase();
  const filtered = state.models.filter(model => {
    const providerMatches = state.modelProvider === "all" || model.provider === state.modelProvider;
    const queryMatches = !query || `${model.name} ${model.id}`.toLowerCase().includes(query);
    return providerMatches && queryMatches;
  });
  const root = document.getElementById("model-options");
  if (query && !filtered.some(model => model.id === query)) {
    filtered.unshift({ id: query, name: query, provider: "custom", context_length: 0, input_modalities: ["text"] });
  }
  root.innerHTML = filtered.length ? filtered.slice(0, 60).map(model => {
    const context = model.context_length ? `${Number(model.context_length).toLocaleString()} context` : "Custom model ID";
    const modalities = (model.input_modalities || []).join(" + ");
    return `<button class="model-option" type="button" data-action="choose-model" data-id="${escapeHtml(model.id)}"><strong>${escapeHtml(model.name)}</strong><span>${escapeHtml(model.id)}</span><small>${escapeHtml(context)}${modalities ? ` · ${escapeHtml(modalities)}` : ""}</small></button>`;
  }).join("") : `<p class="empty-state">No models found.</p>`;
}

function openModelPicker(callback) {
  state.modelCallback = callback;
  document.getElementById("model-search").value = "";
  state.modelProvider = "all";
  renderModelOptions();
  document.getElementById("model-dialog").showModal();
}

function renderChatHeader() {
  if (!state.activeBot) return;
  document.getElementById("chat-title").innerHTML = `${dotAvatar(state.activeBot.name, "small")}<h2>${escapeHtml(state.activeBot.name)}</h2>`;
  document.getElementById("chat-model").textContent = state.activeBot.model;
  const select = document.getElementById("thread-select");
  select.innerHTML = state.threads.map(thread => `<option value="${escapeHtml(thread.id)}">${escapeHtml(thread.title)}</option>`).join("");
  if (state.activeThread) select.value = state.activeThread.id;
}

async function openBot(botId) {
  try {
    state.activeBot = state.bots.find(bot => bot.id === botId);
    if (!state.activeBot) return;
    renderChatHeader();
    showView("chat");
    const result = await api(`/v1/bots/${botId}/threads`);
    state.threads = result.threads;
    if (!state.threads.length) {
      const thread = await api(`/v1/bots/${botId}/threads`, { method: "POST", body: JSON.stringify({ title: t("newChat") }) });
      state.threads = [thread];
    }
    state.activeThread = state.threads[0];
    renderChatHeader();
    await loadMessages();
  } catch (error) {
    showToast(error.message);
  }
}

async function createChat() {
  if (!state.activeBot) return;
  try {
    const thread = await api(`/v1/bots/${state.activeBot.id}/threads`, { method: "POST", body: JSON.stringify({ title: t("newChat") }) });
    state.threads.unshift(thread);
    state.activeThread = thread;
    renderChatHeader();
    await loadMessages();
  } catch (error) {
    showToast(error.message);
  }
}

function appendInlineText(root, text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      root.append(strong);
    } else if (part.startsWith("`") && part.endsWith("`")) {
      const code = document.createElement("code");
      code.textContent = part.slice(1, -1);
      root.append(code);
    } else if (part) {
      root.append(document.createTextNode(part));
    }
  }
}

function appendMarkdown(root, text) {
  const segments = String(text || "").split("```");
  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = segment.replace(/^\w*\n/, "");
      pre.append(code);
      root.append(pre);
      return;
    }
    const lines = segment.split("\n");
    let paragraph = [];
    let list = null;
    const flushParagraph = () => {
      if (!paragraph.length) return;
      const element = document.createElement("p");
      appendInlineText(element, paragraph.join(" "));
      root.append(element);
      paragraph = [];
    };
    const flushList = () => {
      if (list) root.append(list);
      list = null;
    };
    for (const line of lines) {
      const trimmed = line.trim();
      const unordered = trimmed.startsWith("- ") || trimmed.startsWith("* ");
      const ordered = /^\d+[.)]\s/.test(trimmed);
      if (unordered || ordered) {
        flushParagraph();
        const type = ordered ? "ol" : "ul";
        if (!list || list.tagName.toLowerCase() !== type) {
          flushList();
          list = document.createElement(type);
        }
        const item = document.createElement("li");
        appendInlineText(item, trimmed.replace(/^[-*]\s+|^\d+[.)]\s+/, ""));
        list.append(item);
      } else if (trimmed) {
        flushList();
        paragraph.push(trimmed);
      } else {
        flushParagraph();
        flushList();
      }
    }
    flushParagraph();
    flushList();
  });
}

async function loadAttachment(image, path) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { headers: { Authorization: `Bearer ${state.token}` } });
    if (!response.ok) return;
    const url = URL.createObjectURL(await response.blob());
    image.src = url;
    image.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
  } catch {}
}

function messageElement(message) {
  const article = document.createElement("article");
  article.className = `message ${message.role === "user" ? "user" : "assistant"}`;
  if (message.attachment_url) {
    const image = document.createElement("img");
    image.className = "attachment-image";
    image.alt = "Selected attachment";
    article.append(image);
    loadAttachment(image, message.attachment_url);
  }
  const content = document.createElement("div");
  content.className = "message-content";
  appendMarkdown(content, message.status === "blocked" ? "Response hidden after report." : message.content);
  article.append(content);
  if (message.role === "assistant") {
    const meta = document.createElement("div");
    meta.className = "message-meta";
    const report = document.createElement("button");
    report.className = "report-button";
    report.type = "button";
    report.dataset.action = "report-message";
    report.dataset.id = message.id;
    report.textContent = t("report");
    const model = document.createElement("span");
    model.textContent = message.model || "";
    meta.append(report, model);
    article.append(meta);
  }
  return article;
}

function actionElement(action) {
  const payload = action.payload || {};
  const card = document.createElement("article");
  card.className = "action-card";
  const title = action.kind === "send_email" ? "Approve email?" : "Approve message?";
  card.innerHTML = `<h3>${escapeHtml(title)}</h3><p><strong>To:</strong> ${escapeHtml(payload.to || payload.recipient || "")}</p>${payload.subject ? `<p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>` : ""}<p>${escapeHtml(payload.body || "")}</p>`;
  if (action.status === "awaiting_confirmation") {
    const note = document.createElement("p");
    note.textContent = action.kind === "send_email" ? "Approved. Open the email composer and confirm sending yourself." : "Approved. Open the message composer and confirm sending yourself.";
    card.append(note);
    const buttons = document.createElement("div");
    buttons.className = "action-buttons";
    buttons.innerHTML = `<button type="button" data-action="open-composer" data-id="${escapeHtml(action.id)}">${action.kind === "send_email" ? "Open Mail" : "Open Messages"}</button><button type="button" data-action="action-outcome" data-id="${escapeHtml(action.id)}" data-outcome="sent">I sent it</button><button class="danger" type="button" data-action="action-outcome" data-id="${escapeHtml(action.id)}" data-outcome="cancelled">Cancel</button>`;
    card.append(buttons);
  } else {
    const buttons = document.createElement("div");
    buttons.className = "action-buttons";
    buttons.innerHTML = `<button type="button" data-action="deny-action" data-id="${escapeHtml(action.id)}">Deny</button><button class="approve" type="button" data-action="approve-action" data-id="${escapeHtml(action.id)}">Approve</button>`;
    card.append(buttons);
  }
  return card;
}

function renderMessages() {
  const root = document.getElementById("message-list");
  root.replaceChildren();
  if (!state.messages.length && !state.pendingActions.length) {
    const empty = document.createElement("div");
    empty.className = "empty-chat";
    empty.innerHTML = `${dotAvatar(state.activeBot?.name || "Ferra", "large")}<h3>${escapeHtml(state.activeBot?.name || "Ferra")}</h3><p>${escapeHtml(state.activeBot?.task || "")}</p>`;
    root.append(empty);
  } else {
    for (const message of state.messages) root.append(messageElement(message));
    for (const action of state.pendingActions) root.append(actionElement(action));
  }
  window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
}

async function loadMessages() {
  if (!state.activeThread) return;
  const result = await api(`/v1/threads/${state.activeThread.id}/messages`);
  state.messages = result.messages;
  state.pendingActions = result.pending_actions;
  renderMessages();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.readAsDataURL(file);
  });
}

function renderAttachmentPreview() {
  const root = document.getElementById("attachment-preview");
  if (!state.attachment) {
    root.hidden = true;
    root.replaceChildren();
    return;
  }
  root.innerHTML = `<img src="${state.attachmentUrl}" alt="Selected attachment"><p>${escapeHtml(state.attachment.file.name)}</p><button type="button" data-action="remove-attachment">Remove</button>`;
  root.hidden = false;
}

async function sendMessage(event) {
  event.preventDefault();
  if (state.sending || !state.activeThread) return;
  const input = document.getElementById("message-input");
  const content = input.value.trim();
  if (!content && !state.attachment) return;
  state.sending = true;
  document.getElementById("send-button").disabled = true;
  document.getElementById("thinking").hidden = false;
  const workingTimer = setTimeout(() => { document.getElementById("thinking-label").textContent = t("working"); }, 1800);
  try {
    const payload = { content };
    if (state.attachment) payload.attachment = { mime_type: state.attachment.file.type, data_base64: state.attachment.dataUrl.split(",")[1] };
    const result = await api(`/v1/threads/${state.activeThread.id}/messages`, { method: "POST", body: JSON.stringify(payload) });
    if (result.user_message) state.messages.push(result.user_message);
    if (result.assistant_message) state.messages.push(result.assistant_message);
    state.pendingActions = result.pending_actions || [];
    input.value = "";
    input.style.height = "auto";
    state.attachment = null;
    state.attachmentUrl = null;
    document.getElementById("image-input").value = "";
    renderAttachmentPreview();
    renderMessages();
  } catch (error) {
    showToast(error.message);
  } finally {
    clearTimeout(workingTimer);
    state.sending = false;
    document.getElementById("thinking").hidden = true;
    document.getElementById("thinking-label").textContent = t("thinking");
    document.getElementById("send-button").disabled = false;
    input.focus();
  }
}

async function resolveAction(actionId, decision) {
  try {
    const result = await api(`/v1/actions/${actionId}`, { method: "POST", body: JSON.stringify({ decision }) });
    if (result.assistant_message) state.messages.push(result.assistant_message);
    state.pendingActions = result.pending_actions;
    renderMessages();
  } catch (error) {
    showToast(error.message);
  }
}

function openComposer(actionId) {
  const action = state.pendingActions.find(item => item.id === actionId);
  if (!action) return;
  const payload = action.payload || {};
  let url;
  if (action.kind === "send_email") {
    url = `mailto:${encodeURIComponent(payload.to || "")}?subject=${encodeURIComponent(payload.subject || "")}&body=${encodeURIComponent(payload.body || "")}`;
  } else {
    url = `sms:${encodeURIComponent(payload.recipient || "")}?body=${encodeURIComponent(payload.body || "")}`;
  }
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, "_blank", "noopener,noreferrer");
}

async function finishAction(actionId, outcome) {
  try {
    const result = await api(`/v1/actions/${actionId}/outcome`, { method: "POST", body: JSON.stringify({ outcome }) });
    if (result.assistant_message) state.messages.push(result.assistant_message);
    state.pendingActions = result.pending_actions;
    renderMessages();
  } catch (error) {
    showToast(error.message);
  }
}

async function reportMessage(event) {
  event.preventDefault();
  const messageId = document.getElementById("report-form").dataset.messageId;
  const category = document.getElementById("report-category").value;
  const details = document.getElementById("report-details").value.trim();
  try {
    await api(`/v1/messages/${messageId}/report`, { method: "POST", body: JSON.stringify({ category, details }) });
    const message = state.messages.find(item => item.id === messageId);
    if (message) message.status = "blocked";
    document.getElementById("report-dialog").close();
    document.getElementById("report-form").reset();
    renderMessages();
    showToast("Response reported and hidden.");
  } catch (error) {
    showToast(error.message);
  }
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function formatCost(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4 }).format(Number(value || 0));
}

async function loadUsage() {
  try {
    const usage = await api("/v1/usage");
    const root = document.getElementById("usage-content");
    const list = (title, rows) => `<section class="usage-list"><h3>${title}</h3>${rows.length ? rows.map(row => `<div class="usage-row"><div>${escapeHtml(row.name)}<small>${formatNumber(row.requests)} requests · ${formatNumber(row.tokens)} tokens</small></div><strong>${formatCost(row.cost_usd)}</strong></div>`).join("") : `<p class="empty-state">No usage yet.</p>`}</section>`;
    const used = Math.min(usage.free_messages_today, usage.free_daily_limit);
    const percentage = usage.free_daily_limit ? Math.min(100, used / usage.free_daily_limit * 100) : 0;
    root.innerHTML = `<article class="usage-hero"><h2>${formatCost(usage.cost_usd)}</h2><div class="usage-stats"><span><strong>${formatNumber(usage.requests)}</strong> requests</span><span>${formatNumber(usage.prompt_tokens + usage.completion_tokens)} tokens</span></div><div class="usage-limit"><div><span>Free usage today</span><strong>${used} / ${usage.free_daily_limit}</strong></div><div class="usage-bar"><span style="width:${percentage}%"></span></div></div></article>${list("By agent", usage.by_bot)}${list("By model", usage.by_model)}`;
  } catch (error) {
    showToast(error.message);
  }
}

function renderSettings() {
  const root = document.getElementById("settings-content");
  const user = state.user;
  root.innerHTML = `<article class="settings-card"><div class="account-row">${dotAvatar(user.display_name || "Ferra", "large")}<div><h2>${escapeHtml(user.display_name || "Ferra")}</h2><p>${escapeHtml(user.auth_provider === "telegram" ? "Telegram account" : "Apple account")}</p></div></div></article>
    <article class="settings-card"><h2>OpenRouter</h2><p>${user.has_openrouter_key ? "Your key is encrypted on Ferra’s server. It is never returned to this device." : "Use the daily free allowance or connect your own OpenRouter key."}</p><form id="byok-form"><label for="openrouter-key">OpenRouter API key</label><input id="openrouter-key" type="password" autocomplete="off" placeholder="sk-or-…" required><button class="primary-button" type="submit">${t("connect")}</button></form>${user.has_openrouter_key ? `<button class="secondary-button" type="button" data-action="remove-byok">${t("removeKey")}</button>` : ""}</article>
    <article class="settings-card"><h2>Preferences</h2><div class="settings-links"><button type="button" data-action="toggle-language"><span>Language / Til</span><span>${state.locale === "uz" ? "O‘zbek" : "English"}</span></button><button type="button" data-tab="usage"><span>${t("usage")}</span><span>›</span></button><a href="../privacy/" data-external><span>${t("privacy")}</span><span>↗</span></a><a href="../terms/" data-external><span>${t("terms")}</span><span>↗</span></a><a href="mailto:polatovmaqsudjon1@gmail.com"><span>${t("support")}</span><span>↗</span></a></div></article>
    <article class="settings-card"><div class="settings-links"><button type="button" data-action="sign-out"><span>${t("signOut")}</span><span>→</span></button><button class="danger-text" type="button" data-action="delete-account"><span>${t("delete")}</span><span>›</span></button></div></article>`;
}

async function connectByok(event) {
  event.preventDefault();
  const input = document.getElementById("openrouter-key");
  const apiKey = input.value.trim();
  if (!apiKey) return;
  try {
    state.user = await api("/v1/me/openrouter-key", { method: "POST", body: JSON.stringify({ api_key: apiKey }) });
    input.value = "";
    renderSettings();
    showToast("OpenRouter key connected and encrypted.");
  } catch (error) {
    showToast(error.message);
  }
}

async function removeByok() {
  try {
    state.user = await api("/v1/me/openrouter-key", { method: "DELETE" });
    renderSettings();
    showToast("OpenRouter key removed.");
  } catch (error) {
    showToast(error.message);
  }
}

async function toggleLanguage() {
  const locale = state.locale === "en" ? "uz" : "en";
  try {
    state.user = await api("/v1/me", { method: "PATCH", body: JSON.stringify({ locale }) });
    state.locale = locale;
    localStorage.setItem("ferra_mini_locale", locale);
    applyTranslations();
    renderAgents();
    renderSettings();
    if (state.activeBot) {
      renderChatHeader();
      renderMessages();
    }
  } catch (error) {
    showToast(error.message);
  }
}

async function signOut() {
  try { await api("/v1/auth/sign_out", { method: "POST" }); } catch {}
  localStorage.removeItem("ferra_mini_token");
  state.token = "";
  state.user = null;
  state.bots = [];
  state.activeBot = null;
  state.activeThread = null;
  state.messages = [];
  state.pendingActions = [];
  showError("Signed out. Use Sign in with Telegram to continue.");
}

async function deleteAccount() {
  const button = document.getElementById("confirm-delete");
  button.disabled = true;
  try {
    await api("/v1/me", { method: "DELETE" });
    document.getElementById("delete-dialog").close();
    localStorage.removeItem("ferra_mini_token");
    state.token = "";
    state.user = null;
    state.bots = [];
    state.activeBot = null;
    state.activeThread = null;
    state.messages = [];
    state.pendingActions = [];
    showError("Your account and app data were deleted.");
  } catch (error) {
    showToast(error.message);
  } finally {
    button.disabled = false;
  }
}

function openExternal(url) {
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, "_blank", "noopener,noreferrer");
}

async function bootstrap() {
  if (tg) {
    tg.ready();
    tg.expand();
    if (tg.setHeaderColor) tg.setHeaderColor("#f5f5f7");
    if (tg.setBackgroundColor) tg.setBackgroundColor("#f5f5f7");
  }
  applyTranslations();
  if (!state.token) {
    await signIn();
    return;
  }
  try {
    state.user = await api("/v1/me");
    state.locale = state.user.locale || state.locale;
    localStorage.setItem("ferra_mini_locale", state.locale);
    applyTranslations();
    await Promise.all([loadBots(), loadModels()]);
    showView("agents");
  } catch (error) {
    if (error.status === 401) {
      localStorage.removeItem("ferra_mini_token");
      state.token = "";
      await signIn();
    } else {
      showError(error.message);
    }
  }
}

document.addEventListener("click", async event => {
  const tab = event.target.closest("[data-tab]");
  if (tab) {
    event.preventDefault();
    const name = tab.dataset.tab;
    if (name === "chat") {
      if (state.activeBot) showView("chat");
      else if (state.bots[0]) await openBot(state.bots[0].id);
      else showToast(t("noAgents"));
    } else {
      showView(name);
      if (name === "usage") await loadUsage();
      if (name === "settings") renderSettings();
    }
    return;
  }
  const closeButton = event.target.closest("[data-close-dialog]");
  if (closeButton) {
    document.getElementById(closeButton.dataset.closeDialog).close();
    return;
  }
  const external = event.target.closest("[data-external]");
  if (external) {
    event.preventDefault();
    openExternal(external.href);
    return;
  }
  const provider = event.target.closest("[data-provider]");
  if (provider) {
    state.modelProvider = provider.dataset.provider;
    renderModelOptions();
    return;
  }
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (action === "add-starter") await addStarter(target.dataset.name);
  else if (action === "open-bot") await openBot(id);
  else if (action === "choose-model") {
    const callback = state.modelCallback;
    document.getElementById("model-dialog").close();
    if (callback) await callback(id);
  } else if (action === "report-message") {
    const form = document.getElementById("report-form");
    form.dataset.messageId = id;
    document.getElementById("report-dialog").showModal();
  } else if (action === "approve-action") await resolveAction(id, "approve");
  else if (action === "deny-action") await resolveAction(id, "deny");
  else if (action === "open-composer") openComposer(id);
  else if (action === "action-outcome") await finishAction(id, target.dataset.outcome);
  else if (action === "remove-attachment") {
    state.attachment = null;
    state.attachmentUrl = null;
    document.getElementById("image-input").value = "";
    renderAttachmentPreview();
  } else if (action === "toggle-language") await toggleLanguage();
  else if (action === "remove-byok") await removeByok();
  else if (action === "sign-out") await signOut();
  else if (action === "delete-account") document.getElementById("delete-dialog").showModal();
});

document.getElementById("show-agent-form").addEventListener("click", () => {
  document.getElementById("custom-card").hidden = true;
  document.getElementById("agent-form").hidden = false;
  document.getElementById("agent-name").focus();
});
document.getElementById("create-agent-button").addEventListener("click", () => document.getElementById("show-agent-form").click());
document.getElementById("cancel-agent-form").addEventListener("click", () => {
  document.getElementById("agent-form").hidden = true;
  document.getElementById("custom-card").hidden = false;
});
document.getElementById("agent-form").addEventListener("submit", createAgent);
document.getElementById("new-agent-model").addEventListener("click", () => {
  openModelPicker(async model => {
    const button = document.getElementById("new-agent-model");
    button.dataset.model = model;
    button.textContent = model;
  });
});
document.getElementById("chat-model").addEventListener("click", () => {
  openModelPicker(async model => {
    if (!state.activeBot) return;
    try {
      state.activeBot = await api(`/v1/bots/${state.activeBot.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: state.activeBot.name, task: state.activeBot.task, model })
      });
      state.bots = state.bots.map(bot => bot.id === state.activeBot.id ? state.activeBot : bot);
      renderChatHeader();
      renderAgents();
    } catch (error) {
      showToast(error.message);
    }
  });
});
document.getElementById("chat-back").addEventListener("click", () => showView("agents"));
document.getElementById("new-chat").addEventListener("click", createChat);
document.getElementById("thread-select").addEventListener("change", async event => {
  state.activeThread = state.threads.find(thread => thread.id === event.target.value);
  await loadMessages();
});
document.getElementById("model-search").addEventListener("input", renderModelOptions);
document.getElementById("message-form").addEventListener("submit", sendMessage);
document.getElementById("message-input").addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    document.getElementById("message-form").requestSubmit();
  }
});
document.getElementById("message-input").addEventListener("input", event => {
  event.target.style.height = "auto";
  event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
});
document.getElementById("attach-button").addEventListener("click", () => document.getElementById("image-input").click());
document.getElementById("image-input").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    showToast("Choose a JPEG, PNG or WebP image.");
    event.target.value = "";
    return;
  }
  if (file.size > 1_500_000) {
    showToast("Image must be smaller than 1.5 MB.");
    event.target.value = "";
    return;
  }
  try {
    const dataUrl = await readFileAsDataUrl(file);
    state.attachment = { file, dataUrl };
    state.attachmentUrl = dataUrl;
    renderAttachmentPreview();
  } catch (error) {
    showToast(error.message);
  }
});
document.getElementById("report-form").addEventListener("submit", reportMessage);
document.getElementById("settings-content").addEventListener("submit", event => {
  if (event.target.id === "byok-form") connectByok(event);
});
document.getElementById("language-button").addEventListener("click", toggleLanguage);
document.getElementById("retry-auth").addEventListener("click", signIn);
document.getElementById("confirm-delete").addEventListener("click", deleteAccount);

bootstrap();
