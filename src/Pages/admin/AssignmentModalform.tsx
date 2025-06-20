import React, { useState } from "react";
import { useAuth } from "../../Components/AuthContext";
import { toast } from "react-toastify";
import { AdminNav } from "./AdminNav";
import { Footer }  from "../../Components/Footer";

interface AssignmentForm {
  track: string;
  topic: string;
  date: string;
  time: string;
  is_group: boolean;
  group_members: string[];
  question_text: string;
  question_link: string;
  question_file: File | null;
}

const AssignmentModalform = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState<AssignmentForm>({
    track: "Backend",
    topic: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].slice(0, 5),
    is_group: false,
    group_members: [],
    question_text: "",
    question_link: "",
    question_file: null,
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((f) => ({ ...f, [name]: files[0] }));
    } else if (name === "is_group") {
      setFormData((f) => ({ ...f, is_group: value === "true" }));
    } else if (name === "group_members") {
      setFormData((f) => ({ ...f, group_members: value.split(",") }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("track", formData.track);
    form.append("topic", formData.topic);
    form.append("date", formData.date);
    form.append("time", formData.time);
    form.append("is_group", formData.is_group.toString());
    form.append("group_members", JSON.stringify(formData.group_members));
    form.append("question_text", formData.question_text);
    form.append("question_link", formData.question_link);
    if (formData.question_file) {
      form.append("question_file", formData.question_file);
    }

    await onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <>
      <AdminNav />
      <div className="fixed inset-0 backdrop-blur-sm  bg-[000000160] bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Upload Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="topic"
                onChange={handleChange}
                placeholder="Topic"
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <select
                name="track"
                value={formData.track}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="Backend-mobile">Backend-mobile</option>
                <option value="Backend-web">Backend-web</option>
                <option value="Frontend-web">Frontend-web</option>
                <option value="Frontend-mobile">Frontend-mobile</option>
                <option value="UIUX">UIUX</option>
              </select>
              <select
                name="is_group"
                value={formData.is_group.toString()}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="false">Individual</option>
                <option value="true">Group</option>
              </select>
              {formData.is_group && (
                <input
                  type="text"
                  name="group_members"
                  placeholder="Comma-separated emails"
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              )}
              <textarea
                name="question_text"
                onChange={handleChange}
                placeholder="Question Text"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="question_link"
                placeholder="Question Link"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="file"
                name="question_file"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export const AssignmentUpload = () => {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form: FormData) => {
    try {
      setLoading(true);
      const res = await fetch("https://guru-it.vercel.app/admin/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error("Failed to upload assignment");
      }

      toast.success("Assignment uploaded successfully");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <AdminNav />
     <div className="min-h-screen rounded-full bg-gray-100 pt-20 font-inter">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-700 text-white h-15 w-15 fixed ml-230 mt-110 px-4 rounded-full  py-2  shadow-lg hover:bg-blue-800 transition duration-300 ease-in-out z-50"
      >
       +
      </button>
      </div>
      <AssignmentModalform
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
      />
      <Footer />
    </>
  );
};
