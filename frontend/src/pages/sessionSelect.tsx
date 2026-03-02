// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useSession } from "../contexts/sessionContext";
// import "./sessionSelect.css";

// const SessionSelect: React.FC = () => {
//   const [sessionInput, setSessionInput] = useState("");
//    const [error, setError] = useState("");
//   //const { session, connectNew, connectExisting } = useSession();
//   const navigate = useNavigate();
//   const location = useLocation() as any;

//   // Go back to where user came from, or default to home
//   const target =
//     location.state?.from?.pathname && location.state.from.pathname !== "/session"
//       ? location.state.from.pathname
//       : "/";

//   const handleNewSession = async () => {
//     setError("");  // Clear any existing error
//     try {
//       await connectNew(sessionInput.trim() || undefined);
//       navigate(target, { replace: true });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to create session");
//     }
//   };

//   const handleJoinSession = async () => {
//     const id = sessionInput.trim();
//     if (!id) {
//       setError("Please enter a session ID");
//       return;
//     }

//     setError("");
//     try {
//       await connectExisting(id);
//       navigate(target, { replace: true });
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Failed to join session");
//     }
//   };

//   return (
//     <div className="session-select-root">
//       <div className="session-select-box">
//         <div className="user-instructions">
//           <p><strong>How to use sessions:</strong></p>
//           <p>• Click 'New Session' to start a new session.</p>
//           <p>• Optionally, enter an ID for the session. If left blank, an ID will be assigned.</p>
//           <p>• To join a session, enter the ID and click 'Join Existing Session'.</p>
//         </div>

//         <input
//           type="text"
//           className="session-input"
//           placeholder="Enter session ID"
//           value={sessionInput}
//           onChange={(e) => setSessionInput(e.target.value)}
//         />

//         {error && (
//           <div className="session-error">
//             {error}
//           </div>
//         )}

//         <div className="session-buttons">
//           <button
//             type="button"
//             className="session-btn primary"
//             onClick={handleNewSession}
//           >
//             New session
//           </button>
//           <button
//             type="button"
//             className="session-btn secondary"
//             onClick={handleJoinSession}
//           >
//             Join existing session
//           </button>
//         </div>

//         {/* Current session info - now below buttons, stable layout */}
//         {session && (
//           <div className="current-session-banner">
//             <p>
//               Current session: <strong>{session.id}</strong>
//             </p>
//             <p>Starting/joining another will switch sessions.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SessionSelect;
