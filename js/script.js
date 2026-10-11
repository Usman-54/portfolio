/* ==========================================================================
   Usman Ali — Portfolio Scripts (vanilla JS)
   Nav state, offset smooth-scroll, active links, project filters,
   back-to-top, reveal-on-scroll, footer year.
   ========================================================================== */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNavScrollState();
    initSmoothScroll();
    initActiveLinks();
    initFilters();
    initBackToTop();
    initReveal();
    setYear();
  });

  /* ---------- Navbar background after scrolling ---------- */
  function initNavScrollState() {
    const nav = document.getElementById("siteNav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Smooth scroll with fixed-header offset ---------- */
  function initSmoothScroll() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();
        const nav = document.getElementById("siteNav");
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - Math.max(offset - 1, 0);

        window.scrollTo({
          top: top,
          behavior: reduceMotion ? "auto" : "smooth"
        });

        const menu = document.getElementById("navMenu");
        if (menu && menu.classList.contains("show")) {
          const inst = bootstrap.Collapse.getInstance(menu);
          if (inst) inst.hide();
        }
      });
    });
  }

  /* ---------- Highlight the section currently in view ---------- */
  function initActiveLinks() {
    const links = Array.from(document.querySelectorAll(".site-nav .nav-link"));
    const sections = links
      .map((l) => document.querySelector(l.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.classList.remove("active"));
          const active = links.find(
            (l) => l.getAttribute("href") === "#" + entry.target.id
          );
          if (active) active.classList.add("active");
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Project category filters ---------- */
  function initFilters() {
    const buttons = Array.from(document.querySelectorAll(".filter-btn"));
    const items = Array.from(document.querySelectorAll(".project-wrap"));
    if (buttons.length === 0 || items.length === 0) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        const filter = btn.dataset.filter;
        items.forEach((item) => {
          const show = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("hidden-cat", !show);
        });
      });
    });
  }

  /* ---------- Back-to-top button ---------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const onScroll = () => btn.classList.toggle("visible", window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Subtle reveal-on-scroll ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(
      ".section-label, .section-title, .skill-panel, .timeline-item, .project-wrap, .edu-card, .filter-bar"
    );
    if (targets.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("revealed"));
      return;
    }

    targets.forEach((t) => t.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    targets.forEach((t) => observer.observe(t));
  }

  /* ---------- Dynamic footer year ---------- */
  function setYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
