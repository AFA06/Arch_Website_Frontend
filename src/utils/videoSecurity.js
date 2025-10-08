// Prevent downloads, right-click, and keyboard shortcuts
export const secureVideo = (videoElement) => {
  if (!videoElement) return;
  videoElement.controlsList = "nodownload nofullscreen noremoteplayback";
  videoElement.oncontextmenu = (e) => e.preventDefault();

  window.addEventListener("keydown", (e) => {
    if (e.key === "F12" || (e.ctrlKey && ["s", "u", "c"].includes(e.key.toLowerCase()))) {
      e.preventDefault();
    }
  });
};
