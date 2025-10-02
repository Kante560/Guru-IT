import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../_context/AuthContext";

interface Props {
  children: ReactNode;
}

const AuthGuard = ({ children }: Props) => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If there's no token or not authenticated, redirect to login
    if (!token || !isAuthenticated) {
      navigate("/login");
    }
  }, [token, isAuthenticated, navigate]);

  // While checking, we still render children — pages that require stricter control
  // should use this component as a top-level wrapper or the ProtectedRoute already provided.
  return <>{children}</>;
};

export default AuthGuard;
