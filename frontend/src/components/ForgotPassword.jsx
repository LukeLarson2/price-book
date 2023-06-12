import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "./EmailSentSuccessModal";
import EmailSpinner from "./EmailSpinner";

import "../stylesheets/ResetPassword.css";

function ForgotPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { resetToken } = useParams(); // Get the reset token from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/users/update-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, resetToken }), // Send the new password and reset token to the server
        }
      );

      if (response.ok) {
        setShowModal(true);
        navigate("/login");
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-form">
      {showModal && (
        <Modal
          message="Your password has been reset. Please login with your new password."
          setShowModal={setShowModal}
        />
      )}
      <div className="reset-password-container">
        <h2 className="title-position">Reset Your Password</h2>
        <input
          className="password-input"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="forgot-password-email-btn"
          type="submit"
          onClick={handleSubmit}
          disabled={!password || loading}
        >
          Reset Password{" "}
          <span>
            {loading ? <EmailSpinner className="email-sending-spinner" /> : ""}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
