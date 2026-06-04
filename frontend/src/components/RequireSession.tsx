import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/contexts/sessionContext";
const RequireSession: React.FC = () => {
  const { isConnected } = useSession();
  const location = useLocation();

  // Currently always passes for easier dev work
  if (!isConnected) {
    return <Navigate to="/session" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireSession;
