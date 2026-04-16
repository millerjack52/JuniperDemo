"""Assemble bistro.html: replace Plan your visit + old menu modal with tiles + six modals."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

winter_inner = (ROOT / "scripts" / "winter-dinner-inner.html").read_text(encoding="utf-8")

MODAL_SHELL = """      <div
        id="{modal_id}"
        class="fixed inset-0 z-[120] hidden items-center justify-center p-4 md:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="{title_id}"
      >
        <div class="absolute inset-0 bg-black/50" data-modal-close aria-hidden="true"></div>
        <div
          class="relative z-10 max-h-[min(94vh,59rem)] w-full max-w-6xl overflow-y-auto border border-stone-200/90 bg-juniper-cream px-8 py-12 shadow-[0_24px_56px_-24px_rgba(0,0,0,0.45)] md:px-14 md:py-14 lg:px-20 lg:py-16"
        >
          <button
            type="button"
            class="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-juniper-cream/90 text-slate-500 transition-colors hover:border-slate-400 hover:text-slate-800 md:right-6 md:top-6"
            data-modal-close
            aria-label="Close {label}"
          >
            <span aria-hidden="true">×</span>
          </button>
          <header class="text-center">
            <h2
              id="{title_id}"
              class="text-xs font-bold uppercase tracking-[0.32em] text-slate-800 md:text-sm md:tracking-[0.28em]"
            >
              {title}
            </h2>
            <div class="mx-auto mt-3 h-px w-14 bg-juniper-teal" aria-hidden="true"></div>
            <p class="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-slate-500 md:text-sm">
              Sourced from
              <a
                href="https://thejuniper.com/dine/"
                class="text-juniper-teal underline-offset-2 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
                >thejuniper.com/dine</a
              >. Items and prices may change; confirm with the restaurant.
            </p>
          </header>
{inner}
          <footer class="mt-14 text-center md:mt-16">
            <a
              href="https://thejuniper.com/dine/"
              class="inline-block border-b border-juniper-teal pb-0.5 text-xs font-bold uppercase tracking-[0.22em] text-slate-800 transition-opacity hover:opacity-80 md:text-[13px]"
              rel="noopener noreferrer"
              target="_blank"
            >
              View full menu on thejuniper.com
            </a>
          </footer>
        </div>
      </div>
"""

replacement = (ROOT / "scripts" / "bistro-modals-replacement.html").read_text(encoding="utf-8")
replacement = replacement.replace("<!-- MODALS_PLACEHOLDER -->", "").strip()

frag = (ROOT / "scripts" / "bistro-modals-fragments.html").read_text(encoding="utf-8")

winter_modal = MODAL_SHELL.format(
    modal_id="bistro-modal-winter-dinner",
    title_id="bistro-modal-winter-dinner-title",
    label="Winter dinner menu",
    title="Winter dinner",
    inner="\n" + winter_inner + "\n",
)

bulk = replacement + "\n\n" + winter_modal + "\n\n" + frag + "\n"

bistro = (ROOT / "bistro.html").read_text(encoding="utf-8")
start = bistro.index('<section class="py-16 md:py-20 lg:py-24" aria-labelledby="visit-heading">')
end = bistro.index('<div\n        id="bistro-modal-events"')
new_bistro = bistro[:start] + bulk + bistro[end:]
(ROOT / "bistro.html").write_text(new_bistro, encoding="utf-8")
print("OK: bistro.html patched")
