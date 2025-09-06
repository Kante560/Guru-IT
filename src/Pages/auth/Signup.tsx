import React, { useState } from "react";
import { Nav } from "../../Components/Nav";
import { useAuth, useAuthRedirect } from "../../Components/AuthContext";
import { toast } from "react-toastify";
import SplitText from "../../ui/SplitText"; // ✅ import GSAP SplitText
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const { register } = useAuth();
  useAuthRedirect();

  // Define a type for the form keys
  type FormState = {
    name: string;
    reg_no: string;
    level: string;
    email: string;
    school: string;
    department: string;
    password: string;
    track: string;
    role:string;
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    reg_no: "",
    level: "",
    email: "",
    school: "",
    department: "",
    password: "",
    track: "",
    role:"",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = <
    K extends keyof FormState
  >(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as K]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Signup successful! Welcome to GURU-IT.");
    } catch (error) {
      toast.error("Signup failed. Please check your details.");
      console.log("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[110vh] font-inter">
      {/* Right Column - Branding / Testimonial */}
      <div className="hidden lg:flex flex-1 bg-[#131A29] text-white relative">
        <div className="absolute top-[3rem] left-2 text-2xl font-bold ">GURU-IT</div>
        <div className="m-auto max-w-lg text-center px-4">
         <SplitText
          className="text-xl font-medium leading-relaxed"
          delay={60}
          duration={0.6}
          ease="power3.out"
          splitType="words" // animate word by word for nicer readability
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
>
  "Join our community of innovators and take your tech journey to the next level."
</SplitText>

          <p className="mt-4 text-sm opacity-80">- Mr Oyo, Founder</p>
        </div>
      </div>
      {/* Left Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 bg-gray-50">
        <Nav />
        <div className="max-w-sm w-full mt-16 sm:mt-[8rem] mx-auto mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            SIGN UP
          </h2>
          <form className="space-y-2 sm:space-y-3" onSubmit={handleSubmit}>
            {[
              { name: "name", id: 1, label: "Full Name", placeholder: "Guru Emmanuel John" },
              { name: "reg_no", id: 2, label: "Registration Number", placeholder: "24/SEN/177" },
              { name: "level", id: 3, label: "Level", placeholder: "100" },
              { name: "email", id: 4, label: "Email", placeholder: "Guru372@gmail.com", type: "email" },
              { name: "school", id: 5, label: "School", placeholder: "Crossriver University of Technology and Science" },
              { name: "department", id: 6, label: "Department", placeholder: "Software Engineering" },
              { name: "password", id: 7, label: "Password", placeholder: "Guru1234", type: "password" },
            ].map((field) => (
              <div key={field.id}>
                <label className="block mb-1 font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name as keyof FormState]}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:shadow-sm focus:shadow-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block mb-1 font-medium text-gray-700">Track</label>
              <select
                name="track"
                value={form.track}
                onChange={handleChange}
                disabled={loading}
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
              disabled={loading}
              className={`w-full cursor-pointer text-white py-2 rounded font-medium transition-colors 
                ${loading ? "bg-blue-900 cursor-not-allowed" : "bg-[#131A29] hover:bg-blue-950"}`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#131A29] underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
