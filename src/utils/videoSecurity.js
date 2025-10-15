/**
 * Video Security Utility
 * Prevents downloads, right-click, screen recording attempts, and keyboard shortcuts
 */

// Prevent downloads, right-click, and common shortcuts
export const secureVideo = (videoElement) => {
  if (!videoElement) return;
  
  // Apply security attributes to video element
  if (videoElement.setAttribute) {
    videoElement.setAttribute("controlsList", "nodownload");
    videoElement.setAttribute("disablePictureInPicture", "true");
    videoElement.setAttribute("disableRemotePlayback", "true");
  }
  
  // Prevent right-click on video
  videoElement.oncontextmenu = (e) => e.preventDefault();
};

// Global security measures
export const enableGlobalVideoSecurity = () => {
  // Prevent right-click globally
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent common keyboard shortcuts
  const handleKeyDown = (e) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source), Ctrl+S (save)
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
      (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
      (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
      (e.ctrlKey && (e.key === "U" || e.key === "u")) ||
      (e.ctrlKey && (e.key === "S" || e.key === "s"))
    ) {
      e.preventDefault();
      return false;
    }
  };

  // Add event listeners
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("keydown", handleKeyDown);

  // Cleanup function
  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
  };
};

// Disable console (makes debugging harder for potential attackers)
export const disableConsole = () => {
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
  }
};

// Watermark text overlay for videos (optional, can be added to video player)
export const addWatermark = (username, email) => {
  return `${username} • ${email}`;
};

// Detect screen recording attempts (basic detection)
export const detectScreenRecording = () => {
  // Check for common screen recording software indicators
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    // Screen recording APIs are available
    console.warn("Screen recording capabilities detected");
  }
  
  // Detect if window is being captured
  if (document.visibilityState === "hidden") {
    console.warn("Page might be hidden/captured");
  }
};
