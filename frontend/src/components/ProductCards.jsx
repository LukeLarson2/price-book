import React, { useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { GoTriangleRight } from "react-icons/go";

import "../stylesheets/ProductCards.css";

function ProductCards({
  products,
  handleEditItemClick,
  handleRemove,
  isDetailsShown,
  setDetailsShown,
}) {
  useEffect(() => {
    const newDetailsShownState = products.reduce(
      (acc, product) => {
        if (acc[product.key] === undefined) {
          acc[product.key] = false;
        }
        return acc;
      },
      { ...isDetailsShown }
    );

    // check if the state is different
    if (
      JSON.stringify(newDetailsShownState) !== JSON.stringify(isDetailsShown)
    ) {
      setDetailsShown(newDetailsShownState);
    }
  }, [products, isDetailsShown, setDetailsShown]);
  return (
    <div className="product-list">
      {products
    .map((product) => {
      const totalPrice = product.totalPrice;
    const {
      key,
      name,
      productPrice,
      state,
      zip,
      combinedTax,
      totalTax,
      cityTax,
      stateTax,
    } = product;
    const cityTaxPercent = (cityTax * 100).toFixed(2);
    const stateTaxPercent = (stateTax * 100).toFixed(2);
    const combinedTaxPercent = (combinedTax * 100).toFixed(2);
        return (
          <div
            key={key}
            className="product-info"
            style={{ height: isDetailsShown[key] ? "fit-content" : "80px" }}
          >
            <div
              className="product-header"
              onClick={() =>
                setDetailsShown({
                  ...isDetailsShown,
                  [key]: !isDetailsShown[key],
                })
              }
            >
              <h2 className="product-title">
                <GoTriangleRight
                  className={`toggle-product-details ${
                    isDetailsShown[key] ? "rotated" : ""
                  }`}
                />{" "}
                <b>{name}</b>
              </h2>
              <div className="edit-del-btns">
                <AiFillEdit
                  className="edit-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditItemClick(product);
                  }}
                />
                <FiTrash2
                  className="delete-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(key);
                  }}
                />
              </div>
            </div>
            {isDetailsShown[key] && (
              <div className="product-details">
                <p>
                  Product Price: <b>${productPrice}</b>{" "}
                </p>
                <p>
                  City Tax: <b>{cityTaxPercent}%</b>{" "}
                </p>
                <p>
                  State Tax: <b>{stateTaxPercent}%</b>{" "}
                </p>
                <p>
                  Combined Tax: <b>{combinedTaxPercent}%</b>{" "}
                </p>
                <p>
                  Total Tax: <b>${totalTax.toFixed(2)}</b>{" "}
                </p>
                <p>
                  Total Cost: <b>${totalPrice.toFixed(2)}</b>{" "}
                </p>
                <p>
                  State: <b>{state}</b>{" "}
                </p>
                <p>
                  Zip Code: <b>{zip}</b>
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProductCards;
