//-EXTERNAL IMPORTS--
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//--INTERNAL IMPORTS--
import NavBar from "../components/NavBar";
import AddItem from "../components/AddItem";
import EditItem from "../components/EditItem";
import fetchUser from "../utils/fetchUser";
import Loader from "../components/Loader";
import ProductCards from "../components/ProductCards";
import Footer from "../components/Footer";
import ProductTable from "../components/ProductTable";
import AddItemDocument from "../components/AddItemDocument";

import "../stylesheets/Home.css";

function Home({ defaultImages }) {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [products, setProducts] = useState([]);
  const [isDetailsShown, setDetailsShown] = useState({});
  const [sortField, setSortField] = useState("");
  const [update, setUpdate] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showAddItemDocument, setAddItemDocument] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productCardView, setProductCardView] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [sortOrder, setSortOrder] = useState("asc");

  //--STORE USER ID FROM LOCAL STORAGE--
  const navigate = useNavigate();
  const userFetcher = fetchUser();
  useEffect(() => {
    userFetcher(navigate);
  }, [navigate, userFetcher]);
  const userFetcherValues = Object.values(userFetcher).join();

  const [userData, setUserData] = useState(userFetcher());
  //--UPDATE USER DATA --
  useEffect(() => {
    const handleWindowResize = () => setViewportWidth(window.innerWidth);

    window.addEventListener("resize", handleWindowResize);

    // Cleanup function:
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/products?sortBy=${sortField}&search=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          let products = await response.json();
          let userProducts = products.filter(
            (product) =>
              userData._id === product.userKey &&
              product.name.toLowerCase().includes(search.toLowerCase())
          );

          if (userProducts.length > 0) {
            // Here we apply the sort according to the sortField and sortOrder
            userProducts.sort((a, b) => {
              if (sortField) {
                if (sortOrder === "asc") {
                  return a[sortField] > b[sortField] ? 1 : -1;
                } else if (sortOrder === "desc") {
                  return a[sortField] < b[sortField] ? 1 : -1;
                }
              }
              return 0;
            });
            setProducts(userProducts);
          }
          setIsLoading(false);
        } else {
          throw new Error("No products found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userFetcherValues, update, search, sortField, sortOrder, userData._id]);

  const handleSortFieldChange = (field) => {
    setSortField(field);
  };

  //--ADD PRODUCT MODAL ONCLICK HANDLE--
  const handleAddItemClick = () => {
    setShowAddItem(true);
  };
  const handleAddItemDocumentClick = () => {
    setAddItemDocument(true);
  };

  //--EDIT PRODUCT HANDLE ITEM CLICK--
  const handleEditItemClick = (product) => {
    setShowEditItem(true);
    setEditProduct(product);
  };

  //--CLOSE MODAL CONTROL ON CLICK--
  const handleCloseModal = () => {
    setShowAddItem(false);
    setAddItemDocument(false);
    setShowEditItem(false);
    setEditProduct(null);
  };

  //--UPDATE PRODUCT STATE CONTROL ON NEW PRODUCT--
  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  //--UPDATE PRODUCT STATE ON PRODUCT EDIT--
  const updateProduct = async (updatedProduct) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/products", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: updatedProduct.userKey,
          product: updatedProduct,
        }),
      });

      if (response.ok) {
        const productUpdate = await response.json();
        // Find the index of the product to be updated
        const productIndex = products.findIndex(
          (p) => p._id === updatedProduct._id
        );
        // Clone the existing products array
        const updatedProducts = [...products];
        // Replace the existing product with the updated product
        if (productIndex !== -1) {
          updatedProducts[productIndex] = productUpdate;
        }
        // Update the products state
        setProducts(updatedProducts);
        // Update the updateProduct state
        setUpdate(productUpdate);
        setIsLoading(false);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  //--DELETE PRODUCT --
  const handleRemove = async (key) => {
    try {
      const response = await fetch("http://localhost:4000/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
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

  useEffect(() => {
    const fetchUserDataFromBackend = async () => {
      // Retrieve the user ID from local storage
      const userInfo = JSON.parse(localStorage.getItem("userData"));
      if (!userInfo) {
        throw new Error("No user ID found in local storage");
      }

      // Send a GET request to the backend server to retrieve the user data
      const response = await fetch(
        `http://localhost:4000/users/${userInfo._id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data from backend");
      }

      // Parse the response data as JSON
      const userData = await response.json();

      return userData;
    };
    const fetchData = async () => {
      // Fetch user data from the backend and update userData state
      const fetchedUserData = await fetchUserDataFromBackend();
      setUserData(fetchedUserData);
    };

    fetchData();
  }, [update]); // this depends on what triggers a user data update on your backend

  useEffect(() => {
    if (userData) {
      let newBackgroundImage;
      if (userData.backgroundImage.includes("uploads/")) {
        newBackgroundImage = `url(http://localhost:4000/${userData.backgroundImage}`;
      } else {
        newBackgroundImage = `url(http://localhost:3000${userData.backgroundImage}`;
      }
      setBackgroundImage(newBackgroundImage);
    }
  }, [setBackgroundImage, userData]);

  return (
    <div
      className="home-container"
      style={{
        backgroundImage: backgroundImage,
      }}
    >
      <NavBar
        name={userData.name}
        profileImage={userData.profileImage}
        id={userData._id}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSortChange={(e) => handleSortFieldChange(e.target.value)}
        onClose={handleCloseModal}
        setProductCardView={setProductCardView}
        productCardView={productCardView}
        sortField={sortField}
        products={products}
      />
      {isLoading && <Loader />}
      {products.length === 0 && (
        <h2 className="no-products-to-display">Add product(s)</h2>
      )}
      {!productCardView || viewportWidth <= 936 ? (
        <ProductCards
          products={products}
          handleEditItemClick={handleEditItemClick}
          handleRemove={handleRemove}
          isDetailsShown={isDetailsShown}
          setDetailsShown={setDetailsShown}
        />
      ) : (
        <ProductTable
          products={products}
          setProducts={setProducts}
          handleEditItemClick={handleEditItemClick}
          handleRemove={handleRemove}
          onSortChange={(e) => handleSortFieldChange(e.target.value)}
          sortField={sortField}
          setSortOrder={setSortOrder}
          sortOrder={sortOrder}
        />
      )}
      <Footer
        handleAddItemClick={handleAddItemClick}
        handleAddItemDocumentClick={handleAddItemDocumentClick}
        isDetailsShown={isDetailsShown}
        setDetailsShown={setDetailsShown}
      />
      {showAddItem && (
        <AddItem
          onClose={handleCloseModal}
          addProduct={addProduct}
          userKey={userData._id}
          setDetailsShown={setDetailsShown}
        />
      )}
      {showEditItem && (
        <EditItem
          onClose={handleCloseModal}
          product={editProduct}
          updateProduct={updateProduct}
          userKey={userData._id}
        />
      )}
      {showAddItemDocument && (
        <AddItemDocument
          onClose={handleCloseModal}
          addProduct={addProduct}
          userKey={userData._id}
          setDetailsShown={setDetailsShown}
          setUpdate={setUpdate}
        />
      )}
    </div>
  );
}

export default Home;
