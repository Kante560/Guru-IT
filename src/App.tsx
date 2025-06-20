import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";
import { CalendarPage } from "./Pages/Calender";
import { Signup } from "./Pages/auth/Signup";
import { Login } from "./Pages/auth/Login";
import { CheckInOut } from "./Pages/CheckInOut";
import { AuthProvider } from "./Components/AuthContext.tsx";
import AdminDashboard from "./Pages/admin/AdminDashboard.tsx";
import AdminCheckIn from "./Pages/admin/AdminCheckIn.tsx";
import  UsersPage from "./Pages/admin/UsersPage.tsx";
import { ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AssignmentUpload } from "./Pages/admin/AssignmentModalform.tsx";
import { Forms } from "./Components/Forms.tsx"


export const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
                <Route path="/assignment" element={<Forms />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admincheckin" element={<AdminCheckIn />} />
          <Route path="/users" element={<UsersPage/>} />
          <Route path="/adminupload" element={<AssignmentUpload />} /> 
        <Route path="/calendarpage" element={<CalendarPage />} />
        <Route path="/checkinout" element={<CheckInOut />} />
      </Routes>
    </AuthProvider>
  );
};
