import React, { useState } from "react";
import { AiOutlineFolderAdd, AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";

import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem"; // Import the EditItem component
import { fetchUser } from "../utils/fetchUser";
import { userProducts } from "../utils/products";

function Home() {
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [products, setProducts] = useState(userProducts);
  const [editProduct, setEditProduct] = useState(null); // Track the product being edited
  const userInfo = fetchUser();

  const handleAddItemClick = () => {
    setShowAddItem(true);
  };

  const handleEditItemClick = (product) => {
    setShowEditItem(true);
    setEditProduct(product); // Set the product being edited
  };

  const handleCloseModal = () => {
    setShowAddItem(false);
    setShowEditItem(false);
    setEditProduct(null); // Clear the edit product
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleRemove = (key) => {
    setProducts(products.filter((product) => product.key !== key));
  };

  return (
    <div className="home-container">
      <NavBar name={userInfo.name} />
      <div className="product-list">
        {products.map((product) => {
          const { key, name, productPrice, state, zip } = product;
          return (
            <div key={key} className="product-info">
              <h3>{name} | </h3>
              <p>Product Price: ${productPrice} | </p>
              <p>Sales Tax: ${product.salesTax()} | </p>
              <p>Total Cost: ${product.totalPrice()} | </p>
              <p>State: {state} | </p>
              <p>Zip Code: {zip}</p>
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
          );
        })}
      </div>
      <div className="add-item-placement">
        <button
          type="button"
          className="add-item-btn"
          onClick={handleAddItemClick}
        >
          <AiOutlineFolderAdd className="add-item-icon" />
        </button>
      </div>
      {showAddItem && (
        <AddItem onClose={handleCloseModal} addProduct={addProduct} />
      )}
      {showEditItem && (
        <EditItem
          onClose={handleCloseModal}
          addProduct={addProduct}
          product={editProduct} // Pass the editProduct as prop
        />
      )}
    </div>
  );
}

export default Home;
