//--EXTERNAL IMPORTS--
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { BiBookBookmark } from "react-icons/bi";

//--INTERNAL IMPORTS--
import FormikControl from "../components/FormikControl";
import "../stylesheets/RegisterUser.css";

function RegisterUser() {
  //--SET USE NAVIGATE--
  const navigate = useNavigate();

  //--SET INITAL VALUES TO FORM--
  const initialValues = {
    key: uuidv4(),
    name: "",
    email: "",
    phone: "",
    accountType: "",
    company: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  //--ACCOUNT TYPES FOR SELECT LIST--
  const accountTypes = [
    { key: "Select account type", value: "" },
    { key: "Free Trial", value: "Free Trial" },
    { key: "Personal", value: "Personal" },
    { key: "Commercial", value: "Commercial" },
  ];

  //--VALIDATION--
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string()
      .email("Invalid Format (example@email.com)")
      .required("Required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number, must be 10 digits")
      .required("Required"),
    accountType: Yup.string().required("Required"),
    password: Yup.string()
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
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Required"),
  });

  //--HANDLE SUBMIT FOR REGISTER USER--
  const onSubmit = (values) => {
    const updatedValues = { ...values };

    // Send the data to the backend
    fetch("http://localhost:4000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedValues),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        console.error("Error sending data to backend:", error);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const handleBlur = (e) => {
          const { value, name } = e.target;
          const onlyNums = value.replace(/[^\d]/g, ""); // removes non-digits
          formik.setFieldValue(name, onlyNums, true); // The third parameter 'shouldValidate' is set to true to run validation after state update
        };
        return (
          <div className="register-user-form">
            <div className="login-app-header">
              <BiBookBookmark className="login-app-icon" />
              <h2>Price Book</h2>
            </div>
            <Form className="register-user-modal-shadow-control">
              <div className="title-position">
                <label className="title">Register New User</label>
              </div>
              <div class="fields-wrapper">
                <FormikControl
                  control="input"
                  type="text"
                  label="Full Name"
                  name="name"
                  className="register-user-field"
                />
                <FormikControl
                  control="input"
                  type="email"
                  label="Email"
                  name="email"
                  className="register-user-field"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Phone"
                  name="phone"
                  className="register-user-field"
                  onBlur={handleBlur}
                />
                <FormikControl
                  control="select"
                  type="select"
                  label="Account Type"
                  name="accountType"
                  id="account"
                  className="register-select-account"
                  options={accountTypes}
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Company"
                  name="company"
                  className="register-user-field"
                />
                <FormikControl
                  control="input"
                  type="text"
                  label="Role"
                  name="role"
                  className="register-user-field"
                />
                <FormikControl
                  control="input"
                  type="password"
                  label="Password"
                  name="password"
                  className="register-user-field"
                />
                <FormikControl
                  control="input"
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  className="register-user-field"
                />
                <div className="register-user-btn-placement">
                  <button
                    className="create-user"
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    Submit
                  </button>
                  <button
                    className="register-cancel"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterUser;
