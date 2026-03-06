import React, { createContext, useContext, useState, ReactNode } from "react";
import { SessionInfo, sessionApi } from "../api/sessionApi";

type SessionState = {
  session: SessionInfo | null;
  isConnected: boolean;
  connectNew: (requestedId?: string) => Promise<void>;
  connectExisting: (id: string) => Promise<void>;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // For testing: start as if already connected to a session
  const [session, setSession] = useState<SessionInfo | null>({
    publicID: "test-session-123",
    createdAt: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
  });

  const connectNew = async (requestedId?: string) => {
    const created = await sessionApi.createSession(requestedId);
    setSession(created);
  };

  const connectExisting = async (id: string) => {
    const joined = await sessionApi.joinSession(id);
    setSession(joined);
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        isConnected: !!session,
        connectNew,
        connectExisting,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
};
