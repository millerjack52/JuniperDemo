document.querySelectorAll('.faq-item').forEach((details) => {
  const summary = details.querySelector('summary');
  const body = details.querySelector('.faq-item__body');

  if (!summary || !body) return;

  // Prevent any in-flight animation from conflicting
  let animating = false;

  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (animating) return;

    if (details.open) {
      // ── Closing ──────────────────────────────────────────────────────
      animating = true;
      const startHeight = body.scrollHeight;
      body.style.height = startHeight + 'px';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          body.style.transition = 'height 300ms ease';
          body.style.height = '0';
        });
      });

      body.addEventListener(
        'transitionend',
        () => {
          details.removeAttribute('open');
          body.style.removeProperty('height');
          body.style.removeProperty('transition');
          animating = false;
        },
        { once: true }
      );
    } else {
      // ── Opening ──────────────────────────────────────────────────────
      animating = true;
      details.setAttribute('open', '');
      const targetHeight = body.scrollHeight;
      body.style.height = '0';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          body.style.transition = 'height 300ms ease';
          body.style.height = targetHeight + 'px';
        });
      });

      body.addEventListener(
        'transitionend',
        () => {
          body.style.removeProperty('height');
          body.style.removeProperty('transition');
          animating = false;
        },
        { once: true }
      );
    }
  });
});
