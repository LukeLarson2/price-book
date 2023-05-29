import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import usStateAbbreviations from "./StateAbbs";
import { v4 as uuidv4 } from "uuid";
import { userProducts } from "../utils/products";

function EditItem({ onClose, ...props }) {
  const [products, setProducts] = useState(userProducts);
  const { product } = props;
  const { name, state, zip, productPrice } = product;
  const oldKey = product.key;
  const initialValues = {
    key: uuidv4(),
    name: name,
    state: state,
    zip: zip,
    productPrice: productPrice,
    salesTax: 0,
    totalPrice: 0,
  };

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

  const onSubmit = (values) => {
    values.salesTax = function () {
      return this.productPrice * 0.05;
    };
    values.totalPrice = function () {
      return this.productPrice + this.salesTax();
    };
    values.key = oldKey; // Keep the same key for the updated product

    const updatedProducts = products.map((product) =>
      product.key === oldKey ? values : product
    );

    setProducts(updatedProducts); // Update the state with the updated products
    userProducts.splice(
      userProducts.findIndex((product) => product.key === oldKey),
      1,
      values
    ); // Replace the product in the userProducts array with the updated values
    console.log(userProducts);
    onClose();
  };

  const onCancel = () => {
    onClose();
  };
  return (
    <Formik
      initialValues={initialValues}
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
                      <label className="add-item-title">Edit "{name}"</label>
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
