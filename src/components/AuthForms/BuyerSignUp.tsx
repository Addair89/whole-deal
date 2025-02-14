import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setCustomer } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

      // Send signup request
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/buyers/signup`,
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
      navigate("/buyer-dashboard");

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
    } catch (error) {
      console.error("Error signing up buyer:", error);
      alert(
        "Failed to sign up buyer. Please check your address and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset grid-cols-1 w-lg bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend text-2xl">Buyer Details</legend>

          {/* Existing form fields remain the same */}
          <label className="fieldset-label">Company Name</label>
          <input
            required
            name="companyName"
            type="text"
            className="input w-full"
            placeholder="Restaurant Name"
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

          <button className="btn btn-neutral mt-4" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default BuyerSignUp;
