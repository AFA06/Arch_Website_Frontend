import React from "react";
import "./notification.css";

const Notification = () => {
  // Replace with real notifications from API if needed
  const notifications = [
    { id: 1, message: "New course available!" },
    { id: 2, message: "Your course progress has been updated." },
    { id: 3, message: "Don't miss our new webinar." }
  ];

  return (
    <div className="notification-dropdown">
      {notifications.length === 0 ? (
        <div className="notification-item">No notifications</div>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className="notification-item">
            {notif.message}
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
