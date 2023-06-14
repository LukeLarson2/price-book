import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Modal from "./EmailSentSuccessModal";
import { useNavigate } from "react-router-dom";
import { BiBookBookmark } from "react-icons/bi";

import FormikControl from "../components/FormikControl";
import EmailSpinner from "./EmailSpinner";

import "../stylesheets/ForgotPasswordRequest.css";

function ForgotPasswordRequest() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid Format").required("Required"),
  });

  const onSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm }
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:4000/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        resetForm();
        setShowModal(true); // Show the modal instead of alert
      } else {
        const errorMessage = await response.json();
        setFieldError("email", errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
    setLoading(false);
  };
  const handleGoBack = () => {
    navigate("/login", { replace: true });
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
            <div className="login-app-header">
              <BiBookBookmark className="login-app-icon" />
              <h2>Price Book</h2>
            </div>
            {showModal && (
              <Modal
                message="Check your email for password reset instructions"
                setShowModal={setShowModal}
              />
            )}
            <Form className="forgot-password-container">
              <div className="title-position">
                <label className="title">Forgot Password</label>
              </div>
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
                placeholder="example@email.com"
                className="forgot-password-email-field"
              />
              <div className="forgot-password-btn-placement">
                <button
                  className="forgot-password-email-btn"
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Submit
                  <span>
                    {loading ? (
                      <EmailSpinner className="email-sending-spinner" />
                    ) : (
                      ""
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleGoBack()}
                  className="go-back-login-btn"
                >
                  Go back
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default ForgotPasswordRequest;
