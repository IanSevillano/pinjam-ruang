//app/dashboard/admin/manajemenRoles/page.tsx
"use client";

import { useEffect, useState } from "react";

import SidebarUniversal from "@/components/layout/SidebarUniversal";

type Role = {
  id: number;
  nama_role: string;
};

export default function RolePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    nama_role: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roles");
      setRoles(await res.json());
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/roles/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/roles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      handleClear();
      fetchData();
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleEdit = (role: Role) => {
    setForm({ nama_role: role.nama_role });
    setEditingId(role.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus role ini?")) return;
    try {
      await fetch(`/api/roles/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleClear = () => {
    setForm({ nama_role: "" });
    setEditingId(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) => {
    return role.nama_role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex min-h-screen">
      <SidebarUniversal 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} mt-16 md:mt-0`}>
        {/* Mobile sidebar toggle button */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden fixed top-2 left-2 z-30 bg-blue-600 text-white p-2 rounded shadow-lg"
        >
          {sidebarCollapsed ? '☰' : '✕'}
        </button>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Manajemen Role</h1>

          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari Nama Role"
              className="border p-2 w-full md:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-md">
            <div>
              <label className="block mb-1">Nama Role</label>
              <input
                type="text"
                placeholder="Nama Role"
                className="border p-2 w-full"
                value={form.nama_role}
                onChange={(e) => setForm({ ...form, nama_role: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {editingId ? "Update" : "Tambah"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </form>

          {/* Table */}
          <h2 className="text-lg font-bold mb-2">Daftar Role</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100 text-black dark:text-black">
                    <th className="border p-2">No</th>
                    <th className="border p-2">ID Role</th>
                    <th className="border p-2">Nama Role</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-4">
                        {roles.length === 0 ? "Tidak ada data role" : "Tidak ditemukan hasil pencarian"}
                      </td>
                    </tr>
                  )}
                  {filteredRoles.map((role, index) => (
                    <tr key={role.id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{role.id}</td>
                      <td className="border p-2">{role.nama_role}</td>
                      <td className="border p-2 space-x-1 text-center">
                        <button
                          onClick={() => handleEdit(role)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(role.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Hapus
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