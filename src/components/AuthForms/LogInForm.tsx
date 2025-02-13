import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const LogInForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setCustomer } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        {
          email,
          password,
        }
      );

      console.log("Response from server:", response.data); // Debugging line

      const { token, customer, source } = response.data;

      if (!token) {
        throw new Error("No token received from server.");
      }

      localStorage.setItem("token", token);
      setCustomer(customer);
      console.log("Customer set in context:", customer, source);

      alert("Login successful!");

      if (source === "sellers") {
        navigate("/seller-dashboard");
      } else {
        navigate("/buyer-dashboard");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to login. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Login</legend>

        <label className="fieldset-label">Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="input"
          placeholder="Email"
        />

        <label className="fieldset-label">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="input"
          placeholder="Password"
        />

        <button className="btn btn-neutral mt-4">Login</button>
      </fieldset>
    </form>
  );
};

export default LogInForm;
