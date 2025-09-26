import { Link } from "react-router-dom";


const CheckinInfo = () => {
  return (
    <div className="bg-white/80 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <h2 className="text-xl font-bold text-blue-900 mb-2">Haven't checked in yet?</h2>
      <p className="text-gray-700 mb-4">Check in now to record your attendance for today and stay on track with your progress.</p>
      <Link
        to="/checkinout"
        className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-800 transition active:scale-95"
      >
        Check-In Now
      </Link>
    </div>
  );
}

export default CheckinInfo
