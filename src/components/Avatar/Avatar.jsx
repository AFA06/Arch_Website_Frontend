import React, { useState } from "react";
import "./Avatar.css";

/**
 * Avatar Component - Perfect Circle Display
 *
 * Features:
 * - Perfect circle display in both Navbar and sidebar contexts
 * - Automatic fallback to user initials when no image is available
 * - Consistent sizing and border-radius across all contexts
 * - Responsive design with smooth transitions
 * - Professional gradient backgrounds for initials
 * - Error handling for failed image loads
 * - Online status indicator support
 * - Prominent navbar avatar sizing for better visibility
 *
 * Usage:
 * <Avatar user={user} size="navbar" />  // 44px - subtly larger navbar avatar
 * <Avatar user={user} size="large" className="sidebar-avatar" />  // 60px - sidebar avatar
 *
 * Sizes: tiny (20px), small (28px), navbar (44px), medium (36px), large (60px), xlarge (80px)
 */

// Helper to get initials
const getUserInitials = (name = "", surname = "") => {
  const firstInitial = name.charAt(0) || "";
  const lastInitial = surname.charAt(0) || "";
  return `${firstInitial}${lastInitial}`.toUpperCase().slice(0, 2);
};

// Avatar sizes in px
const SIZE_MAP = {
  tiny: 20,
  small: 28,
  navbar: 44,  // for navbar - subtle increase for better prominence
  medium: 36,
  large: 60,   // for sidebar
  xlarge: 80,
};

const Avatar = ({ user, size = "navbar", className = "", showOnline = false, onClick = null }) => {
  const [imageError, setImageError] = useState(false);
  const initials = getUserInitials(user?.name, user?.surname);
  const px = SIZE_MAP[size] || SIZE_MAP.navbar;
  const displayName = user ? `${user.name} ${user.surname}` : "";
  const hasImage = user?.image && !imageError;

  return (
    <div
      className={`avatar avatar--${size} ${className}`}
      onClick={onClick}
      title={displayName}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        borderRadius: "50%",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Image */}
      {hasImage && (
        <img
          src={user.image}
          alt={displayName}
          className="avatar__image"
          onError={() => setImageError(true)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Fallback initials */}
      <div
        className="avatar__initials"
        style={{
          width: "100%",
          height: "100%",
          display: hasImage ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hasImage
            ? "transparent"
            : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          color: "#fff",
          fontWeight: 600,
          fontSize: `${Math.max(px * 0.4, 14)}px`,
          borderRadius: "50%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          transition: "opacity 0.2s ease",
        }}
      >
        {initials}
      </div>

      {/* Online indicator */}
      {showOnline && (
        <div
          className="avatar__online-indicator"
          style={{
            width: size === "large" ? 12 : 8,
            height: size === "large" ? 12 : 8,
            bottom: size === "large" ? 2 : 1,
            right: size === "large" ? 2 : 1,
            position: "absolute",
            borderRadius: "50%",
            border: "2px solid #fff",
            backgroundColor: "#10b981",
            zIndex: 3,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
