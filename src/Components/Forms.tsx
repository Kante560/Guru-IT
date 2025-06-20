import React, { useState, useEffect } from "react";
import { AssignmentModal } from "./AssignmentModal";
import { useAuth } from "./AuthContext";

// Match the payload from AssignmentModalform
interface Assignment {
  track: string;
  topic: string;
  date: string;
  time: string;
  is_group: boolean;
  group_members: string[];
  question_text: string;
  question_link: string;
  // question_file is not needed for display, but you can add if you want
}

export const Forms: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://guru-it.vercel.app/current-assignment", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (data && data.topic) {
          setCurrentAssignment(data);
        } else {
          setCurrentAssignment(null);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        setCurrentAssignment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
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
            <p className="text-gray-800 px-auto"><strong>Date:</strong> {currentAssignment.date}</p>
            <p className="text-gray-800 px-auto"><strong>Time:</strong> {currentAssignment.time}</p>
            <p className="text-gray-800 px-auto"><strong>Question:</strong> {currentAssignment.question_text}</p>
            {currentAssignment.question_link && (
              <p className="text-gray-800 px-auto">
                <strong>Link:</strong> <a href={currentAssignment.question_link} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">View</a>
              </p>
            )}
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