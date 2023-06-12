import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Modal from "./EmailSentSuccessModal";

import FormikControl from "../components/FormikControl";
import EmailSpinner from "./EmailSpinner";

import "../stylesheets/ForgotEmailRequest.css";

function ForgotPasswordRequest() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
                message="Check your email for password reset instructions"
                setShowModal={setShowModal}
              />
            )}
            <Form>
              <div className="title-position">
                <label className="title">Forgot Password</label>
              </div>
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
              />
              <div className="btn-placement">
                <button
                  className="forgot-password-email-btn"
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Submit{" "}
                  <span>
                    {loading ? (
                      <EmailSpinner className="email-sending-spinner" />
                    ) : (
                      ""
                    )}
                  </span>
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