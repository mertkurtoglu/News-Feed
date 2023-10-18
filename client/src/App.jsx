import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Feed from "./pages/Feed";
import Account from "./pages/Account";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/register" || location.pathname === "/account") {
      axios
        .get(`http://localhost:8080${location.pathname}`, { withCredentials: true })
        .then((response) => {
          if (response.data.checkAuth === true) {
            navigate("/feed");
          } else if (location.pathname === "/account" && response.data.checkAuth === false) {
            navigate("/");
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            console.error("Error fetching data:", error.response.data);
          }
        });
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
