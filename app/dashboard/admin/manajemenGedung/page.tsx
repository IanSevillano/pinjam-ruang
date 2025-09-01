//app/dashboard/admin/manajemenGedung/page.tsx
'use client';

import { useEffect, useState } from "react";
import SidebarUniversal from "@/components/layout/SidebarUniversal";

type Gedung = {
  id: number;
  kode_gedung: string;
  nama_gedung: string;
};

export default function GedungPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [gedung, setGedung] = useState<Gedung[]>([]);
  const [form, setForm] = useState({ kode_gedung: "", nama_gedung: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gedung");
      const data = await res.json();
      setGedung(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        await fetch(`/api/gedung/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/gedung", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      handleClear();
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEdit = (g: Gedung) => {
    setForm({ kode_gedung: g.kode_gedung, nama_gedung: g.nama_gedung });
    setEditingId(g.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus gedung ini?")) return;
    try {
      await fetch(`/api/gedung/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClear = () => {
    setForm({ kode_gedung: "", nama_gedung: "" });
    setEditingId(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Filter gedung based on search term
  const filteredGedung = gedung.filter((g) => {
    return (
      g.kode_gedung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.nama_gedung.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
          <h1 className="text-xl font-bold mb-4">Manajemen Gedung</h1>

          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari Kode atau Nama Gedung"
              className="border p-2 w-full md:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-md">
            <div>
              <label className="block mb-1">Kode Gedung</label>
              <input
                type="text"
                placeholder="Kode Gedung"
                className="border p-2 w-full"
                value={form.kode_gedung}
                onChange={(e) => setForm({ ...form, kode_gedung: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Nama Gedung</label>
              <input
                type="text"
                placeholder="Nama Gedung"
                className="border p-2 w-full"
                value={form.nama_gedung}
                onChange={(e) => setForm({ ...form, nama_gedung: e.target.value })}
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
          <h2 className="text-lg font-bold mb-2">Daftar Gedung</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100 text-black dark:text-black">
                    <th className="border p-2">No</th>
                    <th className="border p-2">ID Gedung</th>
                    <th className="border p-2">Kode Gedung</th>
                    <th className="border p-2">Nama Gedung</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGedung.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center p-4">
                        {gedung.length === 0 ? "Tidak ada data gedung" : "Tidak ditemukan hasil pencarian"}
                      </td>
                    </tr>
                  )}
                  {filteredGedung.map((g, index) => (
                    <tr key={g.id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{g.id}</td>
                      <td className="border p-2">{g.kode_gedung}</td>
                      <td className="border p-2">{g.nama_gedung}</td>
                      <td className="border p-2 space-x-1 text-center">
                        <button
                          onClick={() => handleEdit(g)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(g.id)}
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