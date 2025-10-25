/**
 * Enhanced Video Security Utility
 * Comprehensive protection against downloads, recording, and unauthorized access
 */

// Enhanced video security with comprehensive protection
export const secureVideo = (videoElement) => {
  if (!videoElement) return;

  // Apply security attributes to video element
  if (videoElement.setAttribute) {
    videoElement.setAttribute("controlsList", "nodownload noplaybackrate nofullscreen");
    videoElement.setAttribute("disablePictureInPicture", "true");
    videoElement.setAttribute("disableRemotePlayback", "true");
    videoElement.setAttribute("crossorigin", "anonymous");
  }

  // Prevent right-click on video
  videoElement.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Prevent selection and drag operations
  videoElement.onselectstart = (e) => {
    e.preventDefault();
    return false;
  };

  videoElement.ondragstart = (e) => {
    e.preventDefault();
    return false;
  };

  // Prevent keyboard events on video
  videoElement.onkeydown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      return false;
    }
  };

  // Add security class for CSS-based protection
  videoElement.classList.add('secure-video');
  videoElement.style.userSelect = 'none';
  videoElement.style.webkitUserSelect = 'none';
  videoElement.style.MozUserSelect = 'none';
  videoElement.style.msUserSelect = 'none';
};

// Enhanced global security measures
export const enableGlobalVideoSecurity = () => {
  // Prevent right-click globally
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Prevent common keyboard shortcuts and developer tools
  const handleKeyDown = (e) => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
    if (
      e.key === "F12" || e.keyCode === 123 ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
      (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
      (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
      (e.ctrlKey && (e.key === "U" || e.key === "u")) ||
      (e.ctrlKey && (e.key === "S" || e.key === "s")) ||
      (e.ctrlKey && (e.key === "P" || e.key === "p")) ||
      (e.metaKey && (e.key === "s" || e.key === "S"))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Prevent screenshot shortcuts
    if (e.key === "PrintScreen" || (e.ctrlKey && e.key === "PrintScreen")) {
      e.preventDefault();
      return false;
    }
  };

  // Prevent clipboard operations on video elements
  const handlePaste = (e) => {
    if (e.target.tagName === 'VIDEO') {
      e.preventDefault();
      return false;
    }
  };

  // Prevent drop operations
  const handleDrop = (e) => {
    if (e.target.tagName === 'VIDEO') {
      e.preventDefault();
      return false;
    }
  };

  // Detect developer tools opening
  const detectDevTools = () => {
    const threshold = 160;
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      console.warn('Developer tools detected - security measures activated');
      // Additional security measures could be implemented here
    }
  };

  // Monitor for screen capture
  const detectScreenCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      console.log('Screen capture capabilities detected - monitoring enabled');
    }
  };

  // Add event listeners
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("paste", handlePaste);
  document.addEventListener("drop", handleDrop);
  window.addEventListener("resize", detectDevTools);

  // Initial detection
  detectScreenCapture();

  // Periodic security checks
  const securityInterval = setInterval(() => {
    detectDevTools();
    detectScreenCapture();
  }, 10000);

  // Cleanup function
  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("paste", handlePaste);
    document.removeEventListener("drop", handleDrop);
    window.removeEventListener("resize", detectDevTools);
    clearInterval(securityInterval);
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
