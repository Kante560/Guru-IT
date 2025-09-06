import React, { useState, useEffect } from "react";
  import { useAuth } from "../../Components/AuthContext";
  import { toast } from "react-toastify";
  import { AdminNav } from "./AdminNav";
  import { Footer } from "../../Components/Footer";
  import UploadButton from "../../ui/Buttons"


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


  // Handle form submission
  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const form = new FormData();
  form.append("track", formData.track);
  form.append("topic", formData.topic);
  form.append("date", formData.date);
  form.append("time", formData.time);
  form.append("is_group", formData.is_group.toString());
  form.append("group_members", JSON.stringify(formData.group_members));
  if (formData.question_text) {
    form.append("question_text[]", formData.question_text); 
  }
  if (formData.question_link) {
    form.append("question_link[]", formData.question_link);
  }
  if (formData.question_file) {
    form.append("question_file[]", formData.question_file);
  }

  await onSubmit(form);
};



  if (!isOpen) return null;

  // Modal UI
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
              <div>
                <label className="block font-medium mb-2">Select Group Members</label>
                <input
                  type="text"
                  placeholder="Search by email..."
                  className="w-full border p-2 rounded mb-3"
                  onChange={(e) => setSearch(e.target.value.toLowerCase())}
                />
                {loadingUsers ? (
                  <p className="text-gray-500">Loading users...</p>
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
              </div>
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


<UploadButton setIsOpen={setIsOpen}/>


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
   