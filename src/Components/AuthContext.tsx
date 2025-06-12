import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Interfaces
interface User {
  name: string;
  reg_no: string;
  track: string;
  // add other user fields as needed
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

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

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
      const response = await fetch("https://guru-it.vercel.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setIsAuthenticated(true);

        // Save user details
        const userData: User = {
          name: result.user.name,
          reg_no: result.user.reg_no,
          track: result.user.track,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success("Login successful!");
        navigate("/admindashboard");
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      toast.error("Login failed");
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch("https://guru-it.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Registration failed");

      const result = await response.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
        setIsAuthenticated(true);

        // Store user data if returned (optional)
        if (result.user) {
          const userData: User = {
            name: result.user.name,
            reg_no: result.user.reg_no,
            track: result.user.track,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        toast.success("Registration successful!");
      }
    } catch (error) {
      toast.error("Registration failed");
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
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

// Hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// Optional hook to redirect if authenticated
export const useAuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admincheckin");
    }
  }, [isAuthenticated, navigate]);
};
