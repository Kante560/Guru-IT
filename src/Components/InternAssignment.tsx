import React, { useState } from "react";


export const AssignmentModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  if (!open) return null;
  const [isGroup, setIsGroup] = useState<boolean | undefined>(undefined);
  const [ topic, setTopic] = useState("");
  const [ email, setEmail] = useState("");
  const [ groupMembers, setGroupMembers] = useState("");
  const [ link, setLink] = useState("");
  const [ file, setFile] = useState<File | null>(null);
  const [ errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!topic.trim()) next.topic = "Topic is required";
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email";
    }
    if (isGroup && !groupMembers.trim()) next.groupMembers = "Enter group members";
    const hasQuestion = Boolean(link.trim() || file);
    if (!hasQuestion) next.question = "Provide a link or upload a file";
    if (link.trim()) {
      try { new URL(link); } catch { next.link = "Enter a valid URL"; }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // You can wire this to parent callback if needed in future
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#00000060] bg-opacity-40 p-2 sm:p-4">
      <div className="bg-white p-6 sm:p-7 md:p-8 rounded-lg shadow-lg max-w-xl md:max-w-2xl w-full space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center text-blue-900">Submit Assignment</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Track</label>
            <input type="text" value="Frontend" readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:shadow-sm focus:shadow-blue-500" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Topic</label>
            <input value={topic} onChange={(e)=>setTopic(e.target.value)} type="text" placeholder="Assignment Topic" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
            {errors.topic && <p className="text-red-600 text-sm">{errors.topic}</p>}
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Date</label>
            <input type="text" value={new Date().toLocaleDateString()} readOnly className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded bg-gray-100" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Time</label>
            <input type="text" value={new Date().toLocaleTimeString()} readOnly className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded bg-gray-100" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Your Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="example@domain.com" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isGroup"
              className="cursor-pointer"
              checked={isGroup}
              onChange={(e) => setIsGroup(e.target.checked)}
            />
            <label htmlFor="isGroup" className="text-sm font-medium">Group Submission</label>
          </div>
          {isGroup && (
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium">Group Members' Names</label>
              <input value={groupMembers} onChange={(e)=>setGroupMembers(e.target.value)} type="text" placeholder="Enter names separated by commas" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
              {errors.groupMembers && <p className="text-red-600 text-sm">{errors.groupMembers}</p>}
            </div>
          )}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">File Upload or Link</label>
            <input value={link} onChange={(e)=>setLink(e.target.value)} type="text" placeholder="Paste link or upload file below" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
            {errors.link && <p className="text-red-600 text-sm">{errors.link}</p>}
            <input onChange={(e)=>setFile(e.target.files?.[0] ?? null)} type="file" className="mt-2 cursor-pointer" />
            {errors.question && <p className="text-red-600 text-sm">{errors.question}</p>}
          </div>
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-950">
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
};
