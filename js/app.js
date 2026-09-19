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
    const paint = (typed, dropping, gg) => {
      const chars = SRC.split("").map((ch, i) => {
        const cls = ["lp-ch"];
        if (i >= typed) cls.push("is-hid");
        if (dropping && DROP.has(i)) cls.push("is-drop");
        const t = ch === " " ? "&nbsp;" : ch;
        return '<span class="' + cls.join(" ") + '">' + t + "</span>";
      }).join("");
      typeEl.innerHTML = chars + (gg ? '<span class="lp-gg">.gg</span>' : '<span class="lp-caret"></span>');
      typeEl.classList.toggle("is-done", gg);
    };
    const run = async () => {
      if (reduced) {
        typeEl.classList.add("is-done");
        typeEl.innerHTML = 'tou<span class="lp-gg">.gg</span>';
        document.querySelectorAll(".lp-tag, .lp-dek, .lp-cta").forEach((n) => n.classList.add("is-in"));
        return;
      }
      for (let i = 1; i <= SRC.length; i++) {
        paint(i, false, false);
        await wait(i === 3 ? 140 : 78);
      }
      await wait(720);
      paint(SRC.length, true, false);
      await wait(520);
      paint(SRC.length, true, true);
      document.querySelectorAll(".lp-tag, .lp-dek, .lp-cta").forEach((n) => n.classList.add("is-in"));
    };
    run();
  }
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
