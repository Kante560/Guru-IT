import React, { useState, useEffect } from "react";
import { AssignmentModal } from "./InternAssignment";
import { useAuth } from "../_context/AuthContext";
import { Mail, FileDown } from "lucide-react";
import { format } from "date-fns";

// Match backend payload (normalized to this shape for UI)
interface Assignment {
  track: string;
  topic: string;
  date: string; // "2025-06-20" or ISO
  time: string; // "10:00:00"
  is_group: boolean;
  group_members: string[];
  question_text: string;
  question_link?: string;
  question_file?: string;
}

export const Forms: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Define a type for the backend assignment payload
  type BackendAssignment = {
    assignment?: {
      track?: string;
      topic?: string;
      date?: string;
      time?: string;
      is_group?: boolean;
      group_members?: string[] | string;
      question?: string;
      question_text?: string;
      question_link?: string;
      question_file?: string;
    };
    track?: string;
    topic?: string;
    date?: string;
    time?: string;
    is_group?: boolean;
    group_members?: string[] | string;
    question?: string;
    question_text?: string;
    question_link?: string;
    question_file?: string;
  };

  // Normalize whatever the backend returns into our Assignment shape
  const normalizeAssignment = (raw: unknown): Assignment => {
    // backend may return { assignment: { ... } } or the object directly
    const src = (raw as BackendAssignment)?.assignment ?? (raw as BackendAssignment);

    // pick question fields (backend might return single `question` link/file)
    const rawQuestion = src.question ?? src.question_text ?? src.question_link ?? "";
    let question_text = src.question_text ?? "";
    let question_link: string | undefined = src.question_link ?? undefined;
    let question_file: string | undefined = src.question_file ?? undefined;

    if (typeof rawQuestion === "string" && rawQuestion) {
      if (rawQuestion.startsWith("http")) {
        // treat as link/file
        question_link = question_link ?? rawQuestion;
        question_file = question_file ?? rawQuestion;
      } else {
        // treat as plain text
        question_text = question_text || rawQuestion;
      }
    }

    const group_members: string[] = Array.isArray(src.group_members)
      ? src.group_members
      : src.group_members
      ? [String(src.group_members)]
      : [];

    return {
      track: src.track ?? "",
      topic: src.topic ?? "",
      date: src.date ?? "",
      time: src.time ?? "",
      is_group: Boolean(src.is_group),  
      group_members,
      question_text: question_text ?? "",
      question_link,
      question_file,
    };
  };

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          setError("You are not authenticated. Please login.");
          setCurrentAssignment(null);
          return;
        }

        const res = await fetch("https://guru-it.vercel.app/current-assignment", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });


        if (!res.ok) {
          // try to show backend message if present
          let msg = `Failed to fetch assignment (status ${res.status})`;
          try {
            const txt = await res.text();
            if (txt) {
              // backend might return JSON or plain text
              try {
                const j = JSON.parse(txt);
                msg = j.error || j.message || JSON.stringify(j);
              } catch {
                msg = txt;
              }
            }
          } catch {
            // ignore
          }
          throw new Error(msg);
        }

        const data = await res.json();

        // Normalize and set assignment if present
        if (data && (data.assignment || data.topic || data.track)) {
          const normalized = normalizeAssignment(data);
          setCurrentAssignment(normalized);
        } else {
          setCurrentAssignment(null);
        }
      } catch (err: unknown) {
        console.error("Error fetching assignment:", err);
        setError((err as Error)?.message ?? "Unable to load assignment. Please try again later.");
        setCurrentAssignment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [token]);

  const safeFormatDate = (d: string) => {
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d || "—";
      return format(dt, "MMMM dd, yyyy");
    } catch {
      return d || "—";
    }
  };

  const safeFormatTime = (t: string) => {
    if (!t) return "—";
    // backend gives "HH:mm:ss"; show "HH:mm"
    return t.length >= 5 ? t.slice(0, 5) : t;
  };

  return (
    <div className="py-5 px-6 md:px-16 text-black w-7xl">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg min-h-[30vh] flex items-center justify-between flex-col p-6 border-l-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl border-blue-900">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">📌 Current Assignment</h2>

        {loading ? (
          <p>Loading assignment...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : currentAssignment ? (
          <>
            <p className="text-gray-800"><strong>Topic:</strong> {currentAssignment.topic}</p>
            <p className="text-gray-800"><strong>Track:</strong> {currentAssignment.track}</p>
            <p className="text-gray-800">
              <strong>Date:</strong> {safeFormatDate(currentAssignment.date)}
            </p>
            <p className="text-gray-800">
              <strong>Time:</strong> {safeFormatTime(currentAssignment.time)}
            </p>

            {currentAssignment.question_text && (
              <p className="text-gray-800"><strong>Question:</strong> {currentAssignment.question_text}</p>
            )}

            {currentAssignment.question_link && (
              <p className="text-gray-800">
                <strong>Link:</strong>{" "}
                <a
                  href={currentAssignment.question_link}
                  className="text-blue-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </p>
            )}

            {currentAssignment.question_file && (
              <a
                href={currentAssignment.question_file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 text-blue-700 hover:text-blue-900"
              >
                <FileDown size={18} /> Download Question File
              </a>
            )}
          </>
        ) : (
          <>
            <Mail className="h-10 w-10 text-[#1D3A8A]" />
            <p>You don't have any assignment from your instructor at the moment.</p>
          </>
        )}

        <button
          className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-[10px] hover:bg-blue-950 transition"
          onClick={() => setModalOpen(true)}
          aria-label="Submit Assignment"
        >
          Submit Assignment
        </button>
      </div>

      <AssignmentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
