import React, { useState } from "react";
import { AiOutlineFolderAdd } from "react-icons/ai";

import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import { fetchUser } from "../utils/fetchUser";
import { userProducts } from "../utils/products";

function Home() {
  const [showAddItem, setShowAddItem] = useState(false);
  // const [user, setUser] = useState(null);
  const userInfo = fetchUser();

  const handleAddItemClick = () => {
    setShowAddItem(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowAddItem(false); // Close the modal
  };

  const addProduct = (product) => {
    userProducts.push(product);
  };

  return (
    <div>
      <NavBar name={userInfo.name} />
      <div className="product-list">
        {userProducts.map((product) => {
          const { name, productPrice, state, zip } = product;
          return (
            <div key={product.key}>
              <h1>{name}</h1>
              <p>Product Price: ${productPrice}</p>
              <p>Sales Tax: ${product.salesTax()}</p>
              <p>Total Cost: ${product.totalPrice()}</p>
              <p>State: {state}</p>
              <p>Zip Code: {zip}</p>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        className="add-item-btn"
        onClick={handleAddItemClick}
      >
        <AiOutlineFolderAdd /> Add Item
      </button>
      {showAddItem && (
        <AddItem onClose={handleCloseModal} addProduct={addProduct} />
      )}
    </div>
  );
}

export default Home;
