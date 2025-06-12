import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // required for base calendar layout
import { format } from "date-fns";

type CheckInRecord = {
  date: string; // e.g., "2025-06-06"
  status: "approved" | "none";
};

export const CalendarPage = () => {
  const [checkInData, setCheckInData] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    // Only "approved" and "none" statuses
    setCheckInData([
      { date: "2025-06-04", status: "approved" },
      { date: "2025-06-06", status: "none" },
      { date: "2025-06-08", status: "none" },
      { date: "2025-06-10", status: "approved" },
      { date: "2025-06-02", status: "none" },
      { date: "2025-06-04", status: "approved" },
      // Removed all "pending" entries
    ]);
  }, []);


  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <div className="flex text-3xl  items-center  justify-center mb-6">
        <h1 className="  font-bold text-gray-900  ">
          YOUR&nbsp;
          <span className="text-blue-900 ">MONTHLY&nbsp;</span>
          <span className="text-red-600 ">FEED</span>
        </h1>
      </div>
      <div className="[&_.react-calendar]:w-full [&_.react-calendar]:border-none items-center justify-center flex flex-col">
        <Calendar
          tileContent={({ date, view }) => {
        if (view !== "month") return null;
        const formatted = format(date, "yyyy-MM-dd");
        const record = checkInData.find((r) => r.date === formatted);
        if (!record) return null;

        const color =
          record.status === "approved"
            ? "bg-green-500"
            : "bg-red-500";
        const title =
          record.status === "approved"
            ? "Present for this day"
            : "Absent for this day";

        return (
          <div
            className={`mt-1 w-2 h-2 mx-auto rounded-full ${color}`}
            title={title}
          />
        );
          }}
        />
      </div>

      <div className="flex justify-center items-center p-4 gap-4 mt-6 text-sm text-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" /> Approved
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" /> None
        </div>
      </div>
    </div>
  );
};
