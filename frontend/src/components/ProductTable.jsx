import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  AiFillEdit,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";

import "../stylesheets/ProductTable.css";
import ProductDetailModal from "./ProductDetailModal";
function ProductTable({
  products,
  handleEditItemClick,
  handleRemove,
  onSortChange,
  sortField,
  sortOrder,
  setSortOrder,
}) {
  const [deleteKey, setDeleteKey] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(
    Math.floor(window.innerHeight / 70)
  );
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(Math.floor(window.innerHeight / 70));
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openProductDetailModal = (product) => {
    setSelectedProduct(product);
  };
  const closeProductDetailModal = () => {
    setSelectedProduct(null);
  };
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

  const handleHeaderClick = (value) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Update the sortOrder when the header is clicked
    onSortChange({ target: { value } }, sortOrder); // Pass sortOrder to the parent component
  };
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * itemsPerPage;

  const currentPageData = products
    .slice(offset, offset + itemsPerPage)
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
          className="table-each-product"
          key={key}
          onClick={() => openProductDetailModal(product)}
        >
          <div className="table-name">
            {/* <GoTriangleRight className="table-toggle-details" /> */}
            <b>{name}</b>
          </div>
          <div className="table-value">${productPrice}</div>
          <div className="table-value">{cityTaxPercent}%</div>
          <div className="table-value">{stateTaxPercent}%</div>
          <div className="table-value">{combinedTaxPercent}%</div>
          <div className="table-value">${totalTax.toFixed(2)}</div>
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
                setDeleteKey({ key: key, name: name });
                openModal();
              }}
            />
          </div>
        </div>
      );
    });

  const pageCount = Math.ceil(products.length / itemsPerPage);
  return (
    <div className="table-placement">
      <div className="table-header">
        <h3
          onClick={() => handleHeaderClick("name")}
          className={sortField === "name" ? "selected" : ""}
        >
          Name
          {sortField === "name" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "name" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("productPrice")}
          className={sortField === "productPrice" ? "selected" : ""}
        >
          Price
          {sortField === "productPrice" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "productPrice" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("cityTax")}
          className={sortField === "cityTax" ? "selected" : ""}
        >
          City Tax
          {sortField === "cityTax" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "cityTax" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("stateTax")}
          className={sortField === "stateTax" ? "selected" : ""}
        >
          State Tax
          {sortField === "stateTax" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "stateTax" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("combinedTax")}
          className={sortField === "combinedTax" ? "selected" : ""}
        >
          Combined Tax
          {sortField === "combinedTax" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "combinedTax" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("totalTax")}
          className={sortField === "totalTax" ? "selected" : ""}
        >
          Total Tax
          {sortField === "totalTax" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "totalTax" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("totalPrice")}
          className={sortField === "totalPrice" ? "selected" : ""}
        >
          Total Price
          {sortField === "totalPrice" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "totalPrice" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("state")}
          className={sortField === "state" ? "selected" : ""}
        >
          State
          {sortField === "state" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "state" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3
          onClick={() => handleHeaderClick("zip")}
          className={sortField === "zip" ? "selected" : ""}
        >
          Zip
          {sortField === "zip" && sortOrder === "asc" && (
            <AiOutlineSortAscending className="table-sort-by-icon" />
          )}
          {sortField === "zip" && sortOrder === "desc" && (
            <AiOutlineSortDescending className="table-sort-by-icon" />
          )}
        </h3>
        <h3 className="edit-delete-header">Edit/Delete</h3>
      </div>
      <div className="table-product-container">
        <div className="scrolling-content">
          <div className="table-placement">
            {currentPageData}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link-next"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </div>
          {showModal && (
            <div className="delete-modal-overlay">
              <div className="delete-modal">
                <div className="delete-modal-content">
                  <h2 className="delete-modal-title">Delete Confirmation</h2>
                  <p className="delete-modal-text">
                    {`Are you sure you want to delete the "${deleteKey.name}" item?`}
                  </p>
                  <div className="delete-modal-btn-placement">
                    <button
                      className="confirm-delete-btn"
                      onClick={confirmRemove}
                    >
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
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              onClose={closeProductDetailModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductTable;
