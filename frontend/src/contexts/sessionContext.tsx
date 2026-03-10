import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
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
  const [session, setSession] = useState<SessionInfo | null>(null);

  // initialize session on app start
  const initialized = React.useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function initSession() {
      try {
        const existing = await sessionApi.getCurrentSession();

        if (existing) {
          setSession(existing);
          return;
        }

        const created = await sessionApi.createSession();
        setSession(created);
      } catch (err) {
        console.error("Session init failed", err);
      }
    }

    initSession();
  }, []);

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
