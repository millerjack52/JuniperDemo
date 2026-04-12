(() => {
  const animatedContainers = Array.from(document.querySelectorAll(".animated-image"));

  if (!animatedContainers.length) {
    return;
  }

  const containersWithTargets = animatedContainers.filter((container) => {
    const targets = container.querySelectorAll('svg, img[src$=".svg"], img[src*=".svg?"]');

    if (!targets.length && container.tagName === "IMG") {
      container.classList.add("animated-image__svg");
      return true;
    }

    if (!targets.length) {
      return false;
    }

    targets.forEach((target) => target.classList.add("animated-image__svg"));
    return true;
  });

  if (!containersWithTargets.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    containersWithTargets.forEach((container) => {
      container.classList.add("animated-image--in-view");
    });
    return;
  }

  if (!("IntersectionObserver" in window)) {
    containersWithTargets.forEach((container) => {
      container.classList.add("animated-image--in-view");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("animated-image--in-view");
        io.unobserve(entry.target);
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  containersWithTargets.forEach((container) => {
    observer.observe(container);
  });
})();
