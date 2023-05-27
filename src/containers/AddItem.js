import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "../components/FormikControl";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import usStateAbbreviations from "../components/StateAbbs";

function AddItem() {
  const initialValues = {
    product: "",
    state: "",
    zip: "",
    productPrice: 0,
    salesTax: 0,
    totalPrice: 0,
  };

  const validationSchema = Yup.object({
    product: Yup.string()
      .max(10, "Maximum of 10 characters")
      .required("Required"),
    state: Yup.string().required("Required"),
    zip: Yup.string()
      .min(5, "Must be at least 5 digits")
      .max(5, "Must be at least 5 digits")
      .required("Required"),
    productPrice: Yup.number()
      .integer("Please enter a whole number")
      .moreThan(0, "Price must be greater than zero")
      .required("Required"),
  });

  const onSubmit = (values, onSubmitProps) => {
    console.log("Form data", values);
    onSubmitProps.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="add-item-form">
            <Form>
              <div className="new-item-position">
                <label className="add-item-title">Add a new product</label>
              </div>
              <FormikControl
                control="input"
                type="text"
                label="Product"
                name="product"
              />
              <div className="dollar">
                <p className="dollar-sign">$</p>
                <FormikControl
                  control="input"
                  type="number"
                  label="Price"
                  name="productPrice"
                />
              </div>
              <FormikControl
                control="select"
                type="select"
                label="State"
                name="state"
                options={usStateAbbreviations}
                id="state"
              />
              <FormikControl
                control="input"
                type="text"
                label="Zip Code"
                name="zip"
                id="zip"
              />
              <div className="upload-cancel">
                <div className="btn-placement">
                  <button className="upload" type="submit">
                    Upload <AiOutlineCloudUpload />
                  </button>
                  <button type="button" className="cancel">
                    Cancel <MdOutlineCancel />
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

export default AddItem;
