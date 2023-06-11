import React from "react";
import * as Yup from "yup";
import axios from "axios";
import { Formik, Form } from "formik";
import FormikControl from "./FormikControl";

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

  const onSubmit = async (values) => {
    const { currentPassword, newPassword } = values;
    console.log("form submitted");
    try {
      // check current password
      const currentPasswordResponse = await axios.post(
        "/users/validate-password",
        {
          password: currentPassword,
        }
      );

      if (!currentPasswordResponse.data.isValid) {
        alert("Current password is incorrect");
        return;
      }

      // update new password
      const newPasswordResponse = await axios.put("/users/update-password", {
        password: newPassword,
      });

      if (newPasswordResponse.status === 200) {
        console.log("Password updated successfully");
      } else {
        console.log("Failed to update password");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="change-password-container">
            <Form>
              <div className="settings-title">Change Password</div>
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
                <button
                  type="submit"
                  className="change-password-btn"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Update Password
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default SettingsChangePassword;
