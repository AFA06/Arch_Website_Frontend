import React, { useState, useContext } from "react";
import { X, Eye, EyeOff, Check, AlertCircle, Loader, Camera } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/imageUtils";
import Avatar from "../Avatar/Avatar";
import AvatarUploader from "../AvatarUploader/AvatarUploader";
import "./ProfileEdit.css";

const ProfileEdit = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.image ? getImageUrl(user.image) : "");
  const [isAvatarUploaderOpen, setIsAvatarUploaderOpen] = useState(false);

  // Email change
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
    verificationCode: "",
  });
  const [emailChangeStep, setEmailChangeStep] = useState(1);
  const [requestId, setRequestId] = useState(null);

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Password validation rules
  const passwordRules = [
    { id: "length", label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
    { id: "uppercase", label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
    { id: "lowercase", label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
    { id: "number", label: "One number", test: (pwd) => /\d/.test(pwd) },
    { id: "special", label: "One special character", test: (pwd) => /[!@#$%^&*(),.?\":{}|<>]/.test(pwd) },
  ];

  const getPasswordStrength = (password) => {
    const passed = passwordRules.filter((r) => r.test(password)).length;
    if (passed === 0) return { label: "", color: "" };
    if (passed <= 2) return { label: "Weak", color: "#ef4444" };
    if (passed <= 4) return { label: "Medium", color: "#f59e0b" };
    return { label: "Strong", color: "#10b981" };
  };

  const strength = getPasswordStrength(passwordForm.newPassword);

  // Avatar upload
  const handleAvatarUpload = async (croppedFile) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", croppedFile);
      const response = await api.post("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        const updatedUser = response.data.data || response.data.user;
        updateUser(updatedUser);
        setAvatarPreview(getImageUrl(updatedUser.image));
        toast.success("Profile photo updated successfully!");
      } else {
        toast.error("Failed to update profile photo.");
      }
    } catch (error) {
      toast.error("Failed to update profile photo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Profile update (name/surname)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("surname", profileForm.surname);
      const response = await api.post("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        updateUser(response.data.data || response.data.user);
        toast.success("Profile updated successfully!");

        // Keep modal open briefly so user sees toast
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // Request email change
  const handleEmailChangeRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/user/email/request-change", {
        newEmail: emailForm.newEmail,
        currentPassword: emailForm.currentPassword,
      });

      if (response.data.success) {
        setRequestId(response.data.requestId);
        setEmailChangeStep(2);
        toast.success("Verification code sent to your new email!");
      } else if (response.data.message?.includes("exists")) {
        toast.error("This email is already registered.");
      } else {
        toast.error(response.data.message || "Failed to send verification code.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send verification code.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm email change
  const handleEmailChangeConfirm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/user/email/confirm-change", {
        requestId,
        code: emailForm.verificationCode,
      });

      if (response.data.success) {
        toast.success("Email updated successfully! Please log in again.");

        // Clear local session and redirect
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error("Invalid verification code. Please try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    const failed = passwordRules.filter((r) => !r.test(passwordForm.newPassword));
    if (failed.length > 0) {
      toast.error("Password does not meet all security requirements.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/user/password/change", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

        // Keep modal open briefly for user to see success
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (response.data.message?.includes("incorrect")) {
        toast.error("Incorrect current password!");
      } else {
        toast.error(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to change password.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="profile-edit-overlay" onClick={onClose}></div>
      <div className="profile-edit-modal">
        <div className="profile-edit-header">
          <h2>Edit Profile</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="profile-edit-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            Email
          </button>
          <button
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
        </div>

        <div className="profile-edit-content">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="avatar-section">
                <div className="avatar-preview">
                  <Avatar
                    user={{ ...user, image: avatarPreview || user?.image }}
                    size="large"
                    className="profile-avatar-preview"
                  />
                </div>
                <div className="avatar-upload">
                  <button
                    className="upload-btn"
                    onClick={() => setIsAvatarUploaderOpen(true)}
                    type="button"
                  >
                    <Camera size={18} />
                    Edit Photo
                  </button>
                  <p className="upload-hint">Click to crop and edit your profile photo</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">First Name *</label>
                <input
                  id="name"
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="surname">Last Name *</label>
                <input
                  id="surname"
                  type="text"
                  value={profileForm.surname}
                  onChange={(e) => setProfileForm({ ...profileForm, surname: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <Loader className="spinner" size={18} /> : "Save Changes"}
              </button>
            </form>
          )}

          {/* EMAIL TAB */}
          {activeTab === "email" && (
            <>
              {emailChangeStep === 1 ? (
                <form onSubmit={handleEmailChangeRequest} className="email-form">
                  <div className="current-email">
                    <p>
                      Current Email: <strong>{user?.email}</strong>
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newEmail">New Email *</label>
                    <input
                      id="newEmail"
                      type="email"
                      value={emailForm.newEmail}
                      onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="emailPassword">Current Password *</label>
                    <input
                      id="emailPassword"
                      type="password"
                      value={emailForm.currentPassword}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, currentPassword: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? <Loader className="spinner" size={18} /> : "Send Verification Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailChangeConfirm} className="email-form">
                  <div className="verification-info">
                    <AlertCircle size={20} color="#6366f1" />
                    <p>
                      We've sent a verification code to <strong>{emailForm.newEmail}</strong>
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="verificationCode">Verification Code *</label>
                    <input
                      id="verificationCode"
                      type="text"
                      value={emailForm.verificationCode}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, verificationCode: e.target.value })
                      }
                      placeholder="Enter 6-digit code"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setEmailChangeStep(1);
                        setEmailForm({ ...emailForm, verificationCode: "" });
                      }}
                    >
                      Back
                    </button>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                      {isLoading ? <Loader className="spinner" size={18} /> : "Verify & Update"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password *</label>
                <div className="password-input">
                  <input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                    }
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <div className="password-input">
                  <input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                    }
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {passwordForm.newPassword && (
                  <div className="password-strength">
                    <div className="strength-label">
                      Password Strength:{" "}
                      <span style={{ color: strength.color }}>{strength.label}</span>
                    </div>
                    <div className="password-rules">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.id}
                          className={`rule ${
                            rule.test(passwordForm.newPassword) ? "valid" : "invalid"
                          }`}
                        >
                          {rule.test(passwordForm.newPassword) ? (
                            <Check size={16} color="#10b981" />
                          ) : (
                            <X size={16} color="#ef4444" />
                          )}
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password *</label>
                <div className="password-input">
                  <input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                    }
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordForm.confirmPassword &&
                  passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <span className="error-hint">Passwords do not match</span>
                  )}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <Loader className="spinner" size={18} /> : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Avatar Uploader */}
      <AvatarUploader
        isOpen={isAvatarUploaderOpen}
        onClose={() => setIsAvatarUploaderOpen(false)}
        onSave={handleAvatarUpload}
        currentImage={user?.image}
        user={user}
      />
    </>
  );
};

export default ProfileEdit;
