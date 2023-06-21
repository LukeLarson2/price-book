import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Loader from "../components/Loader";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import "../stylesheets/AddItemDocument.css";

const FileUpload = ({
  onClose,
  addProduct,
  userKey,
  setDetailsShown,
  setUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(undefined);
  const [fileName, setFileName] = useState("");

  const initalValues = {
    file: "",
  };

  const validationSchema = Yup.object({});

  const onSubmit = async (values) => {
    setIsLoading(true);

    if (!file) return setIsLoading(false);

    const formData = new FormData();
    formData.append("file", file);

    let result = await fetch("/upload", { method: "POST", body: formData })
      .then((res) => res.json())
      .catch((error) => console.error("Error with /upload fetch call:", error));

    for (let product of result.data) {
      const getVal = (key) =>
        product[
          Object.keys(product).find(
            (k) => k.toLowerCase() === key.toLowerCase()
          )
        ];

      if (!["product", "price", "state", "zip"].every((key) => getVal(key)))
        continue;

      const [productValue, priceValue, stateValue, zipValue] = [
        "product",
        "price",
        "state",
        "zip",
      ].map(getVal);

      const fetchData = async (zipCode) => {
        return fetch(`http://localhost:4000/tax-by-zip?Zip5Lo=${zipCode}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .catch((error) => console.error("Error fetching tax data:", error));
      };

      const taxes = (await fetchData(zipValue)).reduce(
        (acc, tax) => ({
          stateTax:
            tax.JurisdictionTypeId === "STA" && tax.Rate > acc.stateTax
              ? Number.parseFloat(tax.Rate)
              : acc.stateTax,
          cityTax:
            ["CTY", "CIT"].includes(tax.JurisdictionTypeId) &&
            tax.Rate > acc.cityTax
              ? Number.parseFloat(tax.Rate)
              : acc.cityTax,
        }),
        { stateTax: 0, cityTax: 0 }
      );

      const newProduct = {
        ...product,
        name: productValue,
        productPrice: priceValue,
        cityTax: taxes.cityTax,
        stateTax: taxes.stateTax,
        combinedTax: taxes.cityTax + taxes.stateTax,
        totalTax: priceValue * (taxes.cityTax + taxes.stateTax),
        totalPrice: priceValue * (taxes.cityTax + taxes.stateTax) + priceValue,
        userKey,
        state: stateValue,
        zip: zipValue,
        key: uuidv4(),
      };

      setDetailsShown((prevState) => ({
        ...prevState,
        [newProduct.key]: false,
      }));

      axios
        .post("http://localhost:4000/products", newProduct)
        .then((res) => {
          addProduct(newProduct);
          setUpdate(newProduct);
          onClose();
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          onClose();
        });
    }
    setIsLoading(false);
  };

  return (
    <Formik
      initialValues={initalValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <div className="add-item-document-modal-container" onClick={onClose}>
            <div
              className="add-item-document-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <Form className="add-item-document-form">
                <div className="upload-file-title-container">
                  <h2 className="upload-file-title">Upload Product File</h2>
                  <p className="upload-file-description">File should include columns labeled <b>Product</b>, <b>Price</b>, <b>State</b> and <b>Zip</b>.</p>
                </div>
                <div className="new-item-document-position">
                  <label className="file-upload-btn" htmlFor="file">
                    <input
                      name="file"
                      className="add-item-document-field"
                      type="file"
                      id="file"
                      onChange={(event) => {
                        setFile(event.currentTarget.files[0]);
                        setFileName(event.currentTarget.files[0]?.name);
                        formik.setFieldValue(
                          "file",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    Select File
                  </label>
                  {fileName ? (
                    <div className="file-name-container">
                      <div className="file-name-display">{fileName}</div>
                    </div>
                  ) : (
                    <div className="file-name-container">
                      <div className="file-name-display">No file selected</div>
                    </div>
                  )}

                  <ErrorMessage name="file" component="div" />
                </div>
                <div className="add-item-document-btn-placement">
                  <button className="add-item-document-upload" type="submit">
                    Upload{" "}
                    <AiOutlineCloudUpload className="add-item-upload-icon" />
                  </button>
                  <button
                    className="add-item-document-cancel"
                    type="button"
                    onClick={onClose}
                  >
                    Cancel <MdOutlineCancel className="add-item-cancel-icon" />
                  </button>
                </div>
                {isLoading ? <Loader /> : ""}
              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};

export default FileUpload;
