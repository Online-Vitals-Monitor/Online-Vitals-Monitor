import { useEffect, useState } from "react";
import { sessionApi } from "../api/sessionApi";

export function useInitializeSession() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const existing = localStorage.getItem("sessionId");

        // If session already exists, just continue
        if (existing) {
          setReady(true);
          return;
        }

        // Otherwise create a new session
        await sessionApi.createSession();

        setReady(true);
      } catch (err) {
        console.error("Could not create session:", err);
        setReady(true);
      }
    };

    initialize();
  }, []);

  return ready;
}
