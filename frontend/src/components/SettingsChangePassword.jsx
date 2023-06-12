import React from "react";
import * as Yup from "yup";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikControl from "./FormikControl";

import "../stylesheets/SettingsChangePassword.css";

const SettingsChangePassword = () => {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Required"),
    newPassword: Yup.string().required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = async (
    values,
    { setFieldError, resetForm, setSubmitting, setStatus }
  ) => {
    const { currentPassword, newPassword } = values;
    try {
      // check current password
      const currentPasswordResponse = await axios.post(
        "/users/validate-password",
        {
          password: currentPassword,
        }
      );

      if (!currentPasswordResponse.data.isValid) {
        setFieldError("currentPassword", "Password is incorrect");
        return;
      }

      // update new password
      const newPasswordResponse = await axios.put("/users/update-password", {
        password: newPassword,
      });

      if (newPasswordResponse.status === 200) {
        resetForm();
        setStatus("Password updated successfully!");
      } else {
        setStatus("Failed to update password");
      }
    } catch (error) {
      setStatus("An error occurred");
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ status }) => {
        return (
          <div className="main-container">
            <Form className="form-container">
              <div className="settings-title">
                <h2>Change Password</h2>
              </div>
              <div className="update-password-container">
                <FormikControl
                  control="input"
                  type="password"
                  label="Current Password"
                  name="currentPassword"
                />
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
                <button type="submit" className="change-password-btn">
                  Update Password
                </button>
                {status && <div className="form-status">{status}</div>}
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default SettingsChangePassword;
