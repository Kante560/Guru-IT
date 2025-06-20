import { useEffect, useState } from "react";
import { AdminNav } from "./AdminNav";
import { useAuth } from "../../Components/AuthContext";
import { toast } from "react-toastify";

interface CheckIn {
  id: number;
  name: string;
  reg_no: string;
  track: string;
  checkInTime: string;
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
        const response = await fetch("https://guru-it.vercel.app/admin/checkins?status=pending", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await response.json();

        let checkinsArr = [];
        if (Array.isArray(data)) {
          checkinsArr = data;
        } else if (data && Array.isArray(data.checkins)) {
          checkinsArr = data.checkins;
        }

        const formattedCheckins = checkinsArr.map((checkin: any) => ({
          id: checkin.id,
          name: checkin.name,
          reg_no: checkin.reg_no,
          track: checkin.track,
          checkInTime: new Date(checkin.created_at).toLocaleString(),
          status: checkin.status || "Pending",
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

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`https://guru-it.vercel.app/admin/checkin/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: "checked-in" })
      });

      if (!response.ok) {
        throw new Error('Failed to approve check-in');
      }

      toast.success('Check-in approved successfully');
      // Refresh the list after approval
      setLoading(true);
      const res = await fetch("https://guru-it.vercel.app/admin/checkins?status=pending", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      let checkinsArr = [];
      if (Array.isArray(data)) {
        checkinsArr = data;
      } else if (data && Array.isArray(data.checkins)) {
        checkinsArr = data.checkins;
      }
      const formattedCheckins = checkinsArr.map((checkin: any) => ({
        id: checkin.id,
        name: checkin.name,
        reg_no: checkin.reg_no,
        track: checkin.track,
        checkInTime: new Date(checkin.created_at).toLocaleString(),
        status: checkin.status || "Pending",
      }));
      setPendingCheckins(formattedCheckins);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to approve check-in');
      console.error('Error:', error);
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
      <div className="max-w-7xl mx-auto p-6 mt-12">
        <h2 className="text-2xl font-semibold mb-6">Pending Check-Ins</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow rounded-md">
            <thead>
              <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Reg. No.</th>
                <th className="py-3 px-4 border-b">Track</th>
                <th className="py-3 px-4 border-b">Check-in Time</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingCheckins.map((checkin) => (
                <tr key={checkin.id} className="text-sm text-gray-700">
                  <td className="py-2 px-4 border-b">{checkin.name}</td>
                  <td className="py-2 px-4 border-b">{checkin.reg_no}</td>
                  <td className="py-2 px-4 border-b">{checkin.track}</td>
                  <td className="py-2 px-4 border-b">{checkin.checkInTime}</td>
                  <td className="py-2 px-4 border-b">
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      {checkin.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      onClick={() => handleApprove(checkin.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                    >
                      Approve
                    </button>
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
