(function () {
  var header = document.getElementById("site-header");
  if (!header) return;

  var THRESHOLD = 24;

  function setScrolled() {
    var scrolled = window.scrollY > THRESHOLD;
    header.setAttribute("data-scrolled", scrolled ? "true" : "false");
  }

  window.addEventListener("scroll", setScrolled, { passive: true });
  window.addEventListener("resize", setScrolled, { passive: true });
  setScrolled();
})();
