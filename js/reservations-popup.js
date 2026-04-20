const popup = document.querySelector('[data-reservations-popup]');

if (popup) {
  const panel = popup.querySelector('.reservations-popup__panel');
  const closeButtons = popup.querySelectorAll('[data-reservations-popup-close]');
  const triggers = document.querySelectorAll('[data-trigger-reservation-widget]');
  const focusableSelector = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let lastActiveElement = null;

  const getFocusableElements = () =>
    Array.from(popup.querySelectorAll(focusableSelector)).filter(
      (element) => element.offsetParent !== null
    );

  const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');

    if (lastActiveElement instanceof HTMLElement) {
      lastActiveElement.focus();
    }
  };

  const openPopup = (trigger) => {
    lastActiveElement = trigger instanceof HTMLElement ? trigger : document.activeElement;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');

    window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openPopup(trigger);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      closePopup();
    });
  });

  popup.addEventListener('click', (event) => {
    if (panel && !panel.contains(event.target)) {
      closePopup();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!popup.classList.contains('is-open')) {
      return;
    }

    if (event.key === 'Escape') {
      closePopup();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}