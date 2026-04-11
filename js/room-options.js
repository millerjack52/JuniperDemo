(function () {
  var root = document.getElementById("room-options");
  if (!root) return;

  var rooms = [
    {
      tab: "King fireplace suite",
      category: "Signature suite",
      title: "King Fireplace Suite",
      description:
        "A generous retreat with stone hearth warmth, soft linens, and views toward the Bow Valley — the kind of room you sink into after a day on the trails.",
      specs: ["650 sq ft", "Gas fireplace"],
      image:
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80",
      imageLabel: "King suite with fireplace and layered bedding",
      detailHref: "room.html",
    },
    {
      tab: "Suite pairs",
      category: "Two-bedroom",
      title: "Suite Pairs",
      description:
        "Side-by-side comfort for families and friends: two private bedrooms, a shared living space, and quiet separation when you need to recharge before another Banff sunrise.",
      specs: ["900 sq ft", "Dual bathrooms"],
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
      imageLabel: "Hotel suite living area with soft lighting",
      detailHref: "room.html",
    },
    {
      tab: "Alpine studio",
      category: "Alpine studio",
      title: "Alpine Studio",
      description:
        "Compact and calm, with a kitchenette and mountain light through generous windows — ideal for shorter stays or solo explorers who value simplicity.",
      specs: ["420 sq ft", "Kitchenette"],
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      imageLabel: "Bright studio room with bed and window light",
      detailHref: "room.html",
    },
  ];

  var tabs = root.querySelectorAll('[role="tab"]');
  var tabStrip = root.querySelector(".room-options__tab-strip");
  var prevBtn = root.querySelector(".room-options__prev");
  var nextBtn = root.querySelector(".room-options__next");
  var panel = root.querySelector(".room-options__panel");
  var track = null;
  var slides = [];
  var activeIndex = 0;

  function buildSpecs(specs) {
    var wrap = document.createElement("div");
    wrap.className =
      "mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 md:mt-10 md:gap-x-10";
    specs.forEach(function (spec) {
      var span = document.createElement("span");
      span.className =
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 md:text-[11px]";
      var d = document.createElement("span");
      d.className = "text-juniper-turquoise";
      d.setAttribute("aria-hidden", "true");
      d.textContent = "◇";
      var t = document.createElement("span");
      t.textContent = spec;
      span.appendChild(d);
      span.appendChild(t);
      wrap.appendChild(span);
    });
    return wrap;
  }

  function buildSlide(r, index) {
    var article = document.createElement("article");
    article.className = "room-options__slide";
    article.id = "room-slide-" + index;
    article.setAttribute("aria-hidden", index === 0 ? "false" : "true");

    var img = document.createElement("img");
    img.className =
      "h-full min-h-[min(18rem,85vw)] w-full object-cover lg:aspect-[5/4] lg:min-h-0";
    img.src = r.image;
    img.alt = r.imageLabel;
    img.loading = "lazy";
    img.decoding = "async";

    var body = document.createElement("div");
    body.className =
      "flex flex-col justify-center px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16 xl:px-16";

    var cat = document.createElement("p");
    cat.className =
      "text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 md:text-[11px]";
    cat.textContent = r.category;

    var h3 = document.createElement("h3");
    h3.className =
      "mt-3 font-serif text-3xl font-normal tracking-tight text-slate-900 md:mt-4 md:text-4xl lg:text-[2.65rem] lg:leading-tight";
    h3.textContent = r.title;

    var desc = document.createElement("p");
    desc.className =
      "mt-5 max-w-md text-sm font-light leading-relaxed text-slate-600 md:mt-6 md:text-base";
    desc.textContent = r.description;

    var link = document.createElement("a");
    link.className =
      "mt-10 inline-flex w-fit border-b border-juniper-indigo pb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-juniper-indigo transition-colors hover:text-juniper-purple md:mt-12 md:text-[11px] md:tracking-[0.24em]";
    link.href = r.detailHref || "room.html";
    link.textContent = "View details";

    body.appendChild(cat);
    body.appendChild(h3);
    body.appendChild(desc);
    body.appendChild(buildSpecs(r.specs));
    body.appendChild(link);

    article.appendChild(img);
    article.appendChild(body);
    return article;
  }

  function buildCarousel() {
    if (!panel) return;

    var viewport = document.createElement("div");
    viewport.className = "room-options__viewport";

    track = document.createElement("div");
    track.className = "room-options__track";

    rooms.forEach(function (r, i) {
      var slide = buildSlide(r, i);
      track.appendChild(slide);
      slides.push(slide);
    });

    viewport.appendChild(track);
    panel.appendChild(viewport);
  }

  function setSlideIndex(index) {
    if (!track) return;
    track.style.setProperty("--room-slide", String(index));
  }

  function updateTabProgress(index) {
    if (tabStrip) {
      tabStrip.style.setProperty("--tab-index", String(index));
    }
  }

  function updateAria(index) {
    updateTabProgress(index);
    slides.forEach(function (slide, i) {
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    if (panel) {
      panel.setAttribute("aria-labelledby", "room-tab-" + index);
    }
  }

  function goTo(index) {
    if (index < 0 || index >= rooms.length) return;
    activeIndex = index;
    setSlideIndex(index);
    updateAria(index);
  }

  function go(delta) {
    var next = (activeIndex + delta + rooms.length) % rooms.length;
    goTo(next);
  }

  buildCarousel();
  goTo(0);

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      goTo(i);
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); });
})();
