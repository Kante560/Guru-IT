import { useEffect, useState } from "react";
import { useAuth } from "../../_context/AuthContext";
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
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Filter users by name, email, or track
  const filteredUsers = users.filter((user) => {
    const search = filter.trim().toLowerCase();
    if (!search) return true;
    return (
      (user.name?.toLowerCase() || "").includes(search) ||
      (user.email?.toLowerCase() || "").includes(search) ||
      (user.track?.toLowerCase() || "").includes(search)
    );
  });

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto mt-16 sm:mt-20 min-h-[100vh] p-2 sm:p-4">
        <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center">
          Registered Users
        </h2>
        <div className="mb-4 flex items-center justify-center gap-2">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name, email, or track..."
            className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        {loading ? (
          <div className="min-h-[60vh] bg-gray-100 pt-6 sm:pt-10 pb-6 sm:pb-10 font-inter flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-md shadow p-2 sm:p-4 md:p-8 mt-6 sm:mt-12">
              <div className="mb-4 sm:mb-6">
                <div className="h-6 w-32 sm:w-48 bg-gray-200 rounded mb-2 sm:mb-4 animate-pulse"></div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[400px] sm:min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-left font-semibold text-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                        <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                        <div className="h-4 w-12 sm:w-16 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                        <div className="h-4 w-12 sm:w-16 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">
                        <div className="h-4 w-20 sm:w-24 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, idx) => (
                      <tr key={idx} className="text-xs sm:text-sm">
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[60vh] bg-gray-100 pt-6 sm:pt-10 pb-6 sm:pb-10 font-inter flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-md shadow p-2 sm:p-4 md:p-8">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-800">
                  User List
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[400px] sm:min-w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-left font-semibold text-gray-700">
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b w-12">No.</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Name</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Email</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 border-b">Track</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, idx) => (
                      <tr key={`${user.email}-${startIndex + idx}`} className="text-xs sm:text-sm hover:bg-blue-50">
                        <td className="py-2 px-2 sm:px-4 border-b text-gray-600">{startIndex + idx + 1}</td>
                        <td className="py-2 px-2 sm:px-4 border-b break-all">{user.name}</td>
                        <td className="py-2 px-2 sm:px-4 border-b break-all">{user.email}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{user.track}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No users found.
                  </div>
                )}
                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <div className="text-gray-600 text-xs sm:text-sm">
                      Showing <span className="font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</span>-
                      <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalItems}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                      >
                        Prev
                      </button>
                      <span className="text-sm">
                        Page <span className="font-semibold">{safePage}</span> of <span className="font-semibold">{totalPages}</span>
                      </span>
                      <button
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                      >
                        Next
                      </button>
                      <select
                        className="ml-2 border rounded px-2 py-1 text-sm"
                        value={pageSize}
                        onChange={(e) => {
                          const newSize = parseInt(e.target.value, 10);
                          setPageSize(newSize);
                          setCurrentPage(1);
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
            </div>
          </div>
        )}
      </div>
    
    </>
  );
};

export default UsersPage;
