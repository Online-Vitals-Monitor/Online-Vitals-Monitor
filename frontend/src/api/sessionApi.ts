const API_URL = "http://localhost:4000/api/sessions";

// export interface SessionInfo {
//   id: string;
//   publicID: string;
//   createdAt: string;
//   lastSeen: string;
// }

// export interface SessionApi {
//   createSession: (requestedId?: string) => Promise<SessionInfo>;
//   joinSession: (id: string) => Promise<SessionInfo>;
//   getCurrentSession: () => Promise<SessionInfo | null>;
// }

// // const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// const SESSION_URL = `${API_URL}/api/sessions`;

// export const sessionApi: SessionApi = {
//   async createSession(requestedId?: string): Promise<SessionInfo> {
//     const res = await fetch(SESSION_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ requestedId }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to create session");
//     }

//     const data = await res.json();

//     // Persist session in browser
//     localStorage.setItem("sessionId", data.publicID);

//     return {
//       id: data.publicID,
//       createdAt: data.createdAt,
//     };
//   },

//   async joinSession(id: string): Promise<SessionInfo> {
//     const trimmed = id.trim();
//     if (!trimmed) {
//       throw new Error("Session ID is required to join a session.");
//     }

//     const res = await fetch(`${SESSION_URL}/join`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ publicID: trimmed }),
//     });

//     if (!res.ok) {
//       throw new Error("Session not found");
//     }

//     const data = await res.json();

//     localStorage.setItem("sessionId", data.publicID);

//     return {
//       id: data.publicID,
//       createdAt: data.createdAt,
//     };
//   },

//   async getCurrentSession(): Promise<SessionInfo | null> {
//     const stored = localStorage.getItem("sessionId");
//     if (!stored) return null;

//     return { id: stored };
//   },
// };

export async function createSession() {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
}
