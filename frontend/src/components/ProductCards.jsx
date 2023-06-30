import React, { useEffect, useState } from "react";
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
  const [deleteKey, setDeleteKey] = useState({});
  const [showModal, setShowModal] = useState(false);

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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const confirmRemove = () => {
    handleRemove(deleteKey.key);
    closeModal();
  };
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
                    setDeleteKey({ key: key, name: name });
                    openModal();
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
                  State: <b>{state}</b>{" "}
                </p>
                <p>
                  Zip Code: <b>{zip}</b>
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
              </div>
            )}
          </div>
        );
      })}
      {showModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h2 className="delete-modal-title">Delete Confirmation</h2>
              <p className="delete-modal-text">
                {`Are you sure you want to delete the "${deleteKey.name}" item?`}
              </p>
              <div className="delete-modal-btn-placement">
                <button className="confirm-delete-btn" onClick={confirmRemove}>
                  Yes
                </button>
                <button className="cancel-delete-btn" onClick={closeModal}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCards;
