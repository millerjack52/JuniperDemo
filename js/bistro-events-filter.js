(function () {
  var root = document.querySelector("[data-events-filter-root]");
  if (!root) return;

  var buttons = root.querySelectorAll("[data-events-filter]");
  var items = root.querySelectorAll("[data-event-item]");
  if (!buttons.length || !items.length) return;

  function apply(filter) {
    buttons.forEach(function (button) {
      var isActive = button.getAttribute("data-events-filter") === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    items.forEach(function (item) {
      var tags = (item.getAttribute("data-event-tags") || "").split(/\s+/);
      var visible = filter === "all" || tags.indexOf(filter) > -1;
      item.classList.toggle("hidden", !visible);
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      apply(button.getAttribute("data-events-filter") || "all");
    });
  });

  apply("all");
})();
