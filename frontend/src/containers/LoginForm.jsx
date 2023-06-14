//--EXTERNAL IMPORTS--
import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { BiBookBookmark } from "react-icons/bi";

//--INTERNAL IMPORTS--
import FormikControl from "../components/FormikControl";
import "../stylesheets/Login.css";

function LoginForm() {
  //--SET USE NAVIGATE--
  const navigate = useNavigate();

  //--SET FORM INITIAL VALUES--
  const initialValues = {
    email: "",
    password: "",
  };

  //--VALIDATION--
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid Format").required("Required"),
    password: Yup.string().required("Required"),
  });

  //--HANDLE SUBMIT OF LOGIN REQUEST--
  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("userData", JSON.stringify(userData));
        navigate("/home");
      } else {
        const errorMessage = await response.json();
        setFieldError("password", errorMessage.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password-request", { replace: true });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="login-form">
            <div className="login-app-header">
              <BiBookBookmark className="login-app-icon" />
              <h2 className="login-app-title">Price Book</h2>
            </div>
            {/* <div className="login-welcome-back">Good to see you again!</div> */}
            <Form className="login-form-container">
              <div className="title-position">
                <label className="title">Login</label>
              </div>
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
                className="login-email"
              />
              <FormikControl
                control="input"
                type="password"
                label="Password"
                name="password"
                className="login-password"
              />
              <div className="login-signup">
                <div className="btn-placement">
                  <button
                    className="login"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Login
                  </button>
                </div>
                <p className="or">or</p>
                <div className="btn-placement">
                  <button
                    className="sign-up"
                    type="button"
                    onClick={() => navigate("/user-registration")}
                  >
                    Sign Up
                  </button>
                </div>
                <p
                  className="forgot-password"
                  onClick={() => handleForgotPassword()}
                >
                  Forgot password?
                </p>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
