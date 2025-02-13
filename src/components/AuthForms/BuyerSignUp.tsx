import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const BuyerSignUp = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { setCustomer } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(import.meta.env.VITE_API_BASE_URL);
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/buyers/signup`,
        formData
      );

      console.log("Response from server:", response.data); // Debugging line

      const { token, customer } = response.data;

      if (!token) {
        throw new Error("No token received from server.");
      }

      localStorage.setItem("token", token);
      setCustomer(customer);
      console.log("Customer set in context:", customer);

      alert("Buyer signup successful!");
      navigate("/buyer-dashboard");

      setFormData({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        password: "",
      });
    } catch (error) {
      console.error("Error signing up buyer:", error);
      alert("Failed to sign up seller. Please try again.");
    }
  };
  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset grid-cols-1 w-lg bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend text-2xl">Buyer Details</legend>

          <label className="fieldset-label">Company Name</label>
          <input
            required
            name="companyName"
            type="text"
            className="input w-full"
            placeholder="Restatuant Name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <label className="fieldset-label">Email</label>
          <input
            required
            name="email"
            type="email "
            className="input w-full"
            placeholder="email@email.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="fieldset-label">Phone</label>
          <input
            required
            name="phone"
            type="text"
            className="input w-full"
            placeholder="999-999-9999"
            value={formData.phone}
            onChange={handleChange}
          />

          <label className="fieldset-label">Address</label>
          <input
            required
            name="address"
            type="text"
            className="input w-full"
            placeholder="1234 Main St"
            value={formData.address}
            onChange={handleChange}
          />

          <label className="fieldset-label">City</label>
          <input
            required
            name="city"
            type="text"
            className="input w-full"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
          />

          <label className="fieldset-label">State</label>
          <input
            required
            type="text"
            name="state"
            className="input w-full"
            placeholder="New York"
            value={formData.state}
            onChange={handleChange}
          />
          <label className="fieldset-label">Password</label>
          <input
            required
            type="password"
            name="password"
            className="input w-full"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button className="btn btn-neutral mt-4">Sign Up</button>
        </fieldset>
      </form>
    </div>
  );
};

export default BuyerSignUp;
