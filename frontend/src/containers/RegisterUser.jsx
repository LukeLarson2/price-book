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
    phone: "None",
    accountType: "Free Trial",
    company: "None",
    role: "None",
    password: "",
    confirmPassword: "",
  };

  //--VALIDATION--
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string()
      .email("Invalid Format (example@email.com)")
      .required("Required"),
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
  const onSubmit = async (values) => {
    values.phone = 'None'
    values.company = 'None'
    values.role = 'None'
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
      .then(() => {
        // The user registration completed successfully. Now we can attempt to login.
        fetch("http://localhost:4000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: updatedValues.email,
            password: updatedValues.password // you need to include the password for login
          }),
        })
        .then(async(response) => {
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("userData", JSON.stringify(userData));
            navigate("/home");
          } else {
            console.error("Failed to login");
          }
        })
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
            <div className="login-app-header">
              <BiBookBookmark className="login-app-icon" />
              <h2>Price Book</h2>
            </div>
            <Form className="register-user-modal-shadow-control">
              <div className="title-position">
                <label className="title">Register New User</label>
              </div>
              <div className="fields-wrapper">
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
