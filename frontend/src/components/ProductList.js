import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { GoTriangleRight } from "react-icons/go";

function ProductList({
  products,
  handleEditItemClick,
  handleRemove,
  isDetailsShown,
  setDetailsShown,
}) {
  return (
    <div className="product-list">
      {products.map((product) => {
        const totalPrice = product.totalPrice;
        const {
          key,
          name,
          productPrice,
          state,
          zip,
          salesTax,
          cityTax,
          stateTax,
        } = product;
        return (
          <div
            key={key}
            className="product-info"
            style={{ height: isDetailsShown[key] ? "450px" : "80px" }}
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
                {name}
              </h2>
              <div className="edit-del-btns">
                <AiFillEdit
                  className="edit-item"
                  onClick={() => handleEditItemClick(product)}
                />
                <FiTrash2
                  className="delete-item"
                  onClick={() => handleRemove(key)}
                />
              </div>
            </div>
            {isDetailsShown[key] && (
              <div className="product-details">
                <p>
                  Product Price: <b>${productPrice}</b>{" "}
                </p>
                <p>
                  Total Tax: <b>{salesTax.toFixed(3) * 100}%</b>{" "}
                </p>
                <p>
                  City Tax: <b>{cityTax.toFixed(3) * 100}%</b>{" "}
                </p>
                <p>
                  State Tax: <b>{stateTax.toFixed(3) * 100}%</b>{" "}
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

export default ProductList;
