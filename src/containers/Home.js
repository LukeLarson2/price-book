import React, { useState, useEffect } from "react";
import { AiOutlineFolderAdd, AiFillEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { useMediaQuery } from "react-responsive";
import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem";
import { fetchUser } from "../utils/fetchUser";
import { TailSpin } from "react-loader-spinner";

function Home() {
  const [user, setUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userId = fetchUser();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const usersData = await response.json();
          const currentUser = usersData.find((user) => user._id === userId);
          if (currentUser) {
            setUser(currentUser);
            setProducts(currentUser.products);
          }
          setIsLoading(false);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
  };

  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((p) =>
      p.key === updatedProduct.key ? updatedProduct : p
    );
    setProducts(updatedProducts);
  };

  // const handleRemove = (key) => {
  //   setProducts(products.filter((product) => product.key !== key));
  // };
  const handleRemove = async (key) => {
    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          productId: key,
        }),
      });
      if (response.ok) {
        setProducts(products.filter((product) => product.key !== key));
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const isSmallViewport = useMediaQuery({ maxWidth: 600 });

  useEffect(() => {
    setProducts(products); // Update the products whenever userProducts change
  }, [products]);

  return (
    <div className="home-container">
      <NavBar name={user.name} />
      {isLoading ? (
        <div className="loader-spinner-container">
          <TailSpin
            height="80"
            width="80"
            color="rgb(206, 105, 10)"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <div className="product-list">
          {products.map((product) => {
            const salesTax = product.salesTax;
            const totalPrice = product.totalPrice;
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
                    Sales Tax: <b>{salesTax.toFixed(3)}%</b>{" "}
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
      )}
      <div className="add-item-placement">
        {isSmallViewport ? (
          <button
            type="button"
            className="add-item-btn-small"
            onClick={handleAddItemClick}
          >
            <AiOutlineFolderAdd className="add-item-icon-small" />
          </button>
        ) : (
          <button
            type="button"
            className="add-item-btn"
            onClick={handleAddItemClick}
          >
            Add Item <AiOutlineFolderAdd className="add-item-icon" />
          </button>
        )}
      </div>
      {showAddItem && (
        <AddItem
          onClose={handleCloseModal}
          addProduct={addProduct}
          // updateProducts={setProducts}
        />
      )}
      {showEditItem && (
        <EditItem
          onClose={handleCloseModal}
          product={editProduct}
          updateProduct={updateProduct}
        />
      )}
    </div>
  );
}

export default Home;
