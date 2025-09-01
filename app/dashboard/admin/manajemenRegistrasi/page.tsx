//app/dashboard/admin/manajemenRegistrasi/page.tsx
"use client";

import { useEffect, useState } from "react";

import SidebarUniversal from "@/components/layout/SidebarUniversal";

interface User {
  id?: number;
  email: string;
  username: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  id_pengenal: string;
  requested_role_id?: number | null;
  requested_role_name?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
}

export default function RegistrasiPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/pending");
      setUsers(await res.json());
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("Setujui registrasi pengguna ini?")) {
      try {
        await fetch("/api/users/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        fetchPendingUsers();
      } catch (error) {
        console.error("Error approving user:", error);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("Tolak registrasi pengguna ini?")) {
      try {
        await fetch("/api/users/reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        fetchPendingUsers();
      } catch (error) {
        console.error("Error rejecting user:", error);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen">
      <SidebarUniversal
      collapsed={sidebarCollapsed} 
      setCollapsed={setSidebarCollapsed} />

      <main
        className={`flex-1 p-4 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        } mt-16 md:mt-0`}
      >
        {/* Mobile sidebar toggle button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-2 left-2 z-30 bg-blue-600 text-white p-2 rounded shadow-lg"
        >
          {sidebarCollapsed ? "☰" : "✕"}
        </button>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Manajemen Registrasi</h1>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100 text-black dark:text-black">
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama Lengkap</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">ID Pengenal</th>
                    <th className="border p-2">Role Diminta</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-4">
                        Tidak ada pendaftaran baru
                      </td>
                    </tr>
                  )}
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{user.nama_lengkap}</td>
                      <td className="border p-2">{user.username}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2 text-center">{user.id_pengenal}</td>
                      <td className="border p-2 text-center">
                        {user.requested_role_name ?? "-"}
                      </td>
                      <td className="border p-2 space-x-2">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                          onClick={() => handleApprove(user.id!)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                          onClick={() => handleReject(user.id!)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
