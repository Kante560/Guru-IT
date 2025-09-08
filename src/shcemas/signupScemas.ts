import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  reg_no: z.string().min(1, "Registration number is required"),
  level: z.string().min(3, "Level is required"),
  email: z.string().email("Invalid email"),
  school: z.string().min(1, "School is required"),
  department: z.string().min(1, "Department is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  track: z.string().min(1, "Track is required"),
  role: z.enum(["user", "admin"]).default("user"), // ✅ enforce only user or admin
});

export type SignupFormValues = z.infer<typeof SignupSchema>;
