import { useEffect, useState } from "react";
import { Nav } from "../Components/Nav";
import { Footer } from "../Components/Footer";
import { useAuth } from "../Components/AuthContext";
import { toast } from "react-toastify";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

interface CheckInState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  currentTime: string;
  elapsedTime: string;
  status: "pending" | "approved" | "none";
}

const STORAGE_KEY = "checkInState";

const defaultState: CheckInState = {
  isCheckedIn: false,
  checkInTime: null,
  currentTime: new Date().toLocaleTimeString(),
  elapsedTime: "0 hrs 0 mins",
  status: "none",
};

export const CheckInOut = () => {
  const { token, user } = useAuth();

  // 🔹 Lazy init from localStorage (prevents losing state on refresh)
  const [checkInState, setCheckInState] = useState<CheckInState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CheckInState>;
        const checkInTime = parsed.checkInTime ?? null;

        // Optional: reset if saved check-in was on a previous day
        const sameDay =
          checkInTime &&
          new Date(checkInTime).toDateString() === new Date().toDateString();

        if (sameDay) {
          return {
            isCheckedIn: !!parsed.isCheckedIn,
            checkInTime,
            currentTime: new Date().toLocaleTimeString(),
            elapsedTime: checkInTime ? calculateElapsedTime(checkInTime) : "0 hrs 0 mins",
            status: (parsed.status as CheckInState["status"]) || "none",
          };
        }
      }
    } catch (e) {
      console.error("Failed to read saved check-in state:", e);
    }
    return defaultState;
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Persist ONLY stable fields (not currentTime/elapsedTime) to avoid writes every second
  useEffect(() => {
    const toSave = {
      isCheckedIn: checkInState.isCheckedIn,
      checkInTime: checkInState.checkInTime,
      status: checkInState.status,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [checkInState.isCheckedIn, checkInState.checkInTime, checkInState.status]);

  // Live clock + elapsed time (does not touch persistent fields)
  useEffect(() => {
    const timer = setInterval(() => {
      setCheckInState((prev) => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString(),
        elapsedTime: prev.checkInTime
          ? calculateElapsedTime(prev.checkInTime)
          : "0 hrs 0 mins",
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateElapsedTime(checkInTime: string): string {
    const start = new Date(checkInTime).getTime();
    const now = Date.now();
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hrs ${minutes} mins`;
  }

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://guru-it.vercel.app/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          checkInTime: new Date().toISOString(),
          name: user?.name,
          reg_no: user?.reg_no,
          track: user?.track,
          status: "pending",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || "Check-in failed");
      }

      const data = await response.json().catch(() => ({}));

      // Short-term: mark approved locally so user can try checkout
      const checkInTime = data.checkInTime || new Date().toISOString();
      setCheckInState((prev) => ({
        ...prev,
        isCheckedIn: true,
        checkInTime,
        status: "approved",
        // currentTime/elapsedTime auto-update via timer
      }));

      toast.success("Checked in successfully! You can now check out.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An unexpected error occurred";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://guru-it.vercel.app/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        let errMessage: string;
        try {
          const errJson = await response.json();
          errMessage = errJson.error || JSON.stringify(errJson);
        } catch {
          errMessage = await response.text();
        }
        console.error("Error response:", errMessage);
        toast.error(errMessage);
        return;
      }

      // Success: clear state + storage
      setCheckInState(defaultState);
      localStorage.removeItem(STORAGE_KEY);

      toast.success("Checked out successfully!");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An unexpected error occurred";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white mt-20 p-6">
        <h1 className="text-3xl font-extrabold mb-10 text-center text-blue-900 tracking-tight drop-shadow">
          Check In / Out
        </h1>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 max-w-2xl gap-10">
            {/* Only show Check-In card if NOT checked in */}
            {!checkInState.isCheckedIn && (
              <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <FaSignInAlt className="text-blue-700 text-2xl" />
                  <h2 className="text-xl font-bold text-blue-700">Check In</h2>
                </div>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    disabled
                    value={user?.track || "N/A"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                  />
                  <input
                    disabled
                    value={new Date().toLocaleDateString()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                  />
                  <input
                    disabled
                    value={checkInState.currentTime}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
                  />
                  <input
                    disabled
                    value={
                      checkInState.isCheckedIn
                        ? `Checked In (${checkInState.status})`
                        : "Not Checked In"
                    }
                    className={`w-full px-4 py-3 border rounded-lg transition-all ${
                      checkInState.isCheckedIn
                        ? checkInState.status === "approved"
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "bg-yellow-50 border-yellow-300 text-yellow-700"
                        : "bg-gray-50 border-gray-300 text-gray-500"
                    }`}
                  />
                  <button
                    onClick={handleCheckIn}
                    disabled={checkInState.isCheckedIn || loading}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                      checkInState.isCheckedIn
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-900 hover:bg-blue-950 active:scale-95"
                    } text-white shadow hover:shadow-lg`}
                  >
                    <FaSignInAlt />
                    {loading ? "Processing..." : "Submit Check-In"}
                  </button>
                </form>
              </div>
            )}

            {/* Only show Check-Out card if checked in */}
            {checkInState.isCheckedIn && (
              <div className="bg-red-50 border border-red-200 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <FaSignOutAlt className="text-red-700 text-2xl" />
                  <h2 className="text-xl font-bold text-red-700">Check Out</h2>
                </div>
                <div className="text-gray-700 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Checked In At:</span>
                    <span className="text-blue-900 font-mono">
                      {checkInState.checkInTime
                        ? new Date(checkInState.checkInTime).toLocaleTimeString()
                        : "Not checked in"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Current Time:</span>
                    <span className="text-blue-900 font-mono">{checkInState.currentTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Total Time Signed In:</span>
                    <span className="text-red-700 font-mono">{checkInState.elapsedTime}</span>
                  </div>
                  <button
                    onClick={handleCheckOut}
                    disabled={!checkInState.isCheckedIn || loading}
                    className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                      !checkInState.isCheckedIn
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 active:scale-95"
                    } text-white shadow hover:shadow-lg mt-4`}
                  >
                    <FaSignOutAlt />
                    {loading ? "Processing..." : "Submit Check-Out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
