import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
function ProductTable({ products, handleEditItemClick, handleRemove }) {
  return (
    <div className="table-placement">
      <div className="table-header">
        <h3>Name</h3>
        <h3>Price</h3>
        <h3>City Tax</h3>
        <h3>State Tax</h3>
        <h3>Total Tax</h3>
        <h3>Total Price</h3>
        <h3>State</h3>
        <h3>Zip Code</h3>
        <h3>Edit/Delete</h3>
      </div>
      <div className="table-product-container">
        <div className="scrolling-content">
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
              <div className="table-each-product" key={key}>
                <div>
                  <b>{name}</b>
                </div>
                <div>${productPrice}</div>
                <div>{cityTax.toFixed(3) * 100}%</div>
                <div>{stateTax.toFixed(3) * 100}%</div>
                <div>{salesTax.toFixed(3) * 100}%</div>
                <div>${totalPrice.toFixed(2)}</div>
                <div>{state}</div>
                <div>{zip}</div>
                <div className="table-edit-del-btns">
                  <AiFillEdit
                    className="table-edit-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItemClick(product);
                    }}
                  />
                  <FiTrash2
                    className="table-delete-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(key);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductTable;
