export interface SessionInfo {
  id: string;
  // May want additional fields such as:
  // createdAt?: string;
  // owner?: string
  // status?: "active" | "ended";
}

export interface SessionApi {
  // Create a new session.
  createSession: (requestedId?: string) => Promise<SessionInfo>;
  
  // Join an existing session with the given ID.
  joinSession: (id: string) => Promise<SessionInfo>;

  // Get the current session for this user/tab, if any.
  getCurrentSession: () => Promise<SessionInfo | null>;
}

//Temporary stub implementation to work on frontend
const fakeSessionStore: { current: SessionInfo | null } = { current: null };

export const sessionApi: SessionApi = {
  async createSession(requestedId?: string): Promise<SessionInfo> {
    // TODO: replace with backend POST /api/session
    const id = (requestedId && requestedId.trim()) || 
        Math.random().toString(36).substring(2, 8).toUpperCase();
    const session: SessionInfo = { id };
    fakeSessionStore.current = session;
    return session;
  },

  async joinSession(id: string): Promise<SessionInfo> {
    const trimmed = id.trim();
    if (!trimmed) {
        throw new Error("Session ID is required to join a session.");
    }
    
    // Simulate "not connected to backend" for join
    throw new Error("Join session not hooked up to database yet");
    },

  async getCurrentSession(): Promise<SessionInfo | null> {
    // TODO: replace with backend GET /api/session
    return fakeSessionStore.current;
  },
};