import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";

type CheckInRecord = {
  date: string; // e.g., "2025-06-06"
  status: "approved" | "none";
};

export const CalendarPage = () => {
  const [checkInData, setCheckInData] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    // Example: Only "approved" and "none" statuses
    setCheckInData([
      { date: "2025-06-04", status: "approved" },
      { date: "2025-06-06", status: "none" },
      { date: "2025-06-08", status: "none" },
      { date: "2025-06-10", status: "approved" },
      { date: "2025-06-02", status: "none" },
    ]);
  }, []);

  // 🔹 Convert array into lookup map for fast access
  const recordsMap = useMemo(() => {
    return checkInData.reduce((acc, rec) => {
      acc[rec.date] = rec.status;
      return acc;
    }, {} as Record<string, "approved" | "none">);
  }, [checkInData]);

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      {/* Title */}
      <div className="flex text-3xl items-center justify-center mb-6">
        <h1 className="font-bold text-gray-900">
          YOUR&nbsp;
          <span className="text-blue-900">MONTHLY&nbsp;</span>
          <span className="text-red-600">FEED</span>
        </h1>
      </div>

      {/* Calendar */}
      <div className="[&_.react-calendar]:w-7xl [&_.react-calendar]:border-none items-center justify-center flex flex-col">
        <Calendar
          className="rounded-lg shadow-md w-full"
          tileContent={({ date, view }) => {
            if (view !== "month") return null;
            const formatted = format(date, "yyyy-MM-dd");
            const status = recordsMap[formatted];
            if (!status) return null;

            const color =
              status === "approved" ? "bg-green-500" : "bg-red-500";
            const title =
              status === "approved"
                ? "Present for this day"
                : "Absent for this day";

            return (
              <div
                className={`mt-1 w-2 h-2 mx-auto rounded-full ${color}`}
                title={title}
              />
            );
          }}
          tileClassName={({ date, view }) => {
            // 🔹 Highlight today
            if (
              view === "month" &&
              format(date, "yyyy-MM-dd") ===
                format(new Date(), "yyyy-MM-dd")
            ) {
              return "bg-blue-100 rounded-lg";
            }
            return null;
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center p-4 gap-4 mt-6 text-sm text-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" /> Present
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" /> Absent
        </div>
      </div>

      {/* Empty state */}
      {checkInData.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No attendance records yet.
        </p>
      )}
    </div>
  );
};
  