import React, { useState } from "react";
import { Nav } from "../../Components/Nav";
import { useAuth, useAuthRedirect } from "../../_context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplitText from "../../ui/SplitText"; // ✅ import GSAP SplitText

export const Login = () => {
  const { login } = useAuth();
  useAuthRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 flex flex-col lg:flex-row font-inter">
      {/* Left Column */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 bg-transparent lg:bg-gray-50">
        <Nav />
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl text-center font-bold text-gray-900 mb-4 sm:mb-6">
            Welcome Back!
          </h2>
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full  rounded-md px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md px-3 py-2 "
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-md font-medium transition-colors 
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-950"}`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-900 underline">
              Signup
            </a>
          </p>
        </div>
      </div>
      {/* Right Column */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 text-white relative">
        <div className="absolute top-6 right-8 text-2xl font-bold">Guru-IT</div>
        <div className="m-auto max-w-lg text-center">
          <SplitText
            className="text-xl font-medium leading-relaxed"
            delay={60}
            duration={0.6}
            ease="power3.out"
            splitType="words" // animate word by word for nicer readability
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          >
            "Join our community of innovators and take your tech journey to the
            next level."
          </SplitText>
          <p className="mt-4 text-sm opacity-80">
            -Mr Emmanuel, Co-founder
          </p>
        </div>
      </div>
    </div>
  );
};
