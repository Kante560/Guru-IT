import React, { useState } from "react";


export const AssignmentModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  if (!open) return null;
  const [isGroup, setIsGroup] = useState<boolean | undefined>(undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#00000060] bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center text-blue-900">Submit Assignment</h2>
        <form className="space-y-3">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Track</label>
            <input type="text" value="Frontend" readOnly className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none focus:shadow-sm focus:shadow-blue-500" />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Topic</label>
            <input type="text" placeholder="Assignment Topic" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
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
            <input type="email" placeholder="example@domain.com" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
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
              <input type="text" placeholder="Enter names separated by commas" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
            </div>
          )}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium">File Upload or Link</label>
            <input type="text" placeholder="Paste link or upload file below" className="w-full focus:outline-none focus:shadow-sm focus:shadow-blue-500 px-3 py-2 border border-gray-300 rounded" />
            <input type="file" className="mt-2 cursor-pointer" />
          </div>
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-950">
            Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
};
