

import { Link } from "react-router-dom";



export const AdminNav = () => {

  return (
<div className=" bg-gray-100 pt-20 font-inter">
<nav className="fixed top-0 left-0 w-full bg-blue-900 text-white py-4 px-6 shadow-md z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-6">
            <Link to="/admincheckin" className="hover:underline">
              Pending Check-Ins
            </Link>
            <Link to="/assignments" className="hover:underline">
              Assignments
            </Link>
            <Link to="/users" className="hover:underline">
              Users
            </Link>
          </div>
        </div>
      </nav>
      </div>
)}