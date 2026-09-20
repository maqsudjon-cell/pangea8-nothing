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
  const reveals = $$(".lp-reveal");
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
    }, { threshold: 0.06, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.94) el.classList.add("is-in");
      else io.observe(el);
    });
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
  if (weld && !reduced) {
    const len = weld.getTotalLength();
    weld.style.strokeDasharray = String(len);
    weld.style.strokeDashoffset = String(len);
    let queued = false;
    const draw = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max <= 0 ? 1 : Math.min(1, scrollY / max);
      weld.style.strokeDashoffset = String(len * (1 - p));
      queued = false;
    };
    draw();
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(draw); } }, { passive: true });
    addEventListener("resize", draw, { passive: true });
  }

  /* ------------------------------------------------------- live day counter */
  const day = $("[data-since]");
  if (day) {
    const start = Date.parse(day.dataset.since + "T00:00:00Z");
    const n = Math.max(1, Math.floor((Date.now() - start) / 86_400_000) + 1);
    day.querySelector("[data-n]").textContent = String(n);
  }

  /* ------------------------------------------------------------- word mark
     The HTML already says "tou.gg". This replays how it got there: type
     "to you", drop the middle, close the gap, land ".gg". Once per session —
     an animation you cannot skip is a tax on the reader. */
  const mark = $("[data-wordmark]");
  const PLAYED = "tou:intro";
  if (mark && !reduced && !sessionStorage.getItem(PLAYED)) {
    const tou = $(".lp-type", mark);
    const gg = $(".lp-gg", mark);
    const keep = tou ? $$(".ch", tou) : [];          // t, o, u — already in the DOM
    if (keep.length === 3 && gg) {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

      const play = async () => {
        try { sessionStorage.setItem(PLAYED, "1"); } catch {}
        mark.classList.add("is-typing");
        gg.style.opacity = "0";

        // 1. Remember where "tou" sits, then widen it back out into "to you".
        const home = keep.map((el) => el.getBoundingClientRect().left);
        const ghosts = ["o", " ", "y"].map((c) => {
          const s = document.createElement("span");
          s.className = "ch is-ghost";
          s.setAttribute("aria-hidden", "true");
          s.textContent = c;
          return s;
        });
        keep[1].before(...ghosts);                    // t [o _ y] o u
        const wide = keep.map((el) => el.getBoundingClientRect().left);

        // 2. Type "to you", one letter at a time.
        const order = [keep[0], ghosts[0], ghosts[1], ghosts[2], keep[1], keep[2]];
        order.forEach((el) => { el.style.visibility = "hidden"; });
        for (const el of order) {
          el.style.visibility = "";
          el.animate(
            [{ opacity: 0, transform: "translateY(0.2em)" }, { opacity: 1, transform: "none" }],
            { duration: 220, easing: EASE },
          );
          await sleep(el === ghosts[1] ? 90 : 58);
        }
        await sleep(620);
        mark.classList.remove("is-typing");

        // 3. The middle falls out; t, o, u slide back to where "tou" was.
        ghosts.forEach((el, i) => {
          el.style.left = el.offsetLeft + "px";
          el.classList.add("is-falling");
          el.animate(
            [{ opacity: 1, transform: "translateY(0) rotate(0deg)" },
             { opacity: 0, transform: "translateY(-0.55em) rotate(-10deg)", filter: "blur(8px)" }],
            { duration: 440, delay: i * 45, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" },
          );
        });
        const slides = keep.map((el, i) =>
          el.animate(
            [{ transform: "translateX(0)" }, { transform: `translateX(${home[i] - wide[i]}px)` }],
            { duration: 620, easing: EASE, fill: "forwards" },
          ));
        await sleep(640);

        // 4. Drop the ghosts so the layout really is "tou", then land ".gg".
        ghosts.forEach((el) => el.remove());
        slides.forEach((a) => a.cancel());
        gg.style.opacity = "";
        gg.animate(
          [{ opacity: 0, transform: "translateY(-0.25em)" }, { opacity: 1, transform: "none" }],
          { duration: 420, easing: EASE },
        );
      };

      const recover = () => {
        mark.classList.remove("is-typing");
        $$(".ch.is-ghost", mark).forEach((el) => el.remove());
        keep.forEach((el) => { el.style.visibility = ""; el.getAnimations().forEach((a) => a.cancel()); });
        gg.style.opacity = "";
      };
      const start = () => play().catch(recover);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(start, start);
      else start();
    }
  }
})();
