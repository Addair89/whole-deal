import "./App.css";
import BuyerSignUp from "./components/AuthForms/BuyerSignUp";
import SellerSignUp from "./components/AuthForms/SellerSignUp";
import NavBar from "./components/NavBar";
import WelcomeHero from "./components/WelcomeHero";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogInForm from "./components/AuthForms/LogInForm";
import { BuyerDashboard } from "./components/Dashboard/Buyer/BuyerDashboard";
import { BuyerAllOrders } from "./components/Dashboard/Buyer/Orders/BuyerAllOrders";
import { SellerDashboard } from "./components/Dashboard/Seller/SellerDashboard";
import { SellerAllOrders } from "./components/Dashboard/Seller/Orders/SellerAllOrders";
import { Products } from "./components/Dashboard/Seller/Products/Products";
import { AuthContext } from "./AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

function App() {
  const { customer } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getDashboard = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/dashboard`,
          {
            email,
          }
        );
        console.log("Response from server:", response.data); // Debugging line
      } catch (error) {
        console.error("Error setting email:", error);
      }
    };
    if (customer) {
      setEmail(customer.email);
      getDashboard();
    }
  }, [customer]);

  return (
    <main className="font-mulish h-dvh">
      <Router>
        {customer === null && <NavBar />}
        <Routes>
          <Route path="/" element={<WelcomeHero />} />
          <Route path="/login" element={<LogInForm />} />
          <Route path="/buyer-sign-up" element={<BuyerSignUp />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="buyer-all-orders" element={<BuyerAllOrders />} />
          <Route path="/seller-sign-up" element={<SellerSignUp />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/seller-all-orders" element={<SellerAllOrders />} />
          <Route path="/seller-products" element={<Products />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
