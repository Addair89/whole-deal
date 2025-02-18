import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../AuthContext";
import BuyerSideBar from "../BuyerSideBar";
import { Loader } from "../../../Loader";

export const BuyerAllOrders = () => {
  const { customer } = useContext(AuthContext);
  if (!customer) {
    return <div>No customer data available</div>;
  }
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [futureOrders, setFutureOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  interface Order {
    id: number;
    customer_name: string;
    total_price: number;
    delivery_date: string;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/buyers/all-orders/${
            customer.id
          }`
        );
        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        const all: Order[] = data.orders || [];

        const today = new Date();
        const past = all.filter(
          (order) => new Date(order.delivery_date) < today
        );
        const future = all.filter(
          (order) => new Date(order.delivery_date) > today
        );

        setAllOrders(all);
        setPastOrders(past);
        setFutureOrders(future);
        console.log("Buyer all orders component Fetched orders:", allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Ensures loading state updates even on error
      }
    };

    fetchOrders();
  }, []);
  return (
    <section className="flex min-h-screen bg-PBG-100 text-PT-100">
      <BuyerSideBar />
      <div className="flex-1 p-6 ml-[15%]">
        <h1 className=" text-6xl mt-10 ">ALL ORDERS</h1>
        <hr className="border border-[#474747] my-10"></hr>
        {/* name of each tab group should be unique */}
        <div className="p-4 rounded-md shadow-PS">
          {loading ? (
            <Loader />
          ) : (
            <div className="tabs tabs-border">
              <input
                type="radio"
                name="my_tabs_2"
                className="tab "
                aria-label="Tab 1"
              />
              <div className="tab-content bg-[#f0f4f8] text-[#474747] p-10">
                <ul>
                  {allOrders.length > 0 ? (
                    allOrders.map((order: Order) => (
                      <li className="flex justify-between" key={order.id}>
                        <span>
                          Order #{order.id} - {order.customer_name}
                        </span>
                        <span className="font-bold text-green-600">
                          ${order.total_price}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p>No orders found.</p>
                  )}
                </ul>
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                className="tab "
                aria-label="Tab 2"
                defaultChecked
              />
              <div className="tab-content bg-[#f0f4f8] text-[#474747] p-10">
                <ul>
                  {pastOrders.length > 0 ? (
                    pastOrders.map((order: Order) => (
                      <li className="flex justify-between" key={order.id}>
                        <span>
                          Order #{order.id} - {order.customer_name}
                        </span>
                        <span className="font-bold text-green-600">
                          ${order.total_price}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p>No orders found.</p>
                  )}
                </ul>
              </div>

              <input
                type="radio"
                name="my_tabs_2"
                className="tab "
                aria-label="Tab 3"
              />
              <div className="tab-content bg-[#f0f4f8] text-[#474747] p-10">
                <ul>
                  {futureOrders.length > 0 ? (
                    futureOrders.map((order: Order) => (
                      <li className="flex justify-between" key={order.id}>
                        <span>
                          Order #{order.id} - {order.customer_name}
                        </span>
                        <span className="font-bold text-green-600">
                          ${order.total_price}
                        </span>
                      </li>
                    ))
                  ) : (
                    <p>No orders found.</p>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
