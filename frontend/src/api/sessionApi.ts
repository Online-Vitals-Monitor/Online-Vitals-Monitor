const API_BASE = import.meta.env.VITE_API_URL ?? "/api";
const SESSION_URL = `${API_BASE}/api/sessions`;

export interface SessionInfo {
  //id: string;
  publicID: string;
  createdAt: string;
  lastSeen: string;
}

export interface SessionApi {
  createSession: (requestedId?: string) => Promise<SessionInfo>;
  joinSession: (id: string) => Promise<SessionInfo>;
  getCurrentSession: () => Promise<SessionInfo | null>;
}

// export async function createSession() {
//   const res = await fetch(API_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) throw new Error("Failed to create session");
//   return res.json();
// }

export const sessionApi: SessionApi = {
  async createSession(requestedId?: string): Promise<SessionInfo> {
    const res = await fetch(SESSION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedId }),
    });

    if (!res.ok) {
      throw new Error("Failed to create session");
    }

    const data = await res.json();

    // store public ID in browser
    localStorage.setItem("sessionId", data.publicID);

    return {
      publicID: data.publicID,
      createdAt: data.createdAt,
      lastSeen: data.lastSeen,
    };
  },

  async joinSession(publicID: string): Promise<SessionInfo> {
    const trimmed = publicID.trim();

    if (!trimmed) {
      throw new Error("Session ID is required to join a session.");
    }

    const res = await fetch(`${SESSION_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicID: trimmed }),
    });

    if (!res.ok) {
      throw new Error("Session not found");
    }

    const data = await res.json();

    localStorage.setItem("sessionId", data.publicID);

    return {
      publicID: data.publicID,
      createdAt: data.createdAt,
      lastSeen: data.lastSeen,
    };
  },

  async getCurrentSession(): Promise<SessionInfo | null> {
    const stored = localStorage.getItem("sessionId");

    if (!stored) {
      return null; // STOP HERE
    }

    const res = await fetch(`${SESSION_URL}/${stored}`);

    if (!res.ok) {
      localStorage.removeItem("sessionId");
      return null;
    }

    const data = await res.json();

    return {
      publicID: data.publicID,
      createdAt: data.createdAt,
      lastSeen: data.lastSeen,
    };
  },
};
