(() => {
  const sections = Array.from(document.querySelectorAll("main > section"));
  const ctaContour = document.querySelector(".juniper-cta-pattern");
  const mapSection = document.querySelector(".bow-valley-section");
  const instagramGrid = document.querySelector(".instagram-grid");
  const instagramTiles = instagramGrid
    ? Array.from(instagramGrid.querySelectorAll(".instagram-grid__item"))
    : [];

  if (!sections.length && !ctaContour && !mapSection) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (instagramTiles.length) {
    instagramGrid.classList.add("instagram-grid--stagger");

    instagramTiles.forEach((tile, index) => {
      tile.style.setProperty("--instagram-tile-delay", `${index * 115}ms`);
    });

    const revealInstagram = () => {
      instagramGrid.classList.add("instagram-grid--is-revealed");
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealInstagram();
    } else {
      const instagramObserver = new IntersectionObserver(
        (entries, io) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            revealInstagram();
            io.unobserve(entry.target);
          });
        },
        {
          threshold: 0.22,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      instagramObserver.observe(instagramGrid);
    }
  }

  if (sections.length) {
    sections.forEach((section) => {
      section.classList.add("scroll-reveal");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => {
        section.classList.add("is-revealed");
      });
    } else {
      const observer = new IntersectionObserver(
        (entries, io) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      sections.forEach((section) => {
        observer.observe(section);
      });
    }
  }

  if (reduceMotion) {
    if (ctaContour) {
      ctaContour.style.setProperty("--cta-contour-shift", "0%");
    }

    if (mapSection) {
      mapSection.style.setProperty("--map-bg-shift", "0px");
      mapSection.style.setProperty("--map-veil-shift", "0px");
      mapSection.style.setProperty("--map-foreground-shift", "0px");
    }

    return;
  }

  const ctaSection = ctaContour ? ctaContour.closest("section") : null;

  const CTA_SHIFT_RANGE = 16;
  const MAP_BG_SHIFT_RANGE = 28;
  const MAP_VEIL_SHIFT_RANGE = 14;
  const MAP_FOREGROUND_SHIFT_RANGE = 18;
  let ticking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateScrollEffects = () => {
    const viewportCenter = window.innerHeight / 2;

    if (ctaContour && ctaSection) {
      const ctaRect = ctaSection.getBoundingClientRect();
      const ctaSectionCenter = ctaRect.top + ctaRect.height / 2;
      const ctaNormalizedOffset = clamp(
        (ctaSectionCenter - viewportCenter) / viewportCenter,
        -1,
        1
      );

      const ctaShift = ctaNormalizedOffset * CTA_SHIFT_RANGE;
      ctaContour.style.setProperty("--cta-contour-shift", `${ctaShift.toFixed(2)}%`);
    }

    if (mapSection) {
      const mapRect = mapSection.getBoundingClientRect();
      const mapSectionCenter = mapRect.top + mapRect.height / 2;
      const mapNormalizedOffset = clamp(
        (mapSectionCenter - viewportCenter) / viewportCenter,
        -1,
        1
      );

      const bgShift = mapNormalizedOffset * MAP_BG_SHIFT_RANGE;
      const veilShift = mapNormalizedOffset * MAP_VEIL_SHIFT_RANGE;
      const foregroundShift = -mapNormalizedOffset * MAP_FOREGROUND_SHIFT_RANGE;

      mapSection.style.setProperty("--map-bg-shift", `${bgShift.toFixed(2)}px`);
      mapSection.style.setProperty("--map-veil-shift", `${veilShift.toFixed(2)}px`);
      mapSection.style.setProperty(
        "--map-foreground-shift",
        `${foregroundShift.toFixed(2)}px`
      );
    }

    ticking = false;
  };

  const requestShiftUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateScrollEffects);
  };

  requestShiftUpdate();
  window.addEventListener("scroll", requestShiftUpdate, { passive: true });
  window.addEventListener("resize", requestShiftUpdate);
})();
