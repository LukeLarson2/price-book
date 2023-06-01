import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import Home from "./containers/Home";
import LoginForm from "./containers/LoginForm";
import RegisterUser from "./containers/RegisterUser";

function App() {
  const [userData, setUserData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const User =
      localStorage.getItem("userData") !== "undefined"
        ? JSON.parse(localStorage.getItem("userData"))
        : localStorage.clear();
    if (!User && window.location.pathname !== "/user-registration") {
      navigate("/login");
    }
  }, [navigate]);

  // useEffect(() => {
  //   const query = async () => {
  //     const response = await fetchUser();
  //     const data = await response;
  //     setUserData(data);
  //     // setUserData((prevData) => {
  //     //   return { ...prevData, data };
  //     // });
  //   };
  //   query();
  //   // userInfo.then((res) => res.json()).then((data) => console.log(data));
  // }, []);
  return (
    <div>
      <Routes>
        <Route path="/*" element={<LoginForm />} />
        <Route path="/user-registration" element={<RegisterUser />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
