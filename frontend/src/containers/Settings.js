import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BsFillGearFill } from "react-icons/bs";

import FormikControl from "../components/FormikControl";
import { fetchUser } from "../utils/fetchUser";

const Settings = () => {
  const userData = fetchUser();
  const navigate = useNavigate();
  const initialValues = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    accountType: userData.accountType,
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string()
      .email("Invalid Format (example@email.com)")
      .required("Required"),
    accountType: Yup.string().required("Required"),
  });
  const onSubmit = () => {
    console.log("Updates submitted");
  };
  const handleGoBack = () => {
    navigate("/home", { replace: true });
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <div className="user-settings-form">
        <Form>
          <button className="go-back-btn" onClick={handleGoBack}>
            {`<`} Back
          </button>
          <div className="settings-title-position">
            <label className="settings-title">
              <BsFillGearFill className="settings-gear-icon" />
              <h3 className="settings-title-text">User Settings</h3>
            </label>
          </div>
          <FormikControl
            control="input"
            type="text"
            label="Full name"
            name="name"
            disabled={true}
          />
          <FormikControl
            control="input"
            type="email"
            label="Email"
            name="email"
            disabled={true}
          />
          <div className="account-plan-container">
            <FormikControl
              control="input"
              type="text"
              label="Account plan"
              name="accountType"
              className="settings-account-type"
              disabled={true}
            />
            <button className="view-account-types-btn">Explore Options</button>
          </div>
          <button className="change-password-btn">Change Password</button>
          <button className="user-agreement-btn">User Agreement</button>
        </Form>
      </div>
    </Formik>
  );
};

export default Settings;
