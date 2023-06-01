import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FormikControl from "../components/FormikControl";

function LoginForm() {
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid Format").required("Required"),
    password: Yup.string().required("Required"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const userData = await response.json();

        // Check if email and password match within backend data
        const matchUser = await fetch("http://localhost:4000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (matchUser.ok) {
          // Match found
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/home");
        } else {
          // No match found
          setSubmitting(false);
        }
      } else {
        // Invalid credentials
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitting(false);
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
          <div className="login-form">
            <Form>
              <div className="title-position">
                <label className="title">Login</label>
              </div>
              <FormikControl
                control="input"
                type="email"
                label="Email"
                name="email"
              />
              <FormikControl
                control="input"
                type="password"
                label="Password"
                name="password"
              />
              <div className="login-signup">
                <div className="btn-placement">
                  <button
                    className="login"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                    onClick={formik.handleSubmit}
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
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
