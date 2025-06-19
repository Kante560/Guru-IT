import { useEffect, useState } from "react";
import { useAuth } from "../../Components/AuthContext";
import { toast } from "react-toastify";
import { Footer } from "../../Components/Footer";
import { AdminNav } from "./AdminNav";

interface User {
  name: string;
  email: string;

  track: string;
}

const UsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug: Log the token to verify if it's present
  useEffect(() => {
    console.log("Auth token:", token);
  }, [token]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://guru-it.vercel.app/admin/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // if (!response.ok) {
        //   const errorText = await response.text();
        //   toast.error(`Failed to fetch users: ${errorText}`);
        //   setUsers([]);
        //   return;
        // }
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto mt-20 min-h-[100vh] p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Registered Users</h2>
        {loading ? (
          <div className="min-h-[60vh] bg-gray-100 pt-10 pb-10 font-inter flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-md shadow p-8 mt-12">
          <div className="mb-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
          <thead>
            <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
              <th className="py-3 px-4 border-b">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="py-3 px-4 border-b">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </th>
              <th className="py-3 px-4 border-b">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr key={idx} className="text-sm">
            <td className="py-2 px-4 border-b">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-2 px-4 border-b">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td className="py-2 px-4 border-b">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
            </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>
          </div>
        ) : (
          <div className="min-h-[60vh] bg-gray-100 pt-10 pb-10 font-inter flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-md shadow p-8 ">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">User List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
          <thead>
            <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Track</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx} className="text-sm hover:bg-blue-50">
            <td className="py-2 px-4 border-b">{user.name}</td>
            <td className="py-2 px-4 border-b">{user.email}</td>
            <td className="py-2 px-4 border-b">{user.track}</td>
              </tr>
            ))}
          </tbody>
            </table>
            {users.length === 0 && (
          <div className="text-center text-gray-500 py-8">No users found.</div>
            )}
          </div>
        </div>
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default UsersPage;
