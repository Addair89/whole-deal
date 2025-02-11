import React from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, logout } = useContext(AuthContext);
  console.log("NavBar Customer:", customer?.company_name);

  const handleLogOut = () => {
    logout();
    navigate("/welcome");
  };

  return (
    <div className="navbar bg-stone-900 text-white shadow-sm pb-2.5">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        {customer === null ? (
          <a
            onClick={() => navigate("/welcome")}
            className="btn btn-ghost text-xl"
          >
            WholeDeal
          </a>
        ) : (
          <p className="btn btn-ghost text-xl">WholeDeal</p>
        )}
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="btn btn-ghost">Item 1</a>
          </li>
          <li>
            <details>
              <summary className="btn btn-ghost">Parent</summary>
              <ul className="p-2">
                <li>
                  <a className="btn">Submenu 1</a>
                </li>
                <li>
                  <a className="btn">Submenu 2</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a className="btn btn-ghost">Item 3</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {customer !== null ? (
          <a onClick={handleLogOut} className="btn">
            Log Out
          </a>
        ) : (
          <div>
            {location.pathname === "/buyer-sign-up" ||
              (location.pathname === "/seller-sign-up" && (
                <a onClick={() => navigate("/welcome")} className="btn">
                  SignUp
                </a>
              ))}
            <a onClick={() => navigate("/login")} className="btn">
              Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
