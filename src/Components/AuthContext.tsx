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

interface User {
  name: string;
  reg_no: string;
  track: string;
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
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // On mount, load stored auth state
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

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(
        "https://guru-it.vercel.app/auth/login", // ensure this matches Swagger
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      const result = await res.json();
      if (!result.token) throw new Error("No token in response");

      // persist auth
      localStorage.setItem("token", result.token);
      setToken(result.token);
      setIsAuthenticated(true);

      // store user
      const u: User = {
        name: result.user.name,
        reg_no: result.user.reg_no,
        track: result.user.track,
        role: result.user.role,
      };
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));

      toast.success("Login successful!");
      // redirect immediately
      navigate(u.role === "admin" ? "/admindashboard" : "/");
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await fetch(
        "https://guru-it.vercel.app/register", // likely correct path
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }
      const result = await res.json();
      if (!result.token) throw new Error("No token in response");

      localStorage.setItem("token", result.token);
      setToken(result.token);
      setIsAuthenticated(true);

      if (result.user) {
        const u: User = {
          name: result.user.name,
          reg_no: result.user.reg_no,
          track: result.user.track,
          role: result.user.role,
        };
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      }
      navigate("/"); // or wherever new users go
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    }
  };

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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const useAuthRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      user?.role === "admin" ? navigate("/admindashboard") : navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
};