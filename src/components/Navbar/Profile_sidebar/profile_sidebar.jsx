import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Bell, Edit, LogOut } from "lucide-react";
import ProfileEdit from "../../ProfileEdit/ProfileEdit";
import { getImageUrl, getUserInitials } from "../../../utils/imageUtils";
import "./profile_sidebar.css";

const ProfileSidebar = ({ user, isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) return null;

  const getInitials = (name, surname) => {
    return getUserInitials(name, surname);
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
          <div className="profile-sidebar-avatar-initials">
            {getInitials(user.name, user.surname)}
          </div>

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
          <button onClick={() => {
            setIsEditOpen(true);
            onClose();
          }}>
            <Edit size={18} /> Edit Profile
          </button>
          <button onClick={onLogout} className="logout-btn">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="profile-sidebar-overlay" onClick={onClose}></div>}
      
      {/* Profile Edit Modal */}
      <ProfileEdit
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
};

export default ProfileSidebar;
