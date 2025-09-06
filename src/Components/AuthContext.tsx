import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ---------- Types ----------
interface User {
  name?: string;
  reg_no?: string;
  track?: string;
  role: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  reg_no: string;
  level: string;
  school: string;
  department: string;
  track: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// ---------- Context ----------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Load auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // ---------- Login ----------
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("https://guru-it.vercel.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const result: LoginResponse = await res.json();

      if (!result.token) throw new Error("No token in response");

      // Persist auth
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);

      toast.success("Login successful!");
      navigate(result.user.role === "admin" ? "/admindashboard" : "/");
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "An unexpected error occurred";
      toast.error(errorMessage);
      throw e;
    }
  };

  // ---------- Register ----------
  const register = async (data: RegisterData) => {
    try {
      const res = await fetch("https://guru-it.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      const result: LoginResponse = await res.json();

      if (!result.token) throw new Error("No token in response");

      // Persist auth
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setToken(result.token);
      setUser(result.user);
      setIsAuthenticated(true);

      navigate(result.user.role === "admin" ? "/admindashboard" : "/");
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "An unexpected error occurred";
      toast.error(errorMessage);
      throw e;
    }
  };

  // ---------- Logout ----------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------- Hooks ----------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "admin" ? "/admindashboard" : "/");
    }
  }, [isAuthenticated, user, navigate]);
};
