import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bell, Edit, LogOut } from "lucide-react";
import "./profile_sidebar.css";

const ProfileSidebar = ({ user, isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();

  if (!user) return null;

  const getInitials = (name, surname) => {
    if (!name || !surname) return "?";
    return `${name[0]}${surname[0]}`.toUpperCase();
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`profile-sidebar ${isOpen ? "open" : ""}`}>
        <div className="profile-sidebar-header">
          {user.image ? (
            <img
              src={user.image}
              alt="avatar"
              className="profile-sidebar-avatar-img"
            />
          ) : (
            <div className="profile-sidebar-avatar-initials">
              {getInitials(user.name, user.surname)}
            </div>
          )}

          <div>
            <h3>{user.name} {user.surname}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-sidebar-links">
          <button onClick={() => handleNavigation("/my-courses")}>
            <BookOpen size={18} /> My Courses
          </button>
          <button>
            <Bell size={18} /> Notifications
          </button>
          <button>
            <Edit size={18} /> Edit Profile
          </button>
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="profile-sidebar-overlay" onClick={onClose}></div>}
    </>
  );
};

export default ProfileSidebar;
