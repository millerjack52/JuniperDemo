document.addEventListener("DOMContentLoaded", () => {
  const heroVideo = document.querySelector(".hero-video");
  if (!heroVideo) return;

  let isRevealed = false;

  const markReady = () => {
    if (isRevealed) return;
    isRevealed = true;
    heroVideo.classList.add("is-ready");
  };

  const tryPlay = () => {
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Keep poster as fallback if autoplay is blocked.
      });
    }
  };

  // If the video is already decoded enough, reveal immediately.
  if (heroVideo.readyState >= 2) {
    markReady();
  }

  heroVideo.addEventListener("playing", markReady, { once: true });
  heroVideo.addEventListener("loadedmetadata", tryPlay, { once: true });
  heroVideo.addEventListener("loadeddata", markReady, { once: true });
  heroVideo.addEventListener("canplay", markReady, { once: true });

  // Prevent indefinite hidden state on slow devices/networks.
  window.setTimeout(markReady, 2000);

  tryPlay();
});
