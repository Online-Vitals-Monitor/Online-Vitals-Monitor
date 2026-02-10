import "./Heropage.css";
import { Link, useNavigate } from "react-router-dom";
import MonitorView from "../monitorView";

const Heropage = () => {
  return (
    <div id="home" className="hero-page-container">
      <div className="hero-content-container">
        <div className="left-section">
          <div className="header-hook">
            <h1>
              Hospital-Grade <br></br>Vital Signs{" "}
              <span className="header-hook-dark">Simulated in Real Time</span>
            </h1>
          </div>

          <p className="hero-description">
            Create or join monitoring sessions that simulate hospital grade
            <br />
            patient vital signs. Built for training, demonstrations, and <br />
            medical education
          </p>

          <ul className="session-list">
            <li>
              <Link className="create-session" to="/values">
                <span className="button-light-effect"></span>
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

export default Heropage;
