import React, { useEffect } from "react";
import { AiFillEdit, AiOutlineSortAscending } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { GoTriangleRight } from "react-icons/go";
import "../stylesheets/ProductTable.css";
function ProductTable({
  products,
  handleEditItemClick,
  handleRemove,
  isDetailsShown,
  setDetailsShown,
  onSortChange,
  sortField,
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

  const handleHeaderClick = (value) => {
    onSortChange({ target: { value } }); // This simulates an event object.
  };
  return (
    <div className="table-placement">
      <div className="table-header">
        <h3
          onClick={() => handleHeaderClick("name")}
          className={sortField === "name" ? "selected" : ""}
        >
          Name{" "}
          {sortField === "name" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("productPrice")}
          className={sortField === "productPrice" ? "selected" : ""}
        >
          Price{" "}
          {sortField === "productPrice" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("cityTax")}
          className={sortField === "cityTax" ? "selected" : ""}
        >
          City Tax{" "}
          {sortField === "cityTax" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("stateTax")}
          className={sortField === "stateTax" ? "selected" : ""}
        >
          State Tax{" "}
          {sortField === "stateTax" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("salesTax")}
          className={sortField === "salesTax" ? "selected" : ""}
        >
          Total Tax{" "}
          {sortField === "salesTax" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("totalPrice")}
          className={sortField === "totalPrice" ? "selected" : ""}
        >
          Total Price{" "}
          {sortField === "totalPrice" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("state")}
          className={sortField === "state" ? "selected" : ""}
        >
          State{" "}
          {sortField === "state" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("zip")}
          className={sortField === "zip" ? "selected" : ""}
        >
          Zip Code{" "}
          {sortField === "zip" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
        </h3>
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
            const cityTaxPercent = (cityTax * 100).toFixed(2);
            const stateTaxPercent = (stateTax * 100).toFixed(2);
            const totalTaxPercent = (salesTax * 100).toFixed(2);

            return (
              <div
                className={`table-each-product ${
                  isDetailsShown[key] ? "table-each-product-details-shown" : ""
                }`}
                key={key}
                onClick={() =>
                  setDetailsShown({
                    ...isDetailsShown,
                    [key]: !isDetailsShown[key],
                  })
                }
              >
                <div className="table-name">
                  <GoTriangleRight
                    className={`table-toggle-details ${
                      isDetailsShown[key] ? "rotated" : ""
                    }`}
                  />
                  {isDetailsShown[key] && <br />}
                  <b>{name}</b>
                </div>
                <div className="table-value">${productPrice}</div>
                <div className="table-value">{cityTaxPercent}%</div>
                <div className="table-value">{stateTaxPercent}%</div>
                <div className="table-value">{totalTaxPercent}%</div>
                <div className="table-value">${totalPrice.toFixed(2)}</div>
                <div className="table-value">{state}</div>
                <div className="table-value">{zip}</div>
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
