import { Nav } from "../../Components/Nav";
import { useState } from "react";
import { useAuth, useAuthRedirect } from "../../_context/AuthContext";
import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupSchema, SignupFormValues } from "../../shcemas/signupScemas";
import { z } from "zod";
import SplitText from "../../ui/SplitText";

export const Signup = () => {
  const { register: signup } = useAuth();
  useAuthRedirect();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<z.input<typeof SignupSchema>>({
  resolver: zodResolver(SignupSchema),
  defaultValues: {
    role: "user", // ✅ backend can later update this if needed
  },
});

  const   onSubmit = async (data: z.input<typeof SignupSchema>) => {
    try {
      setIsSubmitting(true);
      await signup(data as SignupFormValues);
      toast.success("Signup successful! Welcome to GURU-IT.");
    } catch (error) {
      toast.error("Signup failed. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#131A29] flex flex-col lg:flex-row font-inter">
      {/* Right Column (Quote) */}
      <div className="hidden lg:flex flex-1 bg-[#131A29] text-white relative">
        <div className="m-auto max-w-lg text-center px-4 md:px-8">
          <SplitText
            className="text-xl font-medium leading-relaxed"
            delay={60}
            duration={0.6}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          >
            "Join our community of innovators and take your tech journey to the next level."
          </SplitText>
          <p className="mt-4 text-sm opacity-80">- Mr Oyo, Founder</p>
        </div>
      </div>
      {/* Left Column (Form) */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-15 md:px-16 bg-transparent lg:bg-gray-50">
        <Nav />
        <div className="w-full max-w-sm md:max-w-md mt-16 sm:mt-[8rem] mx-auto mb-4 bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            SIGN UP
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium md:text-gray-700 text-white  ">Full Name</label>
              <input
                {...register("name")}
                aria-invalid={!!errors.name}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Guru Emmanuel John"
              />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>

            {/* Reg No */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Registration Number</label>
              <input
                {...register("reg_no")}
                aria-invalid={!!errors.reg_no}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="24/SEN/177"
              />
              {errors.reg_no && <p className="text-red-600 text-sm">{errors.reg_no.message}</p>}
            </div>

            {/* Level */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Level</label>
              <input
                {...register("level")}
                aria-invalid={!!errors.level}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="100"
              />
              {errors.level && <p className="text-red-600 text-sm">{errors.level.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Guru372@gmail.com"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            {/* School */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">School</label>
              <input
                {...register("school")}
                aria-invalid={!!errors.school}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Crossriver University of Technology and Science"
              />
              {errors.school && <p className="text-red-600 text-sm">{errors.school.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Department</label>
              <input
                {...register("department")}
                aria-invalid={!!errors.department}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Software Engineering"
              />
              {errors.department && <p className="text-red-600 text-sm">{errors.department.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register("password")}
                aria-invalid={!!errors.password}
                className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Guru1234"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>

            {/* Track */}
            <div>
              <label className="block mb-1 font-medium  text-gray-700">Track</label>
              <select {...register("track")} aria-invalid={!!errors.track} className="w-full px-3 py-2 focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded">
                <option value="">Select Track</option>
                <option value="frontend">Frontend Web</option>
                <option value="backend">Backend Web</option>
                <option value="frontend-mobile">Frontend Mobile</option>
                <option value="backend-mobile">Backend Mobile</option>
                <option value="uiux">UI/UX</option>
              </select>
              {errors.track && <p className="text-red-600 text-sm">{errors.track.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-2 rounded font-medium transition-colors 
                ${isSubmitting ? "bg-blue-900 cursor-not-allowed" : " md:bg-[#131A29] bg-blue-950"}`}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
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
