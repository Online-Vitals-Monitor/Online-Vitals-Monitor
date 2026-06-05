import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/contexts/sessionContext";

const RequireSession: React.FC = () => {
  const { isConnected, isLoading } = useSession();
  const location = useLocation();

  if (isLoading) return null; // ← wait for session check before redirecting

  if (!isConnected) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireSession;
