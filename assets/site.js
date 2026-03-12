(() => {
  // Dynamic day counter
  const disappeared = new Date('2026-02-27T17:00:00Z');
  const daysSince = Math.floor((new Date() - disappeared) / 86400000);
  if (daysSince > 0) {
    const navStatus = document.getElementById('nav-day-status');
    if (navStatus) {
      const base = navStatus.textContent.trim();
      if (base.includes('day ')) {
        navStatus.textContent = base.replace(/day \d+/, `day ${daysSince}`);
      } else {
        navStatus.textContent = base + ` // day ${daysSince}`;
      }
    }
    const dayCount = document.getElementById('day-count');
    if (dayCount) dayCount.textContent = daysSince;
  }

  const currentFile = (() => {
    const segment = window.location.pathname.split("/").pop();
    return segment || "mccasland-investigation.html";
  })();

  document.querySelectorAll("[data-nav-file]").forEach((link) => {
    if (link.getAttribute("data-nav-file") === currentFile) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll("[data-jump-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const value = select.value;
      if (!value) {
        return;
      }
      const target = document.querySelector(value);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  document.querySelectorAll("[data-diagram]").forEach((diagramRoot) => {
    const nodes = [...diagramRoot.querySelectorAll("[data-node]")];
    const panels = [...diagramRoot.querySelectorAll("[data-panel]")];

    const activate = (name) => {
      nodes.forEach((node) => {
        node.classList.toggle("active", node.getAttribute("data-node") === name);
      });
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-panel") === name);
      });
    };

    nodes.forEach((node) => {
      const name = node.getAttribute("data-node");
      node.addEventListener("click", () => activate(name));
      node.addEventListener("mouseenter", () => activate(name));
      node.addEventListener("focus", () => activate(name));
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate(name);
        }
      });
    });
  });

  const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
  const sectionTargets = sectionLinks
    .map((link) => {
      const selector = link.getAttribute("href");
      const target = selector ? document.querySelector(selector) : null;
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if (sectionTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) {
          return;
        }

        const activeId = visibleEntries[0].target.id;
        sectionTargets.forEach(({ link, target }) => {
          link.classList.toggle("active", target.id === activeId);
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.15, 0.4, 0.7],
      },
    );

    sectionTargets.forEach(({ target }) => observer.observe(target));
  }
})();
