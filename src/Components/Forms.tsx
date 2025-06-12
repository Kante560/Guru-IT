import React, { useState, useEffect } from "react";
import { AssignmentModal } from "./AssignmentModal";
import { useAuth } from "./AuthContext";

// Define the type for the assignment
interface Assignment {
  topic?: string;
  track?: string;
  deadline?: string;
  description?: string;
}

export const Forms: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment>({});
  const { token } = useAuth();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch('https://guru-it.vercel.app/current-assignment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorization: `Bearer ${token || localStorage.getItem("token") || ""}`,
          }),
        });
        const data = await response.json();
        setCurrentAssignment(data);
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchAssignment();
  }, [token]);

  return (
    <div className="py-10 px-6 md:px-16 text-black">
      
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg h-[60vh] flex items-centers justify-between flex-col  p-6 border-l-4 duration-300 transition-transform hover:scale-105 hover:shadow-xl border-blue-900 ">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">📌 Current Assignment</h2>
        <p className="text-gray-800 px-auto"><strong>Topic:</strong> {currentAssignment.topic}</p>
        <p className="text-gray-800 px-auto"><strong>Track:</strong> {currentAssignment.track}</p>
        <p className="text-gray-800 px-auto"><strong>Deadline:</strong> {currentAssignment.deadline}</p>
        <p className="text-gray-600 mt-2 italic">
          {currentAssignment.description}
        </p>
        <button
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-950 transition"
          onClick={() => setModalOpen(true)}
        >
          Submit Assignment
        </button>
      </div>
      <AssignmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};


