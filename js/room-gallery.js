(function () {
  var img = document.getElementById("room-gallery-img");
  var prevBtn = document.getElementById("room-gallery-prev");
  var nextBtn = document.getElementById("room-gallery-next");
  if (!img || !prevBtn || !nextBtn) return;

  var slides = [
    {
      src:
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2000&q=80",
      alt: "King suite with fireplace and layered bedding",
    },
    {
      src:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80",
      alt: "Hotel suite living area with soft lighting",
    },
    {
      src:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80",
      alt: "Bright hotel room with natural light",
    },
  ];

  var index = 0;

  function show(i) {
    index = (i + slides.length) % slides.length;
    var s = slides[index];
    img.src = s.src;
    img.alt = s.alt;
  }

  prevBtn.addEventListener("click", function () {
    show(index - 1);
  });
  nextBtn.addEventListener("click", function () {
    show(index + 1);
  });
})();
