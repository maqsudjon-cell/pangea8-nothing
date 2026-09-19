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
})();
