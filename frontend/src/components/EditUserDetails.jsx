import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";

import FormikControl from "./FormikControl";
import "../stylesheets/EditUserDetails.css";

const EditUserDetails = ({ modalIsOpen, setModalIsOpen, modalContent }) => {
  if (!modalContent) {
    return null;
  }

  const handleCloseModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  const { name, phone, email, company, role, _id } = modalContent;

  const initialValues = {
    name: name,
    phone: phone,
    email: email,
    company: company,
    role: role,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string()
      .email("Invalid Format (example@email.com)")
      .required("Required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Invalid phone number, must be 10 digits")
      .required("Required"),
  });

  const onSubmit = (values) => {
    axios
      .put("/users/update-profile", {
        userId: _id,
        ...values,
      })
      .then((res) => {
        if (res.data && res.data.userData) {
          // Update local storage with the returned data
          localStorage.setItem("userData", JSON.stringify(res.data.userData));
          setModalIsOpen(!modalIsOpen);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="edit-user-details-content">
            <h2>Edit User Details</h2>
            <Form className="edit-user-details-fields">
              <FormikControl
                control="input"
                type="text"
                name="name"
                label="Full Name"
                className="edit-user-field"
              />
              <FormikControl
                control="input"
                type="text"
                name="phone"
                label="Phone"
                className="edit-user-field"
              />
              <FormikControl
                control="input"
                type="email"
                name="email"
                label="Email"
                className="edit-user-field"
              />
              <FormikControl
                control="input"
                type="text"
                name="company"
                label="Company"
                className="edit-user-field"
              />
              <FormikControl
                control="input"
                type="text"
                name="role"
                label="Role"
                className="edit-user-field"
              />
              <div className="edit-user-details-btn-placement">
                <button
                  type="submit"
                  disabled={!formik.isValid}
                  className="edit-user-details-update-btn"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="edit-user-details-cancel-btn"
                  onClick={handleCloseModal}
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
};

export default EditUserDetails;
