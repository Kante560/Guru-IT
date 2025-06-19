import React, { useState, useEffect } from "react";
import { AssignmentModal } from "./AssignmentModal";
import { useAuth } from "./AuthContext";

// Define the type for a single assignment
interface Assignment {
  topic?: string;
  track?: string;
  deadline?: string;
  description?: string;
}

export const Forms: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://guru-it.vercel.app/admin/assignments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        // If the API returns an array, use the first assignment as the current one
        if (Array.isArray(data) && data.length > 0) {
          setCurrentAssignment(data[0]);
        } else if (data && Array.isArray(data.assignments) && data.assignments.length > 0) {
          setCurrentAssignment(data.assignments[0]);
        } else {
          setCurrentAssignment(null);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setCurrentAssignment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [token]);

  return (
    <div className="py-10 px-6 md:px-16 text-black">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg h-[60vh] flex items-center justify-between flex-col p-6 border-l-4 duration-300 transition-transform hover:scale-105 hover:shadow-xl border-blue-900 ">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">📌 Current Assignment</h2>
        {loading ? (
          <p>Loading assignment...</p>
        ) : currentAssignment ? (
          <>
            <p className="text-gray-800 px-auto"><strong>Topic:</strong> {currentAssignment.topic}</p>
            <p className="text-gray-800 px-auto"><strong>Track:</strong> {currentAssignment.track}</p>
            {/* Add more fields as needed */}
          </>
        ) : (
          <p>No current assignment found.</p>
        )}
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