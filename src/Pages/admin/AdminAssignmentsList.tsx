import  { useEffect, useState } from "react";
import { useAuth } from "../../_context/AuthContext";
import { AdminNav } from "./AdminNav";

interface Assignment {
  id: number;
  track: string;
  topic: string;
  question: string;
  allowed_submission_types: string[];
  deadline: string;
  date: string;
  time: string;
  is_group: boolean;
  group_members: string[] | null;
}

const AdminAssignmentsList = () => {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const renderType = (type: string) => {
    // simple url detection (cloudinary or any http(s) url)
    const isUrl = /https?:\/\//i.test(type);
    if (isUrl) {
      return (
        <a href={type} target="_blank" rel="noopener noreferrer" className="bg-gray-200 text-blue-700 px-2 py-1 rounded text-xs underline break-words inline-block">
          {type}
        </a>
      );
    }
    return <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs break-words">{type}</span>;
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://guru-it.vercel.app/admin/assignments?limit=10&offset=0",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setAssignments(data.assignments || []);
      } catch (e) {
        console.error(e);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [token]);

  return (
    <div className="min-h-screen  bg-gray-100 pt-20 font-inter">
      <AdminNav />
      <div className="max-w-7xl mx-auto p-2 sm:p-6 mt-8 sm:mt-12 w-full">
        <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Posted Assignments</h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="animate-spin  rounded-full h-12 w-12 border-t-2 border-b-2  border-blue-900"></div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No assignments Posted yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {assignments.map((a) => (
              <div key={a.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-900 text-lg">{a.topic}</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{a.track}</span>
                </div>
                <div className="text-gray-700 text-sm mb-2 break-words break-all whitespace-pre-wrap">{a.question}</div>
                <div className="flex flex-wrap gap-2 mb-2 relative group">
                  {a.allowed_submission_types.length > 2 ? (
                    <>
                      {a.allowed_submission_types.slice(0, 2).map((type) => (
                        <span key={type} className="inline-block">{renderType(type)}</span>
                      ))}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs cursor-pointer">
                        +{a.allowed_submission_types.length - 2} more
                      </span>
                      <div className="hidden group-hover:block absolute top-full left-0 z-10 bg-white shadow-lg rounded-md p-2 mt-1 max-w-xs break-words">
                        {a.allowed_submission_types.slice(2).map((type) => (
                          <div key={type} className="mb-1">{renderType(type)}</div>
                        ))}
                      </div>
                    </>
                  ) : (
                    a.allowed_submission_types.map((type) => (
                      <span key={type} className="inline-block">{renderType(type)}</span>
                    ))
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 gap-1">
                  <span className="break-words">Deadline: {a.deadline}</span>
                  <span className="break-words">{a.date}</span>
                  <span className="break-words">Time of deadline: {a.time}</span>
                </div>
                <div className="mt-2 text-xs">
                  <span className="font-semibold">Group:</span> {a.is_group ? "Yes" : "No"}
                </div>
                {a.group_members && (
                  <div className="mt-1 text-xs">
                    <span className="font-semibold">Member:</span> {a.group_members.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
    </div>
  );
};

export default AdminAssignmentsList;
