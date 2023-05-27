import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import AddItem from "./containers/AddItem";
import Home from "./containers/Home";
import LoginForm from "./containers/LoginForm";
import RegisterUser from "./containers/RegisterUser";

function App() {
  return (
    <div>
      <Routes>
        <Route path="login" element={<LoginForm />} />
        <Route path="user-registration" element={<RegisterUser />} />
        <Route path="add-product" element={<AddItem />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
