import { useEffect, useState } from "react";
import { createSession } from "../api/sessionApi";

export function useInitializeSession() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("sessionId");

    // Already have a session
    if (existing) {
      setReady(true);
      return;
    }

    // No session → create one
    createSession()
      .then((data) => {
        localStorage.setItem("sessionId", data.publicID);
        setReady(true);
      })
      .catch((err) => {
        console.error("Could not create session:", err);
        setReady(true);
      });
  }, []);

  return ready;
}
