(function () {
  const root = document.getElementById("experience-showcase");
  if (!root) return;

  const tabs = root.querySelectorAll("[data-experience-tab]");
  const bgs = root.querySelectorAll("[data-experience-bg]");
  const track = root.querySelector(".experience-showcase__track");
  const panels = root.querySelectorAll('[role="tabpanel"]');
  const cta = root.querySelector("[data-experience-cta]");
  const count = tabs.length;

  const ctaTargets = [
    {
      href: "https://thejuniper.com/",
      label: "Find out more",
    },
    {
      href: "https://thejuniper.com/",
      label: "Find out more",
    },
    { href: "https://thejuniper.com/", label: "Find out more" },
    { href: "https://thejuniper.com/", label: "Find out more" },
  ];

  function setTab(index) {
    const i = Math.max(0, Math.min(index, count - 1));
    root.dataset.activeTab = String(i);
    root.style.setProperty("--experience-tab", String(i));

    tabs.forEach((tab, j) => {
      const selected = j === i;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
      tab.classList.toggle("experience-showcase__tab--active", selected);
    });

    panels.forEach((panel, j) => {
      panel.setAttribute("aria-hidden", j === i ? "false" : "true");
    });

    bgs.forEach((el, j) => {
      const on = j === i;
      el.classList.toggle("opacity-100", on);
      el.classList.toggle("opacity-0", !on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });

    if (track) {
      track.style.transform = `translateX(calc(${i} * -25%))`;
    }

    if (cta && ctaTargets[i]) {
      const t = ctaTargets[i];
      cta.setAttribute("href", t.href);
      cta.textContent = t.label;
      if (t.href.startsWith("http")) {
        cta.setAttribute("target", "_blank");
        cta.setAttribute("rel", "noopener noreferrer");
      } else {
        cta.removeAttribute("target");
        cta.removeAttribute("rel");
      }
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => setTab(i));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setTab((i + 1) % count);
        tabs[(i + 1) % count].focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setTab((i - 1 + count) % count);
        tabs[(i - 1 + count) % count].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setTab(0);
        tabs[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        setTab(count - 1);
        tabs[count - 1].focus();
      }
    });
  });

  setTab(0);
})();
