import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../stylesheets/ProductDetailModal.css";

function ProductDetailModal({ product, onClose }) {
  const {
    name,
    productPrice,
    cityTax,
    stateTax,
    combinedTax,
    totalTax,
    totalPrice,
    state,
    zip,
  } = product;

  const cityTaxPercent = (cityTax * 100).toFixed(2);
  const stateTaxPercent = (stateTax * 100).toFixed(2);
  const combinedTaxPercent = (combinedTax * 100).toFixed(2);
  const totalTaxDollar = totalTax.toFixed(2);
  const totalPriceDollar = totalPrice.toFixed(2);
  return (
    <div className="product-detail-modal-overlay">
      <div className="product-detail-modal">
        <h2 className="product-detail-title">Product Details</h2>
        <div className="product-detail-content">
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Price:</strong> {productPrice}
          </p>
          <p>
            <strong>City Tax:</strong> {cityTaxPercent}%
          </p>
          <p>
            <strong>State City:</strong> {stateTaxPercent}%
          </p>
          <p>
            <strong>Combined Tax:</strong> {combinedTaxPercent}%
          </p>
          <p>
            <strong>Total Tax:</strong> ${totalTaxDollar}
          </p>
          <p>
            <strong>Total Price:</strong> ${totalPriceDollar}
          </p>
          <p>
            <strong>State:</strong> {state}
          </p>
          <p>
            <strong>Zip:</strong> {zip}
          </p>
        </div>
        <div className="product-detail-btn-placement">
          <button className="product-detail-btn" onClick={onClose}>
            <AiOutlineCloseCircle className="product-detail-close-icon" />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
