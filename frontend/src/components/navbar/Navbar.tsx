// import { useState } from "react";
import { Link } from "react-router-dom";
// import { useVitals } from "../../contexts/vitalsContext";
import "./Navbar.css";
// interface NavbarProps {
//   isSessionActive: boolean;
//   setIsSessionActive: (active: boolean) => void;
// }

//routes object: Add pages/routes here if needed
// const routes = [
//   { page: "Monitor", path: "/" },
//   { page: "Control Vitals", path: "/values" },
// ];

const routes = [
  { page: "Home", path: "/" },
  { page: "Control Vitals", path: "/values" },
  { page: "Monitor", path: "/monitor" },
  { page: "About", path: "/about" },
];

// const NavbarNew = ({ isSessionActive, setIsSessionActive }: NavbarProps) => {
const Navbar = () => {
  //const navigate = useNavigate();

  // const handleMonitorButtonClick = () => {
  //   setIsSessionActive(!isSessionActive);
  //   navigate("/monitor");
  // };

  return (
    <>
      <nav>
        <div className="logo-container">
          <img
            className="logo"
            src="/images/vm-logo.png"
            alt="vitals-monitor"
          />
        </div>
        <div className="main-nav-buttons">
          <ul>
            {routes.map((route) => (
              <li key={route.path}>
                <Link to={route.path}>{route.page}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Disabling the session status button for now (didnt really have a concrete idea for this concept, 
        so dont want to commit to anything yet) */}
        {/* SESSION STATUS BUTTON */}
        <div className="nav-right">
          {/*<button
            onClick={handleMonitorButtonClick}
            className={`status-btn ${isSessionActive ? "active" : "inactive"}`}
          > */}
          {/* Dynamic Text based on state */}
          {/* <span className="status-dot"></span>
            {isSessionActive ? "Monitor: Active" : "Start Session"}
          </button>*/}
        </div>
        {/* END OF SESSION STATUS BUTTON */}
      </nav>
    </>
  );
};
export default Navbar;
