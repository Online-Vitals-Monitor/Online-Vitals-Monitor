import "./Homepage.scss";
import "./Homepage.css";
import { Link, useNavigate } from "react-router-dom";
import { useVitals } from "../../contexts/vitalsContext";
import MonitorView from "../monitorView";

const Homepage = () => {
  return (
    <div className="home-background">
      <div className="home-content-container">
        <div className="left-section">
          <div className="header-hook">
            <div className="h-line1">Hospital-grade </div>
            <div className="h-line2">vital signs</div>
            <div className="h-line3">simulated in real time</div>
          </div>

          <p className="hero-description">
            Create or join monitoring sessions that simulate hospital grade
            <br />
            patient vital signs. Built for training, demonstrations, and <br />
            medical education.
          </p>

          <ul className="session-list">
            <li>
              <Link className="create-session" to="/values">
                Create Monitor Session
              </Link>
            </li>
            <li>
              <Link className="join-session" to="/values">
                Join Existing Session
              </Link>
            </li>
          </ul>
        </div>

        <div className="monitor-section">
          <div className="monitor-wrapper">
            <div className="monitor-glow" />

            <div className="monitor-box">
              <MonitorView />
              <div className="preview-label">Live Preview</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
