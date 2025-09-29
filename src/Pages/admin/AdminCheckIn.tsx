import { useEffect, useMemo, useState } from "react";
import { AdminNav } from "./AdminNav";
import { useAuth } from "../../_context/AuthContext";
import { toast } from "react-toastify";

interface CheckIn {
  id: number;
  name: string;
  reg_no: string;
  track: string;
  created_at: string;
  checkInTime?: string;
  status: string;
}

interface AttendanceItem {
  id: number;
  name: string;
  email?: string;
  reg_no?: string;
  track: string;
  date: string; // YYYY-MM-DD
}

const AdminCheckIn = () => {
  const [pendingCheckins, setPendingCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "attendance">("pending");
  // Pagination for pending check-ins
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPageSize, setPendingPageSize] = useState(10);

  // Attendance state
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [attendanceDate, setAttendanceDate] = useState<string>(today);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCheckins = async () => {
      setLoading(true);
      try {
        const offset = (pendingPage - 1) * pendingPageSize;
        const url = `https://guru-it.vercel.app/admin/checkins?status=pending&limit=${pendingPageSize}&offset=${offset}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        let checkinsArr: CheckIn[] = [];
        if (Array.isArray(data)) {
          checkinsArr = data as CheckIn[];
        } else if (data && Array.isArray(data.checkins)) {
          checkinsArr = data.checkins as CheckIn[];
        }

        const formattedCheckins = checkinsArr.map((checkin: CheckIn) => ({
          id: checkin.id,
          name: checkin.name,
          reg_no: checkin.reg_no,
          track: checkin.track,
          created_at: checkin.created_at,
          checkInTime: new Date(checkin.created_at).toLocaleString(),
          status: checkin.status || "pending",
        }));

        setPendingCheckins(formattedCheckins);
      } catch (error) {
        toast.error("Failed to fetch check-ins");
        setPendingCheckins([]);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckins();
  }, [token, pendingPage, pendingPageSize]);

  // Fetch daily attendance when the tab is active or date changes
  useEffect(() => {
    if (activeTab !== "attendance") return;
    if (!attendanceDate) return;
    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const url = `https://guru-it.vercel.app/admin/attendance?date=${encodeURIComponent(attendanceDate)}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Failed to fetch attendance");
        }
        const data = await res.json();
        let items: AttendanceItem[] = [];
        if (Array.isArray(data)) {
          items = data as AttendanceItem[];
        } else if (data && Array.isArray(data.attendance)) {
          items = data.attendance as AttendanceItem[];
        }
        // Normalize fields
        const normalized = (items || []).map((x: any) => ({
          id: Number(x.id ?? x.user_id ?? x.reg_no ?? Math.random()),
          name: String(x.name || "Unknown"),
          email: x.email || undefined,
          reg_no: x.reg_no || undefined,
          track: String(x.track || ""),
          date: String(x.date || attendanceDate),
        }));
        setAttendance(normalized);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Failed to fetch attendance");
        setAttendance([]);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [activeTab, attendanceDate, token]);

  const handleDownloadAttendance = async () => {
    try {
      const url = `https://guru-it.vercel.app/admin/attendance/csv`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to download CSV");
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `attendance_${attendanceDate}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      toast.error(e?.message || "Download failed");
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    console.log("Updating check-in:", id, "with status:", status);

    try {
      const response = await fetch(
        `https://guru-it.vercel.app/admin/checkin/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(`Failed to update check-in to ${status}`);
      }

      toast.success(
        `Check-in ${status === "approved" ? "approved" : "rejected"} successfully`
      );

      // Remove from pending list after update
      setPendingCheckins((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      toast.error("Failed to update check-in");
      console.error("Error:", error);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-yellow-200 text-yellow-800";
    }
  };

  // Filter checkins by name or track
  const filteredCheckins = pendingCheckins.filter((checkin) => {
    const search = filter.trim().toLowerCase();
    if (!search) return true;
    return (
      (checkin.name?.toLowerCase() || "").includes(search) ||
      (checkin.track?.toLowerCase() || "").includes(search)
    );
  });

  // Pagination helpers for pending section (server-driven)
  const safePendingPage = Math.max(1, pendingPage);
  const pendingStartIndex = (safePendingPage - 1) * pendingPageSize;
  const hasNextPending = pendingCheckins.length === pendingPageSize; // heuristic when total is unknown

  return (
    <div className="min-h-screen bg-gray-100 pt-20 font-inter">
      <AdminNav />
      <div className="max-w-7xl mx-auto p-2 sm:p-6 mt-8 sm:mt-12 w-full">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "pending" ? "bg-white border border-b-0" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Check-Ins
          </button>
          <button
            className={`px-4 py-2 rounded-t ${
              activeTab === "attendance" ? "bg-white border border-b-0" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            Daily Attendance
          </button>
        </div>

        {activeTab === "pending" && (
          <>
            <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6">Pending Check-Ins</h2>
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name or track..."
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            {loading ? (
              <div className="flex justify-center items-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-[700px] w-full bg-white border border-gray-200 shadow rounded-md text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-left font-semibold text-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b w-12">No.</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Name</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Track</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Check-in Time</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Status</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCheckins.map((checkin, idx) => (
                      <tr key={checkin.id} className="text-xs sm:text-sm text-gray-700">
                        <td className="py-2 px-2 sm:px-4 border-b text-gray-600">{pendingStartIndex + idx + 1}</td>
                        <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[120px]">{checkin.name}</td>
                        <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[100px]">{checkin.track}</td>
                        <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[140px]">{checkin.checkInTime}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <span className={`${getStatusClasses(checkin.status)} px-2 py-1 rounded-full text-xs`}>
                            {checkin.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleUpdateStatus(checkin.id, "approved")}
                              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(checkin.id, "rejected")}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCheckins.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No pending check-ins found</div>
                )}
                {filteredCheckins.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Showing <span className="font-semibold">{filteredCheckins.length === 0 ? 0 : pendingStartIndex + 1}</span>-<span className="font-semibold">{pendingStartIndex + filteredCheckins.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
                        disabled={safePendingPage === 1}
                      >
                        Prev
                      </button>
                      <span className="text-sm">
                        Page <span className="font-semibold">{safePendingPage}</span>
                      </span>
                      <button
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => setPendingPage((p) => p + 1)}
                        disabled={!hasNextPending}
                      >
                        Next
                      </button>
                      <select
                        className="ml-2 border rounded px-2 py-1 text-sm"
                        value={pendingPageSize}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value, 10);
                          setPendingPageSize(newSize);
                          setPendingPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "attendance" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex-1"></div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadAttendance}
                  className="bg-blue-900 hover:bg-blue-950 text-white px-4 py-2 rounded shadow"
                >
                  Download CSV
                </button>
              </div>
            </div>

            {attendanceLoading ? (
              <div className="flex justify-center items-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-[700px] w-full bg-white border border-gray-200 shadow rounded-md text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-left font-semibold text-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Name</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Email</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Reg No</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Track</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a) => (
                      <tr key={`${a.id}-${a.date}`} className="text-xs sm:text-sm text-gray-700">
                        <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[160px]">{a.name}</td>
                        <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[200px]">{a.email || "-"}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{a.reg_no || "-"}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{a.track}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attendance.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No attendance found for this date</div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCheckIn;
