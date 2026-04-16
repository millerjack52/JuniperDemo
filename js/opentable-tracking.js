(function () {
  var links = document.querySelectorAll("[data-opentable-link]");
  if (!links.length) return;

  function track(source, href) {
    var payload = {
      event: "opentable_click",
      source: source || "unknown",
      href: href || "",
      ts: Date.now(),
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent("juniper:opentable-click", { detail: payload }));
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      track(link.getAttribute("data-opentable-source"), link.getAttribute("href"));
    });
  });
})();
