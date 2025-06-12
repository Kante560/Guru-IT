import React, { useState } from "react";
import { Nav } from "../Nav";
import { useAuth, useAuthRedirect } from "../../Components/AuthContext";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const { register } = useAuth();
  useAuthRedirect();

  const [form, setForm] = useState({
    name: "",
    reg_no: "",
    level: "",
    email: "",
    school: "",
    department: "",
    password: "",
    track: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Signup successful! Welcome to GURU-IT.");
    } catch (error) {
      toast.error("Signup failed. Please check your details.");
    }
  };

  return (
    <>
      <Nav />
      
      <div className="min-h-screen font-inter  flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-blue-100">
        <div className="bg-white  mt-[10rem]  mb-[5rem] p-6 rounded-lg  shadow-lg max-w-md w-full space-y-4">
          <h2 className="text-2xl font-bold text-center text-black">SIGN UP</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Guru Emmanuel John"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Registration Number</label>
              <input
                type="text"
                name="reg_no"
                placeholder="24/SEN/177"
                value={form.reg_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Level</label>
              <input
                type="text"
                name="level"
                placeholder="100"
                value={form.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Guru372@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">School</label>
              <input
                type="text"
                name="school"
                placeholder="Crossriver University of Technology and Science "
                value={form.school}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Software Engineering"
                value={form.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Guru1234"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Track</label>
              <select
                name="track"
                value={form.track}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-black"
              >
                <option value="">Select Track</option>
                <option value="frontend">Frontend Web</option>
                <option value="backend">Backend Web</option>
                <option value="frontend-mobile">Frontend Mobile</option>
                <option value="backend-mobile">Backend Mobile</option>
                <option value="uiux">UI/UX</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-900 underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
