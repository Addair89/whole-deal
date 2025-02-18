import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { div } from "motion/react-client";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, logout } = useContext(AuthContext);
  console.log("NavBar Customer:", customer?.company_name);

  const locations = ["buyer-sign-up", "seller-sign-up", "login"];

  const handleLogOut = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar bg-DBG-100 text-PBG-100 shadow-sm pb-2.5">
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
          <a onClick={() => navigate("/")} className="btn btn-ghost text-xl">
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
          <div className="">
            {location.pathname.includes("sign-up") ? (
              <a
                onClick={() => navigate("/login")}
                className="bg-SBG-100 text-center block w-[7rem] text-PT-100 p-2 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-SBG-100 hover:border hover:border-PBG-100 shadow-PS hover:shadow-none"
              >
                Login
              </a>
            ) : location.pathname.includes("login") ? (
              <a
                onClick={() => navigate("/")}
                className="bg-SBG-100 text-center block w-[7rem]  text-PT-100 p-2 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-SBG-100 hover:border hover:border-PBG-100 shadow-PS hover:shadow-none"
              >
                Sign Up
              </a>
            ) : (
              <div className="flex gap-10">
                <a
                  onClick={() => navigate("/login")}
                  className="bg-SBG-100 text-center w-[7rem] text-PT-100 p-2 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-SBG-100 hover:border hover:border-PBG-100 shadow-PS hover:shadow-none"
                >
                  Login
                </a>
                <a
                  onClick={() => navigate("/")}
                  className=" bg-SBG-100 text-center w-[7rem] text-PT-100 p-2 rounded-lg cursor-pointer hover:bg-DBG-100 hover:text-SBG-100 hover:border hover:border-PBG-100 shadow-PS hover:shadow-none"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
