import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { Loader } from "../Loader";

const SellerSignUp = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    password: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [loading, setLoading] = useState(false);

  const { setCustomer } = useContext(AuthContext);
  const navigate = useNavigate();

  const geocodeAddress = async (
    street: string,
    city: string,
    state: string
  ) => {
    try {
      const address = `${street}, ${city}, ${state}`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await response.json();

      console.log(data);

      if (!data || data.length === 0) {
        throw new Error("Address not found");
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First, geocode the address
      const { latitude, longitude } = await geocodeAddress(
        formData.address,
        formData.city,
        formData.state
      );

      // Prepare the complete signup data including coordinates
      const signupData = {
        ...formData,
        latitude,
        longitude,
      };
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sellers/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupData),
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const { token, customer } = await response.json();

      if (!token) {
        throw new Error("No token received from server.");
      }

      localStorage.setItem("token", token);
      setCustomer(customer);

      alert("Buyer signup successful!");
      navigate("/seller-dashboard");

      setFormData({
        companyName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        password: "",
        latitude: null,
        longitude: null,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error signing up seller:", error);
      alert("Failed to sign up seller. Please try again.");
    }
  };
  return (
    <div className="flex justify-center items-center bg-PBG-100 pt-[2%]">
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset grid-cols-1 w-xl bg-PBG-100 border border-base-300 p-4 rounded-box shadow-PS text-PT-100 text-lg">
            <legend className="fieldset-legend text-3xl text-PT-100 font-extrabold bg-PBG-100">
              Seller Details
            </legend>

            <label className="fieldset-label">Company Name</label>
            <input
              required
              name="companyName"
              type="text"
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />

            <label className="fieldset-label">Email</label>
            <input
              required
              name="email"
              type="email "
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="email@email.com"
              value={formData.email}
              onChange={handleChange}
            />

            <label className="fieldset-label">Phone</label>
            <input
              required
              name="phone"
              type="text"
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="999-999-9999"
              value={formData.phone}
              onChange={handleChange}
            />

            <label className="fieldset-label">Address</label>
            <input
              required
              name="address"
              type="text"
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="1234 Main St"
              value={formData.address}
              onChange={handleChange}
            />

            <label className="fieldset-label">City</label>
            <input
              required
              name="city"
              type="text"
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="New York"
              value={formData.city}
              onChange={handleChange}
            />

            <label className="fieldset-label">State</label>
            <input
              required
              type="text"
              name="state"
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="New York"
              value={formData.state}
              onChange={handleChange}
            />
            <label className="fieldset-label">Password</label>
            <input
              required
              type="password"
              name="password"
              className="input w-full bg-PBG-100 focus:border-none focus:outline-none focus:shadow-PS"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              disabled={loading}
              className="bg-DBG-100 text-ST-100 p-2 rounded-lg cursor-pointer hover:bg-SBG-100 hover:text-PT-100 hover:shadow-PS mt-4"
            >
              Sign Up
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
};

export default SellerSignUp;
