import  { useEffect, useState } from "react";
import { Nav } from "./Nav";
import { Footer } from "../Components/Footer";
import { useAuth } from "../Components/AuthContext";
import { toast } from "react-toastify";

interface CheckInState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  currentTime: string;
  elapsedTime: string;
  userDetails?: {
    name: string;
    reg_no: string;
    track: string;
  }
}

export const CheckInOut = () => {
  const { token, user } = useAuth();
  const [checkInState, setCheckInState] = useState<CheckInState>({
    isCheckedIn: false,
    checkInTime: null,
    currentTime: new Date().toLocaleTimeString(),
    elapsedTime: '0 hrs 0 mins'
  });

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCheckInState(prev => ({
        ...prev,
        currentTime: new Date().toLocaleTimeString(),
        elapsedTime: prev.checkInTime ? calculateElapsedTime(prev.checkInTime) : '0 hrs 0 mins'
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateElapsedTime = (checkInTime: string): string => {
    const start = new Date(checkInTime).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours} hrs ${minutes} mins`;
  };

  const handleCheckIn = async () => {
    try {
      const response = await fetch('https://guru-it.vercel.app/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          checkInTime: new Date().toISOString(),
          name: user?.name,
          reg_no: user?.reg_no,
          track: user?.track,
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error('Check-in failed');

      setCheckInState(prev => ({
        ...prev,
        isCheckedIn: true,
        checkInTime: new Date().toISOString(),
        userDetails: {
          name: user?.name || '',
          reg_no: user?.reg_no || '',
          track: user?.track || ''
        }
      }));
      toast.success('Checked in successfully!');
    } catch (error) {
      toast.error('Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const response = await fetch('https://guru-it.vercel.app/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          checkOutTime: new Date().toISOString(),
          totalTime: checkInState.elapsedTime
        })
      });

      if (!response.ok) throw new Error('Check-out failed');

      setCheckInState({
        isCheckedIn: false,
        checkInTime: null,
        currentTime: new Date().toLocaleTimeString(),
        elapsedTime: '0 hrs 0 mins'
      });
      toast.success('Checked out successfully!');
    } catch (error) {
      console.error('Failed to check out');
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white mt-20 p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Check In / Out</h1>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 max-w-7xl md:grid-cols-2 gap-6">
            {/* Check-in Form */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-blue-700 mb-4">Check In</h2>
              <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                <input disabled value="Frontend" className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700" />
                <input disabled value={new Date().toLocaleDateString()} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700" />
                <input disabled value={checkInState.currentTime} className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-700" />
                <input disabled value={checkInState.isCheckedIn ? 'Checked In' : 'Pending'} className={`w-full px-3 py-2 border rounded ${checkInState.isCheckedIn ? 'bg-green-50 border-green-300 text-green-700' : 'bg-yellow-50 border-blue-300 text-blue-700'}`} />
                <button 
                  onClick={handleCheckIn}
                  disabled={checkInState.isCheckedIn}
                  className={`w-full py-2 rounded ${checkInState.isCheckedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-950'} text-white`}
                >
                  Submit Check-In
                </button>
              </form>
            </div>

            {/* Check-out View */}
            <div className="bg-red-50 border border-red-200 p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-red-700 mb-4">Check Out</h2>
              <div className="text-gray-700 space-y-2">
                <p><strong>Checked In At:</strong> {checkInState.checkInTime ? new Date(checkInState.checkInTime).toLocaleTimeString() : 'Not checked in'}</p>
                <p><strong>Current Time:</strong> {checkInState.currentTime}</p>
                <p><strong>Total Time Signed In:</strong> {checkInState.elapsedTime}</p>
                <button 
                  onClick={handleCheckOut}
                  disabled={!checkInState.isCheckedIn}
                  className={`w-full py-2 rounded ${!checkInState.isCheckedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white`}
                >
                  Submit Check-Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};