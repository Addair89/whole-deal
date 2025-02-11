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
import { useContext } from "react";

function App() {
  const { customer } = useContext(AuthContext);
  return (
    <main>
      <Router>
        {customer === null && <NavBar />}
        <Routes>
          <Route path="/welcome" element={<WelcomeHero />} />
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
