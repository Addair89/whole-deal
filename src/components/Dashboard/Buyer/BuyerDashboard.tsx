import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../AuthContext";
import BuyerSideBar from "./BuyerSideBar";
import { Loader } from "../../Loader";
import { useNavigate } from "react-router-dom";

export const BuyerDashboard = () => {
  const { customer } = useContext(AuthContext);
  if (!customer) {
    return <div>No customer data available</div>;
  }

  const navigate = useNavigate();

  interface Order {
    id: number;
    seller_name: string;
    total_price: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer?.id) return; // Ensure customer.id exists before making the request
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/buyers/all-orders/${
            customer.id
          }`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        setOrders(data.orders || []);
        console.log("Buyer All Orders Dashboard Fetched orders:", orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Ensures loading state updates even on error
      }
    };

    fetchOrders();
  }, []); // Re-run effect if customer.id changes

  return (
    <section className="flex min-h-screen bg-[#f0f4f8]">
      <BuyerSideBar />
      <div className="flex-1 p-6 ml-[15%]">
        <h1 className=" text-6xl m-10 text-[#474747]">
          {customer.company_name.toUpperCase()}
        </h1>
        <h3 className=" text-4xl  text-[#474747]">
          Here's whats going on today.
        </h3>
        <hr className="border border-[#474747] my-10"></hr>
        {/* Next-Day Orders Section */}
        <div className="bg-PBG-100 text-[#474747] p-4 rounded-[4px] shadow-[-2px_0px_10px_5px_rgba(0,_0,_0,_0.5)]">
          {loading ? (
            <Loader />
          ) : (
            <>
              <h3 className="text-lg font-bold mb-4">📦 Next-Day Orders</h3>
              {orders.length > 0 ? (
                <ul>
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="p-2 border-b flex justify-between"
                    >
                      <span>
                        Order #{order.id} From {order.seller_name}
                      </span>
                      <span className="font-bold text-green-600">
                        ${order.total_price}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No next-day orders.</p>
              )}
            </>
          )}

          <button
            onClick={() => navigate("/buyer-all-orders")}
            className="mt-4 bg-[#cecece] text-[#202020] p-2 rounded-lg cursor-pointer hover:bg-[#202020] hover:text-[#cecece] hover:border hover:border-[#cecece]"
          >
            View All Orders
          </button>
        </div>
        <hr className="border border-[#cecece] my-10"></hr>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-PBG-100 p-4 text-PT-100 rounded-xl shadow-PS">
            <h3 className="text-lg font-bold">Total Spent This Month</h3>
            <p className="text-2xl">$5,230</p>
          </div>
          <div className="bg-PBG-100 p-4 text-PT-100 rounded-xl shadow-PS">
            <h3 className="text-lg font-bold">Pending Orders</h3>
            <p className="text-2xl">12</p>
          </div>
          <div className="bg-PBG-100 p-4 text-PT-100 rounded-xl shadow-PS">
            <h3 className="text-lg font-bold">Urgent Orders</h3>
            <p className="text-2xl">3</p>
          </div>
        </div>
      </div>
    </section>
  );
};
