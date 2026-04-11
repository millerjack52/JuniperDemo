(function () {
  var scroller = document.getElementById("reviews-scroller");
  var prev = document.querySelector("[data-reviews-prev]");
  var next = document.querySelector("[data-reviews-next]");
  if (!scroller || !prev || !next) return;

  function gapPx() {
    var styles = window.getComputedStyle(scroller);
    var g = styles.columnGap || styles.gap;
    var n = parseFloat(g);
    return Number.isFinite(n) ? n : 24;
  }

  function stepDistance() {
    var card = scroller.querySelector("article");
    if (!card) return 320;
    return card.offsetWidth + gapPx();
  }

  function updateButtons() {
    var maxScroll = scroller.scrollWidth - scroller.clientWidth;
    var left = scroller.scrollLeft;
    var eps = 4;
    var atStart = left <= eps;
    var atEnd = left >= maxScroll - eps;
    prev.disabled = atStart;
    next.disabled = atEnd;
    prev.setAttribute("aria-disabled", atStart ? "true" : "false");
    next.setAttribute("aria-disabled", atEnd ? "true" : "false");
  }

  function scrollByStep(direction) {
    scroller.scrollBy({
      left: direction * stepDistance(),
      behavior: "smooth",
    });
  }

  next.addEventListener("click", function () {
    if (!next.disabled) scrollByStep(1);
  });
  prev.addEventListener("click", function () {
    if (!prev.disabled) scrollByStep(-1);
  });

  scroller.addEventListener("scroll", function () {
    window.requestAnimationFrame(updateButtons);
  });
  window.addEventListener("resize", updateButtons);
  updateButtons();
})();
