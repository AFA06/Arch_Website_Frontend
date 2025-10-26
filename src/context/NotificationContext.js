// src/context/NotificationContext.js
import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import api from "../utils/api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await api.get("admin/announcements"); // ✅ backend route
        if (res.data?.data) setNotifications(res.data.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    const socket = io("http://localhost:5050", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ["websocket"],
    });

    if (process.env.NODE_ENV !== "production") {
      socket.on("connect", () =>
        console.log("Connected to notifications socket:", socket.id)
      );
    }

    socket.on("newNotification", (notif) =>
      setNotifications((prev) => [notif, ...prev])
    );

    socket.on("error", (err) => console.error("Socket error:", err));

    return () => socket.disconnect();
  }, [user, token]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await api.put(`admin/announcements/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => api.put(`admin/announcements/${n._id}/read`))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        markAsRead,
        markAllAsRead,
        unreadCount,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  return context;
};
 