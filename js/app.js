(() => {
  const menuBtn = document.querySelector(".menu-btn");
  const panel = document.getElementById("mobile-nav");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", () => {
      const open = panel.classList.toggle("open");
      panel.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel.classList.contains("open")) {
        panel.classList.remove("open");
        panel.hidden = true;
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
      }
    });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (reduced) { el.classList.add("is-in"); return; }
    el.style.transitionDelay = (i % 6) * 50 + "ms";
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); }
    }, { threshold: 0.14 });
    io.observe(el);
  });

  const ease = (t) => 1 - (1 - t) ** 3;
  document.querySelectorAll("[data-count]").forEach((el) => {
    const value = Number(el.getAttribute("data-count"));
    const plus = el.hasAttribute("data-plus");
    const fmt = (n) => (value >= 1000 ? n.toLocaleString("en-US") : String(n)) + (plus ? "+" : "");
    el.textContent = fmt(value);
    if (reduced) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / 1100);
        el.textContent = fmt(Math.round(ease(t) * value));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
  });

  const filters = document.querySelector("[data-log-filters]");
  if (filters) {
    const rows = [...document.querySelectorAll(".log-row[data-tags]")];
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      const id = btn.getAttribute("data-filter");
      filters.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.toggle("is-on", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      rows.forEach((row) => {
        const tags = row.getAttribute("data-tags") || "";
        row.hidden = id !== "all" && !tags.split(" ").includes(id);
      });
    });
  }

  const typeEl = document.querySelector("[data-type]");
  if (typeEl) {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const SRC = "to you";
    const DROP = new Set([1, 2, 3]);
    const KEEP = [0, 4, 5];
    const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
    const chars = SRC.split("").map((ch, i) => {
      const span = document.createElement("span");
      span.className = "lp-ch";
      if (KEEP.includes(i)) span.dataset.keep = "";
      span.textContent = ch === " " ? "\u00a0" : ch;
      span.style.visibility = "hidden";
      typeEl.appendChild(span);
      return span;
    });
    const caret = document.createElement("span");
    caret.className = "lp-caret";
    typeEl.appendChild(caret);
    const ready = () => {
      document.querySelectorAll(".lp-tag, .lp-dek, .lp-cta, .lp-stats").forEach((n) => n.classList.add("is-in"));
    };
    const run = async () => {
      if (reduced) {
        chars.forEach((el, i) => {
          if (DROP.has(i)) el.classList.add("is-drop");
          else el.style.visibility = "";
        });
        const gg = document.createElement("span");
        gg.className = "lp-gg";
        gg.textContent = ".gg";
        caret.replaceWith(gg);
        typeEl.classList.add("is-done");
        ready();
        return;
      }
      await wait(160);
      for (let i = 0; i < chars.length; i++) {
        chars[i].style.visibility = "";
        await wait(i === 2 ? 170 : 64 + (i % 3) * 14);
      }
      await wait(820);
      const firstX = KEEP.map((i) => chars[i].getBoundingClientRect().left);
      const dropX = chars.map((n) => n.offsetLeft);
      DROP.forEach((i) => {
        chars[i].classList.add("is-drop");
        chars[i].style.left = dropX[i] + "px";
      });
      KEEP.forEach((idx, i) => {
        const el = chars[idx];
        const dx = firstX[i] - el.getBoundingClientRect().left;
        el.animate(
          [{ transform: "translateX(" + dx + "px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0px)" }],
          { duration: 880, easing: EASE, fill: "both" },
        );
      });
      [...DROP].forEach((idx, i) => {
        chars[idx].animate(
          [
            { opacity: 1, filter: "blur(0px)", transform: "translateY(0) rotate(0deg)" },
            { opacity: 0, filter: "blur(10px)", transform: "translateY(1.15em) rotate(11deg)" },
          ],
          { duration: 640, delay: i * 52, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
        );
      });
      await wait(820);
      const gg = document.createElement("span");
      gg.className = "lp-gg";
      gg.textContent = ".gg";
      caret.replaceWith(gg);
      typeEl.classList.add("is-done");
      ready();
    };
    run();
  }
  document.querySelectorAll(".lp-reveal").forEach((el) => {
    if (reduced) { el.classList.add("is-in"); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); }
    }, { threshold: 0.01, rootMargin: "0px 0px 14% 0px" });
    io.observe(el);
  });
  document.querySelectorAll(".chertma[data-to]").forEach((el) => {
    const to = el.getAttribute("data-to");
    setTimeout(() => {
      el.textContent = to;
      el.classList.add("is-fixed");
    }, reduced ? 0 : 2200);
  });
  const weld = document.getElementById("weld-path");
  if (weld && !reduced) {
    const len = weld.getTotalLength();
    weld.style.strokeDasharray = String(len);
    weld.style.strokeDashoffset = String(len);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 1 : Math.min(1, window.scrollY / max);
      weld.style.strokeDashoffset = String(len * (1 - p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  const cn = document.getElementById("cn-day");
  if (cn) {
    const start = Date.UTC(2026, 8, 19);
    const day = Math.max(1, Math.floor((Date.now() - start) / 86400000) + 1);
    cn.innerHTML = '<i class="lg-pulse"></i>Day ' + day;
  }
})();
