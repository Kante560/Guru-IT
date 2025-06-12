import React, { useState } from "react";
import { AdminNav } from "./AdminNav";
import { useAuth } from "../../Components/AuthContext";
import { toast } from "react-toastify";

interface AssignmentForm {
  track: string;
  topic: string;
  date: string;
  time: string;
  is_group: boolean;
  group_members: string[];
  email: string;
}

const AssignmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentForm) => Promise<void>;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState<AssignmentForm>({
    track: "Backend",
    topic: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].slice(0, 5), // "HH:MM"
    is_group: false,
    group_members: [],
    email: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "is_group") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true"
      }));
    } else if (name === "group_members") {
      setFormData((prev) => ({
        ...prev,
        group_members: value.split(",").map((email) => email.trim())
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Upload Assignment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Track</label>
              <select
                name="track"
                value={formData.track}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Group Project?</label>
              <select
                name="is_group"
                value={formData.is_group.toString()}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            {formData.is_group && (
              <div>
                <label className="block mb-1 font-medium">Group Members</label>
                <input
                  type="text"
                  name="group_members"
                  value={formData.group_members.join(", ")}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  placeholder="Enter emails separated by commas"
                />
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                required
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {loading ? "Uploading..." : "Upload Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Assignments = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (formData: AssignmentForm) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://guru-it.vercel.app/admin/assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload assignment");
      }

      toast.success("Assignment uploaded successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNav />
      <div className="max-w-7xl mx-auto p-6 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Assignments</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Upload New Assignment
          </button>
        </div>

        {/* TODO: Add assignments list/table here */}

        <AssignmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </>
  );
};

export default Assignments;
