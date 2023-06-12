import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./stylesheets/App.css";
import Home from "./containers/Home";
import LoginForm from "./containers/LoginForm";
import RegisterUser from "./containers/RegisterUser";
import Settings from "./containers/Settings";
import ForgotPassword from "./components/ForgotPassword";
import ForgotPasswordRequest from "./components/ForgotPasswordRequest";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const allowedRoutes = [
      "/user-registration",
      "/forgot-password-request",
      "/forgot-password/",
    ];
    const user =
      JSON.parse(localStorage.getItem("userData")) || localStorage.clear();

    if (!user && !allowedRoutes.includes(window.location.pathname)) {
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/forgot-password-request"
          element={<ForgotPasswordRequest />}
        />
      </Routes>
    </div>
  );
}

export default App;
