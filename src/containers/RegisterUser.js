import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "../components/FormikControl";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function RegisterUser({ onClose }) {
  const navigate = useNavigate();
  const initialValues = {
    key: "",
    name: "",
    email: "",
    accountType: "",
    password: "",
    confirmPassword: "",
  };

  const accountTypes = [
    { key: "Select account type", value: "" },
    { key: "Personal", value: "personal" },
    { key: "Commercial", value: "commercial" },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string()
      .email("Invalid Format (example@email.com)")
      .required("Required"),
    accountType: Yup.string().required("Required"),
    password: Yup.string()
      .min(6, "Must contain at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Required"),
  });

  const onSubmit = (values) => {
    const updatedValues = { ...values, key: uuidv4() };
    localStorage.setItem("userData", JSON.stringify(updatedValues));
    navigate("/home", { replace: true });
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="register-user-form">
            <Form className="add-item-modal-shadow-control">
              <div className="title-position">
                <label className="title">Create User</label>
              </div>
              <FormikControl
                control="input"
                type="text"
                label="Full Name"
                name="name"
              />
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
              />
              <FormikControl
                control="select"
                type="select"
                label="Account Type"
                name="accountType"
                id="account"
                options={accountTypes}
              />
              <FormikControl
                control="input"
                type="password"
                label="Password"
                name="password"
              />
              <FormikControl
                control="input"
                type="password"
                label="Confirm Password"
                name="confirmPassword"
              />
              <div className="btn-placement">
                <button
                  className="create-user"
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Submit
                </button>
                <button
                  className="cancel"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Cancel
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterUser;
