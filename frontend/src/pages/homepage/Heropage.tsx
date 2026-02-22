import "./Heropage.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../../contexts/sessionContext";
import MonitorView from "../monitorView";

const Heropage = () => {
  const [newSessionId, setNewSessionId] = useState("");
  const [existingSessionId, setExistingSessionId] = useState("");
  const [error, setError] = useState("");
  const { session, connectNew, connectExisting } = useSession();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const target =
    location.state?.from?.pathname && location.state.from.pathname !== "/session"
      ? location.state.from.pathname
      : "/monitor";
  
  const handleNewSession = async () => {
    setError("");
    try {
      await connectNew(newSessionId.trim() || undefined);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    }
  };

  const handleJoinSession = async () => {
    const id = existingSessionId.trim();
    if (!id) {
      setError("Please enter a session ID");
      return;
    }

    setError("");
    try {
      await connectExisting(id);
      navigate(target, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join session");
    }
  };

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
            <li className="session-row">
              <button
                type="button"
                className="create-session"
                onClick={handleNewSession}
              >
                <span className="button-light-effect"></span>
                Create Monitor Session
              </button>
              <input
                type="text"
                className="new-session-input"
                placeholder="New session ID (optional)"
                value={newSessionId}
                onChange={(e) => setNewSessionId(e.target.value)}
              />
            </li>

            <li className="session-row">
              <button
                type="button"
                className="join-session"
                onClick={handleJoinSession}
              >
                Join Existing Session
              </button>
              <input
                type="text"
                className="old-session-input"
                placeholder="Existing session ID"
                value={existingSessionId}
                onChange={(e) => setExistingSessionId(e.target.value)}
              />
            </li>
          </ul>

          {error && <div className="session-error">{error}</div>}

          {session && (
            <div className="current-session-banner">
              <p>
                Current session: <span className="header-hook-dark"><strong>{session.id}</strong></span>
              </p>
            </div>
          )}

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
