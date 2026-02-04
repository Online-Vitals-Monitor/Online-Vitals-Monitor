import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link here
import { useVitals } from "../../contexts/vitalsContext";
import "./Navbar.css";

//routes object: Add pages/routes here if needed
const routes = [
  { page: "Monitor", path: "/" },
  { page: "Control Vitals", path: "/values" },
];

interface NavbarProps {
  isSessionActive: boolean;
  onSessionClick?: () => void;
}

//array storing possible vital types: Added new vitals here if needed
const vitalLabels = [
  { value: "heartRate", label: "Heart Rate" },
  { value: "respRate", label: "Respiratory Rate" },
  { value: "o2Saturation", label: "Oxygen Saturation" },
  { value: "systolicBP", label: "Systolic Blood Pressure" },
  { value: "diastolicBP", label: "Diastolic Blood Pressure" },
  { value: "eTCO2", label: "End-Tidal Carbon Dioxide" },
];

const NavbarNew = ({ isSessionActive, onSessionClick }: NavbarProps) => {
  const navigate = useNavigate();

  const handleMonitorButtonClick = () => {
    if (onSessionClick) {
      onSessionClick();
    }
    navigate("/");
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <>
      {/* --- HAMBURGER MENU (OFF-SCREEN) --- */}
      <div className={`off-screen-menu ${isOpen ? "active" : ""}`}>
        <ul>
          {/* Mapping the routes here allows mobile users to see all pages */}
          {routes.map((route) => (
            <li key={route.page}>
              <Link to={route.path} onClick={toggleMenu}>
                {route.page}
              </Link>
            </li>
          ))}
          <hr
            style={{ borderColor: "white", width: "80%", margin: "1rem auto" }}
          />
          <li>
            <Link to="/about-the-team" onClick={toggleMenu}>
              About The Team
            </Link>
          </li>
          <li>
            <Link to="/help" onClick={toggleMenu}>
              Help
            </Link>
          </li>
        </ul>
      </div>
      {/* --- END OF HAMBURGER MENU (OFF-SCREEN) --- */}

      {/* EVERYTHING ON THE NAVBAR + hamburger menu */}
      <nav>
        <Link to="/" className="logo-link">
          <img className="logo" src="" alt="logo" />
        </Link>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/values">Control Vitals</Link>
          </li>
          {/* SESSION STATUS BUTTON */}
          <li>
            <button
              onClick={handleMonitorButtonClick}
              className={`status-btn ${isSessionActive ? "active" : "inactive"}`}
            >
              {/* Dynamic Text based on state */}
              <span className="status-dot"></span>
              {isSessionActive ? "Monitor: Active" : "Start Session"}
            </button>
          </li>
          {/* END OF SESSION STATUS BUTTON */}
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>

        <div
          className={`ham-menu ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>
    </>
  );
};
export default NavbarNew;
