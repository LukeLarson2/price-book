import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "../components/FormikControl";
import { useNavigate } from "react-router-dom";
import { TempDB } from "../backend/TempDB";
import { v4 as uuidv4 } from "uuid";

function RegisterUser() {
  const navigate = useNavigate();
  const initialValues = {
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
    values.key = uuidv4();
    console.log("Form data", values);
    TempDB(values);
    navigate("/");
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
            <Form>
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
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterUser;
