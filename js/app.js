/* tou.gg — progressive enhancement only.
   Every word on the page is readable with this file blocked. Nothing here
   creates content; it only animates content the HTML already shipped. */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------------------------------------------------------------- header
     The bar is transparent until you scroll. Without this, it printed the nav
     straight over the body text. */
  const bar = $(".lp-bar");
  if (bar) {
    let ticking = false;
    const sync = () => { bar.classList.toggle("is-scrolled", scrollY > 6); ticking = false; };
    sync();
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }, { passive: true });
  }

  /* ----------------------------------------------------------- mobile menu */
  const burger = $("[data-burger]");
  const sheet = $("#menu-sheet");
  if (burger && sheet) {
    const setOpen = (open) => {
      sheet.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? burger.dataset.close : burger.dataset.open);
    };
    burger.addEventListener("click", () => setOpen(sheet.hidden));
    sheet.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) { setOpen(false); burger.focus(); } });
    matchMedia("(width >= 720px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  /* -------------------------------------------------------- scroll reveals */
  const reveals = $$(".lp-reveal, .lp-mask");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const show = (el) => { el.classList.add("is-in"); io.unobserve(el); };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // isIntersecting alone loses anything a fast scroll jumped clean over,
        // so anything now above the fold counts as seen too.
        if (e.isIntersecting || e.boundingClientRect.top < 0) show(e.target);
      }
    }, { threshold: 0.02, rootMargin: "0px 0px 15% 0px" });
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 1.1) el.classList.add("is-in");
      else io.observe(el);
    });
    // Safety net. A full-page screenshot, a printed page, a browser that
    // throttles observers in a background tab — anything that never fires an
    // intersection would otherwise leave whole sections blank for good.
    setTimeout(() => reveals.forEach((el) => el.classList.add("is-in")), 4000);
  }

  /* ------------------------------------------------------------- count-ups */
  const counters = $$("[data-count]");
  if (counters.length && !reduced && "IntersectionObserver" in window) {
    const ease = (t) => 1 - (1 - t) ** 3;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target;
        const to = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const locale = document.documentElement.lang || "en";
        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / 900);
          el.textContent = Math.round(ease(t) * to).toLocaleString(locale) + (t === 1 ? suffix : "");
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    counters.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------- weld seam
     The line down the left edge draws itself as the page scrolls. */
  const weld = $("#weld-path");
  const bead = $(".lp-bead");
  if (weld && !reduced) {
    const len = weld.getTotalLength();
    weld.style.strokeDasharray = String(len);
    weld.style.strokeDashoffset = String(len);
    let queued = false;
    const draw = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max <= 0 ? 1 : Math.min(1, scrollY / max);
      weld.style.strokeDashoffset = String(len * (1 - p));
      // The lit bead sits where the seam is being laid right now.
      if (bead) {
        bead.style.top = (p * 100).toFixed(2) + "%";
        bead.style.opacity = p > 0.004 && p < 0.997 ? "1" : "0";
      }
      queued = false;
    };
    draw();
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(draw); } }, { passive: true });
    addEventListener("resize", draw, { passive: true });
  }

  /* ------------------------------------------------------- Chertma demo
     The flagship row shows what the product does: the ASCII a keyboard can
     type, corrected in place to the New Latin it should have been. The HTML
     ships the corrected form's meaning either way — this only animates it. */
  const chertma = $(".chertma[data-to]");
  if (chertma) {
    const fix = () => {
      chertma.textContent = chertma.dataset.to;
      chertma.classList.add("is-fixed");
    };
    if (reduced || !("IntersectionObserver" in window)) fix();
    else {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setTimeout(fix, 900);
      }, { threshold: 0.6 });
      io.observe(chertma);
    }
  }

  /* ------------------------------------------------------- live day counter */
  const day = $("[data-since]");
  if (day) {
    const start = Date.parse(day.dataset.since + "T00:00:00Z");
    const n = Math.max(1, Math.floor((Date.now() - start) / 86_400_000) + 1);
    day.querySelector("[data-n]").textContent = String(n);
  }

  /* ------------------------------------------------------------- word mark
     tou.gg is an abbreviation with a sentence behind it:
        t o  y ou ,  g iven  g ladly
        ^ ^    ^^     ^        ^
     The page ships "tou.gg" in the HTML. This plays the sentence once a
     session and collapses it into the mark — the five letters that survive
     fly into their final place, everything else falls away, and the dot lands
     last. Click, tap or any key ends it immediately. */
  const mark = $("[data-wordmark]");
  const SEEN = "tou:intro";
  if (mark) {
    const word = $(".lp-word", mark);
    const intro = $(".lp-intro", mark);
    const gg = $(".lp-gg", mark);
    const targets = $$(".ch", word);            // t o u . g g
    const phrase = intro && intro.dataset.intro ? intro.dataset.intro : "";

    // Which characters of the phrase survive, and which target each becomes.
    //   "to you, given gladly"  ->  t(0) o(1) u(5) g(8) g(14)
    const KEEP = { 0: 0, 1: 1, 5: 2, 8: 4, 14: 5 };

    const seen = (() => { try { return sessionStorage.getItem(SEEN); } catch { return null; } })();

    if (!reduced && intro && word && targets.length === 6 && phrase && !seen) {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        mark.classList.remove("is-intro");
        intro.textContent = "";
        word.style.opacity = "";
        removeEventListener("keydown", finish);
        mark.removeEventListener("click", finish);
      };

      const play = async () => {
        try { sessionStorage.setItem(SEEN, "1"); } catch {}
        mark.classList.add("is-intro");
        addEventListener("keydown", finish, { once: true });
        mark.addEventListener("click", finish, { once: true });

        // 1. Build the sentence, one span per character.
        const cells = [...phrase].map((c, i) => {
          const el = document.createElement("span");
          el.className = "ch" + (i in KEEP ? " keep" : "") + (i in KEEP && KEEP[i] >= 4 ? " is-gg" : "");
          el.textContent = c === " " ? "\u00a0" : c;
          el.style.opacity = "0";
          intro.appendChild(el);
          return el;
        });

        // 2. Type it.
        for (const el of cells) {
          if (done) return finish();
          el.style.opacity = "";
          el.animate([{ opacity: 0, transform: "translateY(0.18em)" }, { opacity: 1, transform: "none" }],
                     { duration: 180, easing: EASE });
          await sleep(el.textContent === "\u00a0" ? 52 : 26);
        }
        await sleep(620);
        if (done) return finish();

        // 3. Everything that is not in the abbreviation falls away.
        let n = 0;
        cells.forEach((el, i) => {
          if (i in KEEP) return;
          el.animate([{ opacity: 1, transform: "none", filter: "blur(0)" },
                      { opacity: 0, transform: "translateY(0.5em)", filter: "blur(5px)" }],
                     { duration: 320, delay: (n++) * 14, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
        });

        // 4. The five that survive fly into the mark, growing as they go.
        await sleep(180);
        if (done) return finish();
        for (const [idx, t] of Object.entries(KEEP)) {
          const from = cells[idx].getBoundingClientRect();
          const to = targets[t].getBoundingClientRect();
          if (!from.width || !to.width) continue;
          const scale = to.width / from.width;
          cells[idx].style.transformOrigin = "left top";
          cells[idx].animate(
            [{ transform: "translate(0, 0) scale(1)" },
             { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})` }],
            { duration: 760, easing: EASE, fill: "forwards" },
          );
        }
        await sleep(700);
        if (done) return finish();

        // 5. Hand over to the real mark and land the dot it never had.
        word.style.opacity = "1";
        mark.classList.remove("is-intro");
        intro.textContent = "";
        targets[3].animate([{ opacity: 0, transform: "scale(.2)" }, { opacity: 1, transform: "none" }],
                           { duration: 380, easing: EASE });
        finish();
      };

      play().catch(finish);
    } else if (!seen) {
      try { sessionStorage.setItem(SEEN, "1"); } catch {}
    }
  }
})();
