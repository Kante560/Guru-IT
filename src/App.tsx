import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home";
import { CalendarPage } from "./Pages/Calender";
import { Signup } from "./Pages/auth/Signup";
import { Login } from "./Pages/auth/Login";
import { CheckInOut } from "./Pages/CheckInOut";
import { AuthProvider } from "./Components/AuthContext.tsx";
import AdminDashboard from "./Pages/admin/AdminDashboard.tsx";
import AdminCheckIn from "./Pages/admin/AdminCheckIn.tsx";
import Assignments from "./Pages/admin/Assignments.tsx";
import  UsersPage from "./Pages/admin/UsersPage.tsx";
import { ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const App = () => {
  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/admincheckin" element={<AdminCheckIn />} />
        <Route path="/users" element={<UsersPage/>} />
           <Route path="/assignments" element={<Assignments />} />
        <Route path="/calendarpage" element={<CalendarPage />} />
        <Route path="/checkinout" element={<CheckInOut />} />
      </Routes>
    </AuthProvider>
  );
};
