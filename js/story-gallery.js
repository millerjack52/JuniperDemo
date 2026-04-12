(function () {
  const gallery = document.getElementById("story-gallery");
  if (!gallery) return;

  const rows = gallery.querySelectorAll(".story-gallery__row");
  const ROW_INDICES = [
    [0, 1],
    [2, 3],
    [4, 5],
  ];

  /** @type {Record<number, HTMLElement>} */
  const rootsByIndex = {};
  gallery.querySelectorAll("[data-story-root]").forEach((el) => {
    const i = parseInt(el.getAttribute("data-story-index") || "0", 10);
    rootsByIndex[i] = el;
  });

  let openIndex = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function setAria(root, open) {
    const detail = root.querySelector(".story-tile__detail");
    const trigger = root.querySelector("[data-story-trigger]");
    if (detail) {
      detail.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (trigger) {
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
  }

  function applyState() {
    rows.forEach((row, rowIdx) => {
      const indices = ROW_INDICES[rowIdx];
      const openHere =
        openIndex !== null && indices.includes(openIndex);
      row.classList.toggle("story-gallery__row--has-open", openHere);

      indices.forEach((idx) => {
        const root = rootsByIndex[idx];
        if (!root) return;
        const isOpen = openIndex === idx;
        root.classList.toggle("story-tile--open", isOpen);
        root.classList.toggle(
          "story-tile--row-sibling-hidden",
          openHere && !isOpen
        );
        setAria(root, isOpen);
      });
    });
  }

  function captureRowRects() {
    return [...gallery.querySelectorAll(".story-gallery__row")].map((el) =>
      el.getBoundingClientRect()
    );
  }

  /**
   * FLIP: rows keep visual position, then ease to new layout Y.
   * @param {DOMRect[]} firstRects
   * @param {{ skipRow?: HTMLElement | null }} [options] — row that runs detail FLIP (viewport rects already account for its motion)
   */
  function invertRowsFrom(firstRects, options) {
    const skipRow = options && options.skipRow;
    const rowEls = [...gallery.querySelectorAll(".story-gallery__row")];
    rowEls.forEach((row, i) => {
      if (skipRow && row === skipRow) return;
      const first = firstRects[i];
      if (!first) return;
      const last = row.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        row.dataset.rowShiftSkip = "1";
        return;
      }
      delete row.dataset.rowShiftSkip;
      row.dataset.rowShiftActive = "1";
      row.style.willChange = "transform";
      row.style.transition = "none";
      row.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }

  function playRowShifts() {
    const rowEls = [...gallery.querySelectorAll(".story-gallery__row")];
    rowEls.forEach((row) => {
      if (row.dataset.rowShiftSkip) {
        delete row.dataset.rowShiftSkip;
        return;
      }
      if (!row.dataset.rowShiftActive) return;
      delete row.dataset.rowShiftActive;
      row.style.transition =
        "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)";
      row.style.transform = "";
      const done = (e) => {
        if (e.propertyName !== "transform") return;
        row.style.transition = "";
        row.style.willChange = "";
        row.removeEventListener("transitionend", done);
      };
      row.addEventListener("transitionend", done);
    });
  }

  /**
   * Run a layout mutation and animate row vertical shifts (open/close without detail FLIP).
   */
  function animateLayout(mutate) {
    if (prefersReducedMotion()) {
      mutate();
      return;
    }
    const firstRects = captureRowRects();
    mutate();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        invertRowsFrom(firstRects);
        requestAnimationFrame(() => {
          playRowShifts();
        });
      });
    });
  }

  /**
   * FLIP: info panel from hero + row Y shifts together.
   */
  function flipExpand(root, mutate) {
    const hero = root.querySelector(".story-tile__hero");
    const detail = root.querySelector(".story-tile__detail");
    if (!hero || !detail || prefersReducedMotion()) {
      animateLayout(mutate);
      return;
    }

    const rowRectsBefore = captureRowRects();
    const firstHero = hero.getBoundingClientRect();
    mutate();

    detail.style.transition = "none";
    detail.style.opacity = "1";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const lastDetail = detail.getBoundingClientRect();
        const dx = firstHero.left - lastDetail.left;
        const dy = firstHero.top - lastDetail.top;
        const sx = firstHero.width / lastDetail.width || 1;
        const sy = firstHero.height / lastDetail.height || 1;

        const row = root.closest(".story-gallery__row");
        const siblings = row
          ? [...row.querySelectorAll("[data-story-root]")]
          : [];
        const slot = siblings.indexOf(root);

        detail.style.transformOrigin = slot === 1 ? "100% 0" : "0 0";
        detail.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

        invertRowsFrom(rowRectsBefore, { skipRow: row });

        detail.getBoundingClientRect();

        requestAnimationFrame(() => {
          detail.style.transition =
            "transform 0.55s cubic-bezier(0.33, 1, 0.68, 1)";
          detail.style.transform = "";

          playRowShifts();

          const onEnd = (e) => {
            if (e.propertyName !== "transform") return;
            detail.style.transition = "";
            detail.style.transform = "";
            detail.style.transformOrigin = "";
            detail.style.opacity = "";
            detail.removeEventListener("transitionend", onEnd);
          };
          detail.addEventListener("transitionend", onEnd);
        });
      });
    });
  }

  function openStory(index) {
    if (openIndex === index) {
      animateLayout(() => {
        openIndex = null;
        applyState();
      });
      return;
    }

    const root = rootsByIndex[index];
    if (!root) return;

    flipExpand(root, () => {
      openIndex = index;
      applyState();
    });
  }

  function closeStory() {
    animateLayout(() => {
      openIndex = null;
      applyState();
    });
  }

  [0, 1, 2, 3, 4, 5].forEach((idx) => {
    const root = rootsByIndex[idx];
    if (!root) return;
    const trigger = root.querySelector("[data-story-trigger]");
    const closeBtn = root.querySelector("[data-story-close]");

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        openStory(idx);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeStory();
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openIndex !== null) {
      closeStory();
    }
  });
})();
