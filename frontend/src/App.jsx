import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./stylesheets/App.css";
import Home from "./containers/Home";
import LoginForm from "./containers/LoginForm";
import RegisterUser from "./containers/RegisterUser";
import Settings from "./containers/Settings";

function App() {
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

  return (
    <div>
      <Routes>
        <Route path="/*" element={<LoginForm />} />
        <Route path="/user-registration" element={<RegisterUser />} />
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
