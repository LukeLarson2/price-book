import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import Modal from "./EmailSentSuccessModal";
import EmailSpinner from "./EmailSpinner";

import FormikControl from "./FormikControl";

import "../stylesheets/ResetPassword.css";

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const { resetToken } = useParams(); // Get the reset token from the URL

  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, "Must contain at least 8 characters")
      .test("number", "Must contain a number", (value) => /\d/.test(value))
      .test("uppercase", "Must contain an uppercase letter", (value) =>
        /[A-Z]/.test(value)
      )
      .test("special", "Must contain a special character", (value) =>
        /[!@#$%^&*]/.test(value)
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Required"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/users/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: values.newPassword, resetToken }),
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
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
              <Form className="reset-password-form-control">
                <FormikControl
                  control="input"
                  type="password"
                  label="New Password"
                  name="newPassword"
                />
                <FormikControl
                  control="input"
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                />
                <button
                  className="forgot-password-email-btn"
                  type="submit"
                  disabled={!formik.isValid || loading}
                >
                  Reset Password{" "}
                  <span>
                    {loading ? (
                      <EmailSpinner className="email-sending-spinner" />
                    ) : (
                      ""
                    )}
                  </span>
                </button>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default ForgotPassword;
