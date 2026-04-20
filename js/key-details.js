(function () {
  var KEY_DETAILS = {
    "bistro-hours-breakfast": "Breakfast daily 7:00am-11:00am",
    "bistro-hours-dinner": "Dinner Wed-Sun 5:00pm-10:00pm",
    "bistro-hours-brunch": "Weekend brunch Sat-Sun 11:30am-2:30pm",
  };

  var nodes = document.querySelectorAll("[data-key-detail]");
  if (!nodes.length) return;

  nodes.forEach(function (node) {
    var key = node.getAttribute("data-key-detail");
    if (!key || !Object.prototype.hasOwnProperty.call(KEY_DETAILS, key)) return;
    node.textContent = KEY_DETAILS[key];
  });
})();
