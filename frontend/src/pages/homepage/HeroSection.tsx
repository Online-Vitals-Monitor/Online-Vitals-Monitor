import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/contexts/sessionContext";
import "./HeroSection.css";

const BlenderHeroPage = () => {
  const [newSessionId, setNewSessionId] = useState("");
  const [existingSessionId, setExistingSessionId] = useState("");
  const [error, setError] = useState("");
  const { session, connectNew, connectExisting } = useSession();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const target =
    location.state?.from?.pathname &&
    location.state.from.pathname !== "/session"
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
    <div className="hero-frame">
      <div className="hero-img-wrap">
        <div
          className="hero-img"
          style={{
            backgroundImage: "url('/images/vitals_heropage_render_white.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <div className="hero-content-wrapper">
            <h1 className="hero-title">
              Hospital-grade <br />
              vital signs simulated in <span>real time</span>
            </h1>
            <p className="hero-description">
              Built for training, demonstrations, and medical education. <br />
              Create or join monitoring sessions that simulate <br />
              patient vital signs.
            </p>

            <div className="hero-buttons">
              <div className="hero-session-row">
                <button
                  type="button"
                  className="hero-btn hero-btn-primary"
                  onClick={handleNewSession}
                >
                  Create monitor session
                </button>
                <input
                  type="text"
                  className="hero-session-input"
                  placeholder="New session ID (optional)"
                  value={newSessionId}
                  onChange={(e) => setNewSessionId(e.target.value)}
                />
              </div>

              <div className="hero-session-row">
                <button
                  type="button"
                  className="hero-btn hero-btn-secondary"
                  onClick={handleJoinSession}
                >
                  Join existing session
                </button>
                <input
                  type="text"
                  className="hero-session-input"
                  placeholder="Existing session ID"
                  value={existingSessionId}
                  onChange={(e) => setExistingSessionId(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="hero-session-error">{error}</div>}

            {session && (
              <div className="hero-current-session">
                <p>
                  Current session: <strong>{session.id}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlenderHeroPage;
