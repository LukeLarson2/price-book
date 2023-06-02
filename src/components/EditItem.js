import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

import usStateAbbreviations from "./StateAbbs";

function EditItem({ onClose, product, updateProduct, updateUserProducts }) {
  const [editedProduct, setEditedProduct] = useState(product); // Use product as initial state

  const validationSchema = Yup.object({
    name: Yup.string().max(10, "Maximum of 10 characters").required("Required"),
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

  const onSubmit = async (values) => {
    const stateTax = usStateAbbreviations.find(
      (stateInfo) => stateInfo.value === values.state
    );
    const totalPrice =
      values.productPrice * stateTax.salesTax + values.productPrice;
    const updatedValues = {
      ...values,
      salesTax: stateTax.salesTax,
      totalPrice: totalPrice,
    };

    await setEditedProduct(updatedValues);
    updateProduct(updatedValues); // Call the updateProduct function from Home component
    updateUserProducts(updatedValues); // Call the updateUserProducts function from Home component
    onClose();
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Formik
      initialValues={editedProduct} // Use editedProduct as initialValues
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="modal-container">
            <div className="modal-content">
              <div className="add-item-form">
                <div className="add-item-form">
                  <Form className="add-item-modal-shadow-control">
                    <div className="new-item-position">
                      <label className="add-item-title">
                        Edit "{product.name}"
                      </label>
                    </div>
                    <FormikControl
                      control="input"
                      type="text"
                      label="Product"
                      name="name"
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
                          Update <AiOutlineCloudUpload />
                        </button>
                        <button
                          type="button"
                          className="cancel"
                          onClick={onCancel}
                        >
                          Cancel <MdOutlineCancel />
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default EditItem;
