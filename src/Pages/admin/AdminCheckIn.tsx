import { useEffect, useState } from "react";
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

const AdminCheckIn = () => {
  const [pendingCheckins, setPendingCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCheckins = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://guru-it.vercel.app/admin/checkins?status=pending",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        let checkinsArr: CheckIn[] = [];
        if (Array.isArray(data)) {
          checkinsArr = data;
        } else if (data && Array.isArray(data.checkins)) {
          checkinsArr = data.checkins;
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
  }, [token]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 font-inter flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 font-inter">
      <AdminNav />
      <div className="max-w-7xl mx-auto p-2 sm:p-6 mt-8 sm:mt-12 w-full">
      <h2 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6">
        Pending Check-Ins
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] w-full bg-white border border-gray-200 shadow rounded-md text-xs sm:text-sm">
        <thead>
          <tr className="bg-blue-100 text-left font-semibold text-gray-700">
          <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Name</th>
          <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Reg. No.</th>
          <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Track</th>
          <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">
            Check-in Time
          </th>
          <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Status</th>
          <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Action</th>
          </tr>
        </thead>  
        <tbody>
          {pendingCheckins.map((checkin) => (
          <tr key={checkin.id} className="text-xs sm:text-sm text-gray-700">
            <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[120px]">{checkin.name}</td>
            <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[100px]">{checkin.reg_no}</td>
            <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[100px]">{checkin.track}</td>
            <td className="py-2 px-2 sm:px-4 border-b break-words max-w-[140px]">{checkin.checkInTime}</td>
            <td className="py-2 px-2 sm:px-4 border-b">
            <span
              className={`${getStatusClasses(
              checkin.status
              )} px-2 py-1 rounded-full text-xs`}
            >
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
        {pendingCheckins.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No pending check-ins found
        </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminCheckIn;
