import React, { useState } from "react";
import { AiOutlineFolderAdd, AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";

import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem";
import { fetchUser } from "../utils/fetchUser";
import { userProducts as initialUserProducts } from "../utils/products";

function Home() {
  const [userProducts, setUserProducts] = useState(initialUserProducts);
  const [products, setProducts] = useState(userProducts);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const userInfo = fetchUser();

  const handleAddItemClick = () => {
    setShowAddItem(true);
  };

  const handleEditItemClick = (product) => {
    setShowEditItem(true);
    setEditProduct(product);
  };

  const handleCloseModal = () => {
    setShowAddItem(false);
    setShowEditItem(false);
    setEditProduct(null);
  };

  const addProduct = (product) => {
    setProducts([...products, product]);
    setUserProducts([...userProducts, product]);
  };

  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((p) =>
      p.key === updatedProduct.key ? updatedProduct : p
    );
    setProducts(updatedProducts);
  };

  const updateUserProducts = (updatedProduct) => {
    const updatedUserProducts = userProducts.map((p) =>
      p.key === updatedProduct.key ? updatedProduct : p
    );
    setUserProducts(updatedUserProducts);
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
              <h2>{name}</h2>
              <div className="product-details">
                <p>
                  Product Price: <b>${productPrice}</b>{" "}
                </p>
                <p>
                  Sales Tax: <b>${product.salesTax().toFixed(2)}</b>{" "}
                </p>
                <p>
                  Total Cost: <b>${product.totalPrice().toFixed(2)}</b>{" "}
                </p>
                <p>
                  State: <b>{state}</b>{" "}
                </p>
                <p>
                  Zip Code: <b>{zip}</b>
                </p>
              </div>
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
          Add Item <AiOutlineFolderAdd className="add-item-icon" />
        </button>
      </div>
      {showAddItem && (
        <AddItem
          onClose={handleCloseModal}
          addProduct={addProduct}
          updateUserProducts={setUserProducts}
        />
      )}
      {showEditItem && (
        <EditItem
          onClose={handleCloseModal}
          product={editProduct}
          updateProduct={updateProduct}
          updateUserProducts={updateUserProducts}
        />
      )}
    </div>
  );
}

export default Home;
