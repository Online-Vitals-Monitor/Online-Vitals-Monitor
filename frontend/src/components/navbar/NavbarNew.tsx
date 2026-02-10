import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVitals } from "../../contexts/vitalsContext";
import "./Navbar.css";

//routes object: Add pages/routes here if needed
const routes = [
  { page: "Monitor", path: "/monitor" },
  { page: "Control Vitals", path: "/values" },
];

interface NavbarProps {
  isSessionActive: boolean;
  setIsSessionActive: (active: boolean) => void;
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

const NavbarNew = ({ isSessionActive, setIsSessionActive }: NavbarProps) => {
  const navigate = useNavigate();

  const handleMonitorButtonClick = () => {
    setIsSessionActive(!isSessionActive);
    navigate("/monitor");
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <>
      <nav>
        <div className="logo-container">
          <img className="logo" src="vm-logo.png" />
        </div>
        <div className="main-nav-buttons">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">How It Works</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/values">Control Vitals</Link>
            </li>
          </ul>
        </div>
        {/* SESSION STATUS BUTTON */}
        <div className="nav-right">
          <button
            onClick={handleMonitorButtonClick}
            className={`status-btn ${isSessionActive ? "active" : "inactive"}`}
          >
            {/* Dynamic Text based on state */}
            <span className="status-dot"></span>
            {isSessionActive ? "Monitor: Active" : "Start Session"}
          </button>
        </div>
        {/* END OF SESSION STATUS BUTTON */}
      </nav>
    </>
  );
};
export default NavbarNew;
