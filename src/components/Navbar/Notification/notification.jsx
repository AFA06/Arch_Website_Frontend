import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../../context/NotificationContext";
import "../Notification/notification.css";

const NotificationProfessional = () => {
  const { notifications, markAllAsRead, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      {/* Bell Icon */}
      <div onClick={toggleDropdown} className="bell-icon">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="notification-dropdown"
          >
            <div className="notification-header">
              <span>Announcements</span>
              {unreadCount > 0 && (
                <button className="mark-all-btn" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notification-item ${
                      n.read ? "read" : "unread"
                    }`}
                  >
                    <div className="notification-content">
                      <h4 className="title">{n.title}</h4>
                      <p className="content">{n.content}</p>
                      <span className="time">
                        {new Date(n.createdDate).toLocaleString()}
                      </span>
                    </div>
                    {!n.read && <div className="unread-dot" />}
                  </div>
                ))
              ) : (
                <div className="notification-item empty">
                  No notifications yet
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProfessional;
