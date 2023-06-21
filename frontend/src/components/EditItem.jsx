import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import { AiOutlineSave } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import {v4 as uuidv4} from 'uuid'

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
    const userData = JSON.parse(localStorage.getItem("userData"));

    const fetchData = async (zipCode) => {
        try {
            const response = await fetch(
                `http://localhost:4000/tax-by-zip?Zip5Lo=${zipCode}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const taxData = await response.json();
            return taxData;
        } catch (error) {
            console.error("Error fetching tax data:", error);
        }
    };

    const calculatePrice = async () => {
        const taxes = {
            stateTax: 0,
            cityTax: 0,
        };

        const taxData = await fetchData(values.zip);
        if (!taxData || taxData.length === 0) {
            taxes.cityTax = 0;
            taxes.stateTax = 0;
        } else {
            taxData.map((tax) => {
                if (
                    tax.JurisdictionTypeId === "STA" &&
                    (tax.Rate > taxes.stateTax || !taxes.stateTax)
                ) {
                    return (taxes.stateTax = Number.parseFloat(tax.Rate));
                } else if (
                    (tax.JurisdictionTypeId === "CTY" ||
                        tax.JurisdictionTypeId === "CIT") &&
                    (tax.Rate > taxes.cityTax || !taxes.cityTax)
                ) {
                    return (taxes.cityTax = Number.parseFloat(tax.Rate));
                }
                return taxes;
            });
        }
        values.cityTax = taxes.cityTax;
        values.stateTax = taxes.stateTax;
        values.combinedTax = values.cityTax + values.stateTax;
        values.totalTax = values.productPrice * values.combinedTax;
        values.totalPrice = values.totalTax + values.productPrice;
        values.userKey = userData._id;
        
        await updateProduct(values);
        values.key = uuidv4()
        console.log(values)
        onClose();
    };

    calculatePrice();
}
  

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
