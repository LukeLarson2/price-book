import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FormikControl from "../components/FormikControl";
import { userData } from "../backend/TempDB";

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

  const onSubmit = (values) => {
    userData.push(values);
    navigate("/home");
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
                    disabled={!formik.isValid}
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
