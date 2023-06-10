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

function Home() {
  const [products, setProducts] = useState([]);
  const [isDetailsShown, setDetailsShown] = useState({});
  const [sortField, setSortField] = useState("");
  const [update, setUpdate] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [productCardView, setProductCardView] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  //--STORE USER ID FROM LOCAL STORAGE--
  const navigate = useNavigate();
  const userFetcher = fetchUser();
  useEffect(() => {
    userFetcher(navigate);
  }, []);
  const userFetcherValues = Object.values(userFetcher).join();
  const userData = userFetcher();
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
          `http://localhost:4000/products?sortBy=${sortField}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const products = await response.json();
          const userProducts = products.filter(
            (product) =>
              userData._id === product.userKey &&
              product.name.toLowerCase().includes(search.toLowerCase())
          );
          if (userProducts.length > 0) {
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
  }, [userFetcherValues, update, search, sortField, userData._id]);

  const handleSortFieldChange = (field) => {
    setSortField(field);
  };

  //--ADD PRODUCT MODAL ONCLICK HANDLE--
  const handleAddItemClick = () => {
    setShowAddItem(true);
  };

  //--EDIT PRODUCT HANDLE ITEM CLICK--
  const handleEditItemClick = (product) => {
    setShowEditItem(true);
    setEditProduct(product);
  };

  //--CLOSE MODAL CONTROL ON CLICK--
  const handleCloseModal = () => {
    setShowAddItem(false);
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

  //--UPDATE RENDERED PRODUCTS EFFECT--
  useEffect(() => {
    setProducts(products);
  }, [products]);

  return (
    <div className="home-container">
      <NavBar
        name={userData.name}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSortChange={(e) => handleSortFieldChange(e.target.value)}
        onClose={handleCloseModal}
        setProductCardView={setProductCardView}
        productCardView={productCardView}
      />
      {isLoading && <Loader />}
      {productCardView || viewportWidth <= 936 ? (
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
          handleEditItemClick={handleEditItemClick}
          handleRemove={handleRemove}
          isDetailsShown={isDetailsShown}
          setDetailsShown={setDetailsShown}
        />
      )}
      <Footer
        handleAddItemClick={handleAddItemClick}
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
    </div>
  );
}

export default Home;
