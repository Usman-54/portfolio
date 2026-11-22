
/* ==========================================================================
   Usman Ali — Portfolio Scripts
   Navigation, smooth scrolling, GitHub projects,
   project filters, search, reveal animations and footer.
   ========================================================================== */

(function () {
  "use strict";

  const GITHUB_USERNAME = "Usman-54";

  
document.addEventListener("DOMContentLoaded", () => {
    initNavScrollState();
    initSmoothScroll();
    initActiveLinks();
    initFilters();
    initBackToTop();
    initReveal();
    setYear();
});



  /* ==========================================================
     NAVBAR BACKGROUND
     ========================================================== */

  function initNavScrollState() {

    const nav = document.getElementById("siteNav");

    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true
    });

  }


  /* ==========================================================
     SMOOTH SCROLL
     ========================================================== */

  function initSmoothScroll() {

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

      link.addEventListener("click", (event) => {

        const id = link.getAttribute("href");

        if (!id || id === "#") return;

        const target = document.querySelector(id);

        if (!target) return;

        event.preventDefault();

        const nav = document.getElementById("siteNav");

        const offset = nav ? nav.offsetHeight : 0;

        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          Math.max(offset - 1, 0);

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


  /* ==========================================================
     ACTIVE NAVIGATION LINKS
     ========================================================== */

  function initActiveLinks() {

    const links = Array.from(
      document.querySelectorAll(".site-nav .nav-link")
    );

    const sections = links
      .map((link) =>
        document.querySelector(link.getAttribute("href"))
      )
      .filter(Boolean);

    if (
      !("IntersectionObserver" in window) ||
      sections.length === 0
    ) return;

    const observer = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          links.forEach((link) =>
            link.classList.remove("active")
          );

          const active = links.find(
            (link) =>
              link.getAttribute("href") ===
              "#" + entry.target.id
          );

          if (active) active.classList.add("active");

        });

      },

      {
        rootMargin: "-40% 0px -55% 0px"
      }

    );

    sections.forEach((section) =>
      observer.observe(section)
    );

  }


  /* ==========================================================
     PROJECT FILTERS
     Works with dynamically loaded GitHub projects.
     ========================================================== */

  
/* ==========================================================
   PROJECT FILTERS & SEARCH
   Works with manually written HTML project cards.
   ========================================================== */

function initFilters() {

  const buttons = Array.from(
    document.querySelectorAll(".filter-btn")
  );

  const grid = document.getElementById("projectGrid");
  const searchInput = document.getElementById("projectSearch");
  const noProjects = document.getElementById("noProjects");

  if (!grid) return;

  let activeFilter = "all";

  function filterProjects() {

    const search = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    const projects = Array.from(
      grid.querySelectorAll(".project-wrap")
    );

    let visibleCount = 0;

    projects.forEach((project) => {

      const category = project.dataset.category || "other";
      const projectText = project.textContent.toLowerCase();

      const matchesCategory =
        activeFilter === "all" ||
        category === activeFilter;

      const matchesSearch =
        projectText.includes(search);

      const visible = matchesCategory && matchesSearch;

      project.classList.toggle("d-none", !visible);

      if (visible) {
        visibleCount++;
      }

    });

    if (noProjects) {
      noProjects.classList.toggle(
        "d-none",
        visibleCount > 0
      );
    }

  }

  // Category filter buttons
  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      activeFilter = button.dataset.filter || "all";

      buttons.forEach((btn) => {

        const isActive = btn === button;

        btn.classList.toggle("active", isActive);

        btn.setAttribute(
          "aria-pressed",
          String(isActive)
        );

      });

      filterProjects();

    });

  });

  // Search projects
  if (searchInput) {
    searchInput.addEventListener("input", filterProjects);
  }

  // Initial display
  filterProjects();

}


  /* ==========================================================
     GITHUB PROJECTS
     ========================================================== */

  let allProjects = [];

  let activeFilter = "all";


  /* ---------- Safe HTML output ---------- */

  function escapeHTML(value = "") {

    return String(value).replace(/[&<>"']/g, function (char) {

      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];

    });

  }


  /* ---------- Project category ---------- */

  function getCategory(repo) {

    const language = (repo.language || "").toLowerCase();

    const description =
      (repo.description || "").toLowerCase();

    const name = (repo.name || "").toLowerCase();

    const combined = name + " " + description;

    // Full-stack indicators
    if (
      /full.?stack|web application|frontend and backend|front.?end.*back.?end/.test(combined)
    ) {
      return "fullstack";
    }

    // Frontend technologies
    if (
      ["html", "css", "vue", "svelte"].includes(language)
    ) {
      return "frontend";
    }

    // JavaScript / TypeScript classification
    if (
      ["javascript", "typescript"].includes(language)
    ) {

      if (/frontend|react|next.js|vue|angular|interface|ui/.test(combined)) {
        return "frontend";
      }

      if (/api|backend|server|express|node.js/.test(combined)) {
        return "backend";
      }

      return "other";
    }

    // Backend-oriented languages
    if (
      [
        "python",
        "php",
        "java",
        "c#",
        "go",
        "ruby",
        "rust",
        "c++",
        "c"
      ].includes(language)
    ) {
      return "backend";
    }

    return "other";

  }


  /* ---------- Project category labels ---------- */

  function getCategoryLabel(category) {

    const labels = {

      backend: "Backend & APIs",

      fullstack: "Full-Stack Development",

      frontend: "Frontend Development",

      other: "Software Development"

    };

    return labels[category] || labels.other;

  }


  /* ---------- Category icons ---------- */

  function getCategoryIcon(category) {

    const icons = {

      backend: "bi-braces",

      fullstack: "bi-stack",

      frontend: "bi-window",

      other: "bi-code-slash"

    };

    return icons[category] || icons.other;

  }


  /* ---------- Safe live demo URL ---------- */

  function getSafeHomepage(url) {

    if (!url) return "";

    try {

      const parsed = new URL(url);

      if (
        parsed.protocol !== "https:" &&
        parsed.protocol !== "http:"
      ) {
        return "";
      }

      return parsed.href;

    } catch {

      return "";

    }

  }


  /* ---------- Create GitHub project card ---------- */

  function createProjectCard(repo) {

    const category = getCategory(repo);

    const name = escapeHTML(repo.name);

    const description = escapeHTML(
      repo.description ||
      "Explore this GitHub repository to learn more about this project."
    );

    const language = escapeHTML(
      repo.language || "Not specified"
    );

    const updated = new Date(repo.updated_at)
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });

    const homepage = getSafeHomepage(repo.homepage);

    return `

      <div class="col-12 col-md-6 col-lg-4 project-wrap"
           data-category="${category}">

        <article class="project-card h-100 d-flex flex-column">

          <div class="project-type">

            <i class="bi ${getCategoryIcon(category)} me-1"
               aria-hidden="true"></i>

            ${getCategoryLabel(category)}

          </div>


          <h3 class="project-title">
            ${name}
          </h3>


          <p class="project-desc flex-grow-1">
            ${description}
          </p>


          <div class="project-tech">

            <span>${language}</span>

          </div>


          <div class="project-meta d-flex flex-wrap gap-3 mb-3">

            <small class="text-muted-2">

              <i class="bi bi-star me-1"></i>

              ${repo.stargazers_count}

            </small>


            <small class="text-muted-2">

              <i class="bi bi-diagram-2 me-1"></i>

              ${repo.forks_count}

            </small>


            <small class="text-muted-2">

              <i class="bi bi-calendar3 me-1"></i>

              ${updated}

            </small>

          </div>


          <div class="project-actions">

            <a href="${escapeHTML(repo.html_url)}"
               target="_blank"
               rel="noopener noreferrer"
               class="project-link">

              <i class="bi bi-github me-1"></i>

              Repository

            </a>


            ${
              homepage
                ? `
                  <a href="${escapeHTML(homepage)}"
                     target="_blank"
                     rel="noopener noreferrer"
                     class="project-link">

                    <i class="bi bi-box-arrow-up-right me-1"></i>

                    Live Demo

                  </a>
                `
                : ""
            }

          </div>

        </article>

      </div>

    `;

  }


  /* ---------- Display filtered projects ---------- */

  function displayProjects() {

    const grid = document.getElementById("projectGrid");

    const searchInput =
      document.getElementById("projectSearch");

    const noProjects =
      document.getElementById("noProjects");

    if (!grid) return;

    const search = searchInput
      ? searchInput.value.trim().toLowerCase()
      : "";

    const filtered = allProjects.filter((repo) => {

      const category = getCategory(repo);

      const matchesCategory =
        activeFilter === "all" ||
        category === activeFilter;

      const matchesSearch =

        repo.name.toLowerCase().includes(search) ||

        (repo.description || "")
          .toLowerCase()
          .includes(search) ||

        (repo.language || "")
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesSearch;

    });

    grid.innerHTML = filtered
      .map(createProjectCard)
      .join("");

    if (noProjects) {

      noProjects.classList.toggle(
        "d-none",
        filtered.length > 0
      );

    }

  }


  /* ---------- Load all public repositories ---------- */

  async function loadGitHubProjects() {

    const grid = document.getElementById("projectGrid");

    const loading =
      document.getElementById("projectsLoading");

    const error =
      document.getElementById("projectsError");

    const noProjects =
      document.getElementById("noProjects");

    if (!grid) return;

    if (loading) loading.classList.remove("d-none");

    if (error) error.classList.add("d-none");

    if (noProjects) noProjects.classList.add("d-none");

    grid.innerHTML = "";

    try {

      let page = 1;

      let repositories = [];

      while (true) {

        const response = await fetch(

          `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&page=${page}&sort=updated`

        );

        if (!response.ok) {

          throw new Error(
            "GitHub API error: " + response.status
          );

        }

        const data = await response.json();

        if (!Array.isArray(data)) {

          throw new Error("Invalid GitHub API response");

        }

        repositories = repositories.concat(data);

        if (data.length < 100) break;

        page++;

      }

      // Keep every public repository, including forks.
      allProjects = repositories;

      displayProjects();

    } catch (err) {

      console.error("GitHub projects error:", err);

      if (error) error.classList.remove("d-none");

    } finally {

      if (loading) loading.classList.add("d-none");

    }

  }


  /* ---------- Initialize GitHub projects ---------- */

  function initGitHubProjects() {

    const searchInput =
      document.getElementById("projectSearch");

    if (searchInput) {

      searchInput.addEventListener("input", () => {
        displayProjects();
      });

    }

    const retryButton =
      document.getElementById("retryProjects");

    if (retryButton) {

      retryButton.addEventListener("click", () => {
        loadGitHubProjects();
      });

    }

    // Set initial filter
    activeFilter = "all";

    loadGitHubProjects();

  }


  /* ==========================================================
     BACK TO TOP
     ========================================================== */

  function initBackToTop() {

    const btn = document.getElementById("backToTop");

    if (!btn) return;

    const onScroll = () => {

      btn.classList.toggle(
        "visible",
        window.scrollY > 600
      );

    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true
    });

    btn.addEventListener("click", () => {

      const reduceMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({

        top: 0,

        behavior: reduceMotion ? "auto" : "smooth"

      });

    });

  }


  /* ==========================================================
     REVEAL ON SCROLL
     ========================================================== */

  function initReveal() {

    const targets = document.querySelectorAll(

      ".section-label, .section-title, .skill-panel, " +
      ".timeline-item, .edu-card, .filter-bar"

    );

    if (targets.length === 0) return;

    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {

      targets.forEach((target) =>
        target.classList.add("revealed")
      );

      return;

    }

    targets.forEach((target) =>
      target.classList.add("reveal")
    );

    const observer = new IntersectionObserver(

      (entries, obs) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add("revealed");

          obs.unobserve(entry.target);

        });

      },

      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.05
      }

    );

    targets.forEach((target) =>
      observer.observe(target)
    );

  }


  /* ==========================================================
     FOOTER YEAR
     ========================================================== */

  function setYear() {

    const el = document.getElementById("year");

    if (el) {

      el.textContent = new Date().getFullYear();

    }

  }

})();
