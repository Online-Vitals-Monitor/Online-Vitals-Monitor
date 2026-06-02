// import { useState } from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";

const routes = [
  { page: "Home", path: "/" },
  { page: "Control Vitals", path: "/values" },
  { page: "Monitor", path: "/monitor" },
  { page: "About", path: "/about" },
];

const NavigationBar = () => {
  return (
    <>
      <nav>
        <div className="nav-wrapper">
          <div className="logo-container">
            {/* <img
              className="logo"
              src="/images/vm-logo.png"
              alt="vitals-monitor"
            /> */}
          </div>
          <div className="nav-buttons-wrapper">
            <ul>
              {routes.map((route) => (
                <li key={route.path}>
                  <Link to={route.path}>{route.page}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default NavigationBar;
