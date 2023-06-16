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

    if (!file) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    let result;
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      result = await response.json();
    } catch (error) {
      console.error("Error with /upload fetch call:", error);
    }

    for (let i = 0; i < result.data.length; i++) {
      const product = result.data[i];
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

        const taxData = await fetchData(product.zip);
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
        product.name = product.product;
        product.productPrice = product.price;
        product.cityTax = taxes.cityTax;
        product.stateTax = taxes.stateTax;
        product.salesTax = product.cityTax + product.stateTax;
        product.totalPrice =
          product.productPrice * product.salesTax + product.productPrice;
        product.userKey = userKey;
        product.key = uuidv4();

        setDetailsShown((prevState) => ({
          ...prevState,
          [product.key]: false,
        }));

        const axiosPostData = async () => {
          const postData = {
            ...product,
          };
          await axios
            .post("http://localhost:4000/products", postData)
            .then((res) => {
              addProduct(product);
              setUpdate(product);
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
          <div
            className="add-item-document-modal-container"
            onClick={onClose} // Close the modal when clicking outside the content
          >
            <div
              className="add-item-document-modal-content"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside the content from closing the modal
            >
              <Form className="add-item-document-form">
                <div className="upload-file-title-container">
                  <h2 className="upload-file-title">Upload Product File</h2>
                </div>
                <div className="new-item-document-position">
                  <label className="file-upload-container" htmlFor="file">
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
                    onClick={onClose} // Close the modal when cancel is clicked
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
