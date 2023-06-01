import React, { useState } from "react";
import { AiOutlineFolderAdd, AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";

import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem";
import { userProducts as initialUserProducts } from "../utils/products";

function Home({ userData }) {
  const [userProducts, setUserProducts] = useState(initialUserProducts);
  const [products, setProducts] = useState(userProducts);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const currentUser = userData.userData[0];

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

  const userTestData = [
    {
      _id: {
        $oid: "64779e61db541890fcb824be",
      },
      name: "Lucas",
      email: "lucas.m.larson2@gmail.com",
      password: "123456",
      accountType: "Personal",
      products: [
        {
          name: "Headphones",
          state: "WA",
          zip: "98513",
          productPrice: 10,
          date: "",
        },
        {
          name: "Speaker",
          state: "WA",
          zip: "98513",
          productPrice: 30,
          date: "",
        },
      ],
    },
  ];

  return (
    <div className="home-container">
      <NavBar name={currentUser.name} />
      <div className="product-list">
        {currentUser.products.map((product) => {
          const salesTax = 0.05;

          const totalPrice =
            product.productPrice * salesTax + product.productPrice;

          const { key, name, productPrice, state, zip } = product;
          return (
            <div key={key} className="product-info">
              <div className="product-header">
                <h2 className="product-title">{name}</h2>
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
              <div className="product-details">
                <p>
                  Product Price: <b>${productPrice}</b>{" "}
                </p>
                <p>
                  Sales Tax: <b>{salesTax.toFixed(2)}%</b>{" "}
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
