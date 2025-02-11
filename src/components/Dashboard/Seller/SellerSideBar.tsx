import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../AuthContext";

const SellerSideBar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const links = [
    { name: "Dashboard", path: "/seller-dashboard" },
    { name: "All Orders", path: "/seller-all-orders" },
    { name: "Products", path: "/seller-products" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/welcome");
  };
  return (
    <div className="sidebar w-[15%] text-white bg-slate-950 h-screen text-2xl fixed">
      <p className="font-semibold p-8 text-center">WholeDeal</p>
      <div>
        <ul className="flex flex-col items-center justify-center ">
          {links.map((link) => (
            <li className="w-full text-center" key={link.path}>
              <NavLink
                to={link.path}
                className={`block p-2 rounded-l-full transition ${
                  location.pathname === link.path
                    ? "bg-slate-700 text-white font-bold "
                    : "hover:bg-slate-800"
                }`}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="btn btn-ghost w-full">Products</li>
          <li className="btn btn-ghost w-full">Sales Reports</li>
          <li className="btn btn-ghost w-full">Account</li>
          <li onClick={handleLogout} className="btn btn-ghost w-full">
            Log Out
          </li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default SellerSideBar;
