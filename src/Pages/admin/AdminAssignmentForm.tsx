import React, { useState, useEffect } from "react";
  import { useAuth } from "../../Components/AuthContext";
  import { toast } from "react-toastify";
  import { AdminNav } from "./AdminNav";
  import { Footer } from "../../Components/Footer";
  import { Upload } from "lucide-react";
import UploadButton from "../../ui/Buttons";

  // Assignment form state interface
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

  // Modal form for uploading assignments
 // Modal form for uploading assignments
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
  const { token } = useAuth();
  const [formData, setFormData] = useState<AssignmentForm>({
    track: "Backend-web",
    topic: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().split(" ")[0].slice(0, 5),
    is_group: false,
    group_members: [],
    question_text: "",
    question_link: "",
    question_file: null,
  });

  const [trackUsers, setTrackUsers] = useState<{ email: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});


  // Fetch users when track changes
  useEffect(() => {
    const fetchUsersByTrack = async () => {
      if (!formData.track) return;
      setLoadingUsers(true);

      try {
        const res = await fetch(
          `https://guru-it.vercel.app/admin/users?track=${formData.track}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setTrackUsers(data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setTrackUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsersByTrack();
  }, [formData.track, token]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const input = e.target as HTMLInputElement;
      setFormData((f) => ({
        ...f,
        [name]: input.files ? input.files[0] : null,
      }));
    } else if (name === "is_group") {
      setFormData((f) => ({ ...f, is_group: value === "true" }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  // Handle group members change
  const handleGroupMemberChange = (email: string, checked: boolean) => {
  setFormData((f) => {
    const members = checked
      ? [...f.group_members, email]
      : f.group_members.filter((m) => m !== email);
    return { ...f, group_members: members };
  });
};
  // Validate required fields before submit
  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.topic.trim()) next.topic = "Topic is required";
    if (!formData.date) next.date = "Date is required";
    if (!/^\d{2}:\d{2}$/.test(formData.time)) next.time = "Time must be HH:MM";
    if (formData.is_group && formData.group_members.length === 0) {
      next.group_members = "Select at least one group member";
    }
    const hasQuestion = Boolean(
      (formData.question_text && formData.question_text.trim()) ||
      (formData.question_link && formData.question_link.trim()) ||
      formData.question_file
    );
    if (!hasQuestion) next.question = "Provide question text, link, or upload a file";
    if (formData.question_link && formData.question_link.trim()) {
      try { new URL(formData.question_link); } catch { next.question_link = "Enter a valid URL"; }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const form = new FormData();
    form.append("track", formData.track);
    form.append("topic", formData.topic.trim());
    form.append("date", formData.date);
    form.append("time", formData.time);
    form.append("is_group", formData.is_group.toString());
    form.append("group_members", JSON.stringify(formData.group_members));
    if (formData.question_text) form.append("question_text[]", formData.question_text);
    if (formData.question_link) form.append("question_link[]", formData.question_link);
    if (formData.question_file) form.append("question_file[]", formData.question_file);

    await onSubmit(form);
  };



  if (!isOpen) return null;

  // Modal UI
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            <input
              type="text"
              name="topic"
              onChange={handleChange}
              placeholder="Topic"
              required
              className=" w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded"
            />
            {errors.topic && <p className="text-red-600 text-sm">{errors.topic}</p>}

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded"
            />
            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded"
            />
            {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}

            <select
              name="track"
              value={formData.track}
              onChange={handleChange}
              className="   w-full px-3 py-2 
    border border-gray-300 rounded-md 
    bg-white text-gray-700 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    transition
    text-sm sm:text-basew-full
    max-w-full
    px-3 py-2
    border border-gray-300
    rounded-md
    bg-white text-gray-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition
    text-sm sm:text-base
    truncate"
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
              className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="false">Individual</option>
              <option value="true">Group</option>
            </select>

            {formData.is_group && (
              <div>
                <label className="block font-medium mb-2">Select Group Members</label>
                <input
                  type="text"
                  placeholder="Search by email..."
                  className="w-full border p-2 rounded mb-3"
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                />
                {loadingUsers ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
                    </div>
                ) : (
                  <div className="border rounded p-2 sm:p-3 max-h-40 overflow-y-auto space-y-2">
                    {trackUsers
                      .filter((u) => u.email.toLowerCase().includes(search))
                      .map((u, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                         <input
                         type="checkbox"
                         checked={formData.group_members.includes(u.email)}
                         onChange={(e) => handleGroupMemberChange(u.email, e.target.checked)}
                        />

                          <span>{u.email}</span>
                        </label>
                      ))}

                    {trackUsers.length === 0 && (
                      <p className="text-gray-500">No users found in this track</p>
                    )}
                  </div>
                )}
                {errors.group_members && <p className="text-red-600 text-sm mt-2">{errors.group_members}</p>}
              </div>
            )}


            <textarea
              name="question_text"
              onChange={handleChange}
              placeholder="Question Text"
              className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded"
            />

            <input
              type="text"
              name="question_link"
              placeholder="Question Link"
              onChange={handleChange}
              className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded"
            />
            {errors.question_link && <p className="text-red-600 text-sm">{errors.question_link}</p>}

        {/* File Upload (styled like a dropzone) */}
<div>
  <label className="block font-medium mb-2">Upload File</label>
  <label
    htmlFor="question_file"
    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
  >
     <Upload className="w-8 h-8 mb-2" />
    <p className="text-sm text-gray-500">
      <span className="font-medium text-blue-600">Click to upload</span>
    </p>
    <p className="text-xs text-gray-400">PNG, JPG, PDF (MAX. 10MB)</p>
  </label>
  <input
    id="question_file"
    type="file"
    name="question_file"
    onChange={handleChange}
    className="hidden"
  />
  {errors.question && (
    <p className="text-red-600 text-sm mt-2">{errors.question}</p>
  )}
</div>


            <div className="flex flex-col sm:flex-row justify-end gap-2">
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
  );
};


  // Main assignment upload page
  export const AssignmentUpload = () => {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Submit assignment to backend
    const handleSubmit = async (form: FormData) => {
    try {
      setLoading(true);

      // Fix time formatting
      const time = form.get("time") as string;
      if (time && time.length === 5) {
        form.set("time", `${time}:00`);
      }

      const res = await fetch("https://guru-it.vercel.app/admin/assignments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      console.log("Response status:", res.status);
      console.log("Response body:", await res.text());

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        toast.error(errorText || "Upload failed");
        return;
      }

      toast.success("Assignment uploaded successfully");
      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Upload failed");
      } else {
        toast.error("Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };


    // Page UI
    return (
      <>
        <AdminNav />
        <div className="min-h-screen bg-gray-100 pt-20 font-inter relative">
          {/* Floating "+" button to open modal */}
          <UploadButton setIsOpen={setIsOpen} />
          {/* Modal for assignment upload */}
          <AssignmentModalform
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
        <Footer />
      </>
    );
  };
   