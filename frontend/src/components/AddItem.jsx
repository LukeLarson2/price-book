import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormikControl from "./FormikControl";
import { AiOutlineSave } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import usStateAbbreviations from "./StateAbbs";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import "../stylesheets/AddItem.css";

function AddItem({ onClose, addProduct, setDetailsShown }) {
  //--CREATE NEW KEY FOR EACH PRODUCT--

  //--SET INITIAL VALUES FOR FORM--
  const initialValues = {
    name: "",
    state: "",
    zip: "",
    productPrice: 0,
    cityTax: 0,
    stateTax: 0,
    combinedTax: 0,
    totalTax: 0,
    totalPrice: 0,
    userKey: "",
    key: "",
  };

  //--VALIDATION--
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

  //--HANDLE SUBMIT--

  const onSubmit = (values) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData.accountType === "Free Trial") {
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
        values.key = uuidv4();

        setDetailsShown((prevState) => ({ ...prevState, [values.key]: false }));

        const axiosPostData = async () => {
          const postData = {
            ...values,
          };
          await axios
            .post("http://localhost:4000/products", postData)
            .then((res) => {
              addProduct(values);
              onClose();
            })
            .catch((error) => {
              console.error("Error adding product:", error);
              onClose();
            });
        };
        axiosPostData();
      };

      calculatePrice();
    } else if (userData.accountType === "Personal Account") {
      const fetchData = async (product) => {
        try {
          const response = await fetch(
            `http://localhost:4000/users/avatax-call`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                product: product,
              }),
            }
          );
          const taxData = await response.json();
          return taxData;
        } catch (error) {
          console.error("Error fetching tax data:", error);
        }
      };
      const avataxData = fetchData(values);
      console.log(avataxData);
    }
  };

  const handleOuterClick = (e) => {
    e.stopPropagation();
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
          <div className="add-item-modal-container" onClick={handleOuterClick}>
            <div
              className="add-item-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <Form className="add-item-form">
                <div className="new-item-position">
                  <label className="add-item-title">Add a new product</label>
                </div>
                <FormikControl
                  control="input"
                  type="text"
                  label="Product"
                  name="name"
                  className="add-item-field"
                />
                <div className="dollar">
                  <p className="dollar-sign">$</p>
                  <FormikControl
                    control="input"
                    type="number"
                    label="Price"
                    name="productPrice"
                    className="add-item-field"
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
                  className="add-item-field"
                />
                <div className="add-item-btn-placement">
                  <button className="add-item-upload" type="submit">
                    Save
                    <AiOutlineSave className="add-item-upload-icon" />
                  </button>
                  <button
                    type="button"
                    className="add-item-cancel"
                    onClick={onCancel}
                  >
                    Cancel <MdOutlineCancel className="add-item-cancel-icon" />
                  </button>
                </div>
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default AddItem;
