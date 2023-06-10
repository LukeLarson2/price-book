//--EXTERNAL IMPORTS--
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

//--INTERNAL IMPORTS--
import FormikControl from "../components/FormikControl";

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
      .min(6, "Must contain at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Required"),
  });

  const validationCheck = () => {
    console.log(validationSchema);
  };
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
          console.log(formik.errors);
          console.log(formik.touched);
        };
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
                control="input"
                type="text"
                label="Phone"
                name="phone"
                onBlur={handleBlur}
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
                type="text"
                label="Company"
                name="company"
              />
              <FormikControl
                control="input"
                type="text"
                label="Role"
                name="role"
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
