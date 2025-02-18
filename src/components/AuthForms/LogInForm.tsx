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
    <form
      className="flex justify-center items-center bg-PBG-100 pt-[10%]"
      onSubmit={handleSubmit}
    >
      <fieldset className="fieldset grid-cols-1 w-xl bg-PBG-100 border border-base-300 p-4 rounded-box shadow-PS text-PT-100 text-lg">
        <legend className="fieldset-legend text-3xl text-PT-100 font-extrabold bg-PBG-100">
          Login
        </legend>

        <label className="fieldset-label">Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
          placeholder="Email"
        />

        <label className="fieldset-label">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
          placeholder="Password"
        />

        <button className="bg-DBG-100 text-ST-100 p-2 rounded-lg cursor-pointer hover:bg-SBG-100 hover:text-PT-100 hover:shadow-PS mt-4">
          Login
        </button>
      </fieldset>
    </form>
  );
};

export default LogInForm;
