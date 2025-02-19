import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <section className="flex items-center justify-center">
      <div className="hero bg-PBG-100 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-8xl font-bold">
              Connect, Sell, Buy - Simplified
            </h1>
            <p className="py-6 text-3xl">
              Transform your business with the power of technology. Connect with
              buyers and sellers on our innovative platform.
            </p>
            <div className="flex justify-evenly">
              <button
                onClick={() => navigate("/seller-sign-up")}
                className=" btn-xl bg-SBG-100 text-PT-100 p-4 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-ST-100 hover:shadow-PS mt-4"
              >
                Sign Up as Seller
              </button>
              <button
                onClick={() => navigate("/buyer-sign-up")}
                className="btn-xl bg-SBG-100 text-PT-100 p-4 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-ST-100 hover:shadow-PS mt-4"
              >
                Sign Up as Buyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
