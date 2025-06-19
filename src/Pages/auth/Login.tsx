import React, { useState } from "react";
import { Nav } from "../Nav";
import { useAuth, useAuthRedirect } from "../../Components/AuthContext";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const { login } = useAuth();
  useAuthRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
  
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <>
      <Nav />
      
      <div className="min-h-screen flex items-center font-inter justify-center bg-gradient-to-br from-red-100 via-white to-blue-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-center text-black">
            Welcome Back!{" "}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input py-[12px] focus:outline-none focus:shadow-sm focus:shadow-blue-900 w-full pl-1.5 rounded-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input py-[12px] focus:outline-none focus:shadow-sm focus:shadow-blue-900 w-full pl-1.5 rounded-sm"
            />
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-950 cursor-pointer"
            >
              Log In
            </button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-900 underline">
              Signup
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
