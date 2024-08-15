import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css";
import "../css/ChangePassword.css";
import Navbar from "../components/Navbar";
import newPromoImg from "../assets/images/change-pass.png";
import axios from 'axios';
import BACKEND_URL from "../constants";

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    // Add your password change logic here

    setSuccess("Password changed successfully");
    setConfirmPassword("")
    setCurrentPassword("")
    setNewPassword("")
    setTimeout(() => {
      setSuccess("");
    }, 5000);
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="main">
        <div className="header">
          <p className="main-heading">Change Password</p>
          <hr />
        </div>
        <div className="content">
          <div className="left-side">
            <div className="label-container">
              <label>Current Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  className="change-pass-input"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "43%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#5db075",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <br/><br/>
            <div className="label-container">
              <label>New Password</label>
              <div style={{ position: "relative"}}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="change-pass-input"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "43%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#5db075",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="label-container">
              <label>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="change-pass-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "43%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "#5db075",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && (
              <p className="error-message">{error}</p>
            )}
            {success && (
              <p className="success-message">{success}</p>
            )}
            <button onClick={handleSave} className="save-button">Save</button>
          </div>
          <div className="right-side">
            <div className="change-pass-image-container">
              <img src={newPromoImg} alt="Promotion" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
