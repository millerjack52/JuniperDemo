(function () {
  var openButtons = document.querySelectorAll("[data-modal-open]");
  if (!openButtons.length) return;

  var activeModal = null;
  var lastTrigger = null;

  function setModalState(modal, isOpen) {
    if (!modal) return;
    modal.classList.toggle("hidden", !isOpen);
    modal.classList.toggle("flex", isOpen);
    modal.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  function openModal(modalId, trigger) {
    var modal = document.getElementById(modalId);
    if (!modal) return;

    if (activeModal) {
      setModalState(activeModal, false);
    }

    activeModal = modal;
    lastTrigger = trigger || null;
    setModalState(activeModal, true);
    document.body.classList.add("overflow-hidden");

    var firstFocusable = activeModal.querySelector(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  function closeModal() {
    if (!activeModal) return;
    setModalState(activeModal, false);
    activeModal = null;
    document.body.classList.remove("overflow-hidden");
    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  openButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(button.getAttribute("data-modal-open"), button);
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach(function (closeElement) {
    closeElement.addEventListener("click", function () {
      closeModal();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
})();
