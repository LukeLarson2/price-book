import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import { AiOutlineSave } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";

import usStateAbbreviations from "./StateAbbs";
import "../stylesheets/EditItem.css";

function EditItem({ userKey, onClose, product, updateProduct }) {
  // const [editedProduct, setEditedProduct] = useState(product);

  //--FIELD VALIDATION--
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zip: Yup.string()
      .min(5, "Must be at least 5 digits")
      .max(5, "Must be at least 5 digits")
      .required("Required"),
    productPrice: Yup.number()
      .moreThan(0, "Price must be greater than zero")
      .required("Required"),
  });

  //--FORM SUBMISSION--
  const onSubmit = async (values) => {
    const stateTax = usStateAbbreviations.find(
      (stateInfo) => stateInfo.value === values.state
    );
    const totalPrice =
      values.productPrice * stateTax.salesTax + values.productPrice;
    values.totalPrice = totalPrice;
    values.salesTax = stateTax.salesTax;
    values.userKey = userKey;
    const updatedValues = {
      ...values,
    };
    // await setEditedProduct(updatedValues);
    await updateProduct(updatedValues);
    onClose();
  };

  const onCancel = () => {
    onClose();
  };

  return (
    <Formik
      initialValues={product}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="edit-item-modal-container">
            <div className="edit-item-modal-content">
              <div className="edit-item-form">
                <Form className="edit-item-modal-shadow-control">
                  <div className="edit-item-position">
                    <label className="edit-item-title">
                      Edit "{product.name}"
                    </label>
                  </div>
                  <FormikControl
                    control="input"
                    type="text"
                    label="Product"
                    name="name"
                    className="edit-item-field"
                  />
                  <div className="dollar">
                    <p className="dollar-sign">$</p>
                    <FormikControl
                      control="input"
                      type="number"
                      label="Price"
                      name="productPrice"
                      className="edit-item-field"
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
                    className="edit-item-field"
                  />
                  <div className="edit-item-upload-cancel">
                    <div className="edit-item-btn-placement">
                      <button className="edit-item-upload" type="submit">
                        Save
                        <AiOutlineSave className="edit-item-upload-icon" />
                      </button>
                      <button
                        type="button"
                        className="edit-item-cancel"
                        onClick={onCancel}
                      >
                        Cancel
                        <MdOutlineCancel className="edit-item-cancel-icon" />
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default EditItem;
