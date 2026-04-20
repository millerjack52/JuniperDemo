(function () {
  var roots = document.querySelectorAll("[data-menu-filter-root]");
  if (!roots.length) return;
  var ITEM_HIDE_DELAY = 260;
  var SECTION_HIDE_DELAY = 320;

  roots.forEach(function (root) {
    var buttons = root.querySelectorAll("[data-filter]");
    var items = root.querySelectorAll("[data-menu-item]");
    var sections = Array.prototype.filter.call(root.querySelectorAll("section"), function (section) {
      return section.querySelector("[data-menu-item]");
    });
    var nav = root.querySelector("nav");
    var indicator = null;
    var itemTimers = new WeakMap();
    var sectionTimers = new WeakMap();
    if (!buttons.length || !items.length) return;

    if (nav) {
      nav.classList.add("bistro-menu-modal-filter-nav");
      indicator = document.createElement("span");
      indicator.className = "bistro-menu-modal-filter-indicator";
      indicator.setAttribute("aria-hidden", "true");
      nav.appendChild(indicator);
    }

    sections.forEach(function (section) {
      section.classList.add("bistro-menu-modal-section");
    });

    function moveIndicator(filter) {
      if (!indicator || !nav) return;
      var activeButton = Array.prototype.find.call(buttons, function (button) {
        return button.getAttribute("data-filter") === filter;
      });
      if (!activeButton) return;

      var navRect = nav.getBoundingClientRect();
      var buttonRect = activeButton.getBoundingClientRect();
      var x = buttonRect.left - navRect.left;
      indicator.style.width = buttonRect.width + "px";
      indicator.style.transform = "translateX(" + x + "px)";
    }

    function setActive(filter) {
      buttons.forEach(function (button) {
        var isActive = button.getAttribute("data-filter") === filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      moveIndicator(filter);
    }

    function clearHideTimer(map, element) {
      var timer = map.get(element);
      if (!timer) return;
      window.clearTimeout(timer);
      map.delete(element);
    }

    function showElement(element, timerMap) {
      clearHideTimer(timerMap, element);
      if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
        element.offsetHeight;
      }
      element.classList.remove("is-filter-hidden");
    }

    function hideElement(element, delay, timerMap) {
      clearHideTimer(timerMap, element);
      element.classList.add("is-filter-hidden");
      var timer = window.setTimeout(function () {
        if (element.classList.contains("is-filter-hidden")) {
          element.classList.add("hidden");
        }
      }, delay);
      timerMap.set(element, timer);
    }

    function applyFilter(filter) {
      items.forEach(function (item) {
        var tags = (item.getAttribute("data-tags") || "").trim().split(/\s+/).filter(Boolean);
        var visible = filter === "all" || tags.indexOf(filter) > -1;
        if (visible) {
          showElement(item, itemTimers);
        } else {
          hideElement(item, ITEM_HIDE_DELAY, itemTimers);
        }
      });

      sections.forEach(function (section) {
        var sectionItems = section.querySelectorAll("[data-menu-item]");
        if (!sectionItems.length) return;

        var hasVisibleItems = Array.prototype.some.call(sectionItems, function (item) {
          return !item.classList.contains("is-filter-hidden");
        });

        if (hasVisibleItems) {
          showElement(section, sectionTimers);
        } else {
          hideElement(section, SECTION_HIDE_DELAY, sectionTimers);
        }
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter") || "all";
        setActive(filter);
        applyFilter(filter);
      });
    });

    setActive("all");
    applyFilter("all");

    window.addEventListener("resize", function () {
      var activeButton = root.querySelector("[data-filter].is-active");
      if (!activeButton) return;
      moveIndicator(activeButton.getAttribute("data-filter"));
    });
  });
})();
