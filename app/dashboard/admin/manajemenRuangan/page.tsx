
//app/dashboard/admin/manajemenRuangan/page.tsx
"use client";

import { useEffect, useState } from "react";

import SidebarUniversal from "@/components/layout/SidebarUniversal";

type Ruangan = {
  id: number;
  id_gedung: number;
  nama_gedung?: string;
  status_ruangan: string;
  nama_ruangan: string;
  kapasitas: number;
  fasilitas: string;
};

type Gedung = {
  id: number;
  nama_gedung: string;
};

export default function RuanganPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [gedungList, setGedungList] = useState<Gedung[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGedung, setFilterGedung] = useState("all");

  const [form, setForm] = useState({
    id_gedung: "",
    status_ruangan: "tersedia",
    nama_ruangan: "",
    kapasitas: "",
    fasilitas: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRuangan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ruangan");
      setRuangan(await res.json());
    } catch (error) {
      console.error("Error fetching ruangan:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGedung = async () => {
    try {
      const res = await fetch("/api/gedung");
      setGedungList(await res.json());
    } catch (error) {
      console.error("Error fetching gedung:", error);
    }
  };

  useEffect(() => {
    fetchRuangan();
    fetchGedung();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/ruangan/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/ruangan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      handleClear();
      fetchRuangan();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEdit = (item: Ruangan) => {
    setForm({
      id_gedung: String(item.id_gedung),
      status_ruangan: item.status_ruangan,
      nama_ruangan: item.nama_ruangan,
      kapasitas: String(item.kapasitas),
      fasilitas: item.fasilitas
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus ruangan ini?")) return;
    try {
      await fetch(`/api/ruangan/${id}`, { method: "DELETE" });
      fetchRuangan();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClear = () => {
    setForm({
      id_gedung: "",
      status_ruangan: "tersedia",
      nama_ruangan: "",
      kapasitas: "",
      fasilitas: ""
    });
    setEditingId(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Filter ruangan based on search and filters
  const filteredRuangan = ruangan.filter((r) => {
    // Search term filter
    const matchesSearch = 
      r.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.fasilitas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nama_gedung?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === "all" || 
      r.status_ruangan === filterStatus;
    
    // Gedung filter
    const matchesGedung = 
      filterGedung === "all" || 
      String(r.id_gedung) === filterGedung;
    
    return matchesSearch && matchesStatus && matchesGedung;
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
          <h1 className="text-xl font-bold mb-4">Manajemen Ruangan</h1>

          {/* Search and Filters */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Cari Nama Ruangan, Fasilitas, atau Gedung"
              className="border p-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="border p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">-- Semua Status --</option>
              <option value="tersedia">Tersedia</option>
              <option value="tidak tersedia">Tidak Tersedia</option>
            </select>
            
            <select
              className="border p-2"
              value={filterGedung}
              onChange={(e) => setFilterGedung(e.target.value)}
            >
              <option value="all">-- Semua Gedung --</option>
              {gedungList.map((g) => (
                <option key={`gedung-${g.id}`} value={g.id}>
                  {g.nama_gedung}
                </option>
              ))}
            </select>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-2xl">
            <div>
              <label className="block mb-1">Gedung</label>
              <select
                className="border p-2 w-full"
                value={form.id_gedung}
                onChange={(e) => setForm({ ...form, id_gedung: e.target.value })}
                required
              >
                <option value="">-- Pilih Gedung --</option>
                {gedungList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nama_gedung}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Status Ruangan</label>
              <select
                className="border p-2 w-full"
                value={form.status_ruangan}
                onChange={(e) => setForm({ ...form, status_ruangan: e.target.value })}
              >
                <option value="tersedia">Tersedia</option>
                <option value="tidak tersedia">Tidak Tersedia</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Nama Ruangan</label>
              <input
                type="text"
                placeholder="Nama Ruangan"
                className="border p-2 w-full"
                value={form.nama_ruangan}
                onChange={(e) => setForm({ ...form, nama_ruangan: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Kapasitas</label>
                <input
                  type="number"
                  placeholder="Kapasitas"
                  className="border p-2 w-full"
                  value={form.kapasitas}
                  onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Fasilitas</label>
                <input
                  type="text"
                  placeholder="Fasilitas"
                  className="border p-2 w-full"
                  value={form.fasilitas}
                  onChange={(e) => setForm({ ...form, fasilitas: e.target.value })}
                />
              </div>
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
          <h2 className="text-lg font-bold mb-2">Daftar Ruangan</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100 text-black dark:text-black">
                    <th className="border p-2">No</th>
                    <th className="border p-2">ID Ruangan</th>
                    <th className="border p-2">Gedung</th>
                    <th className="border p-2">Nama Ruangan</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Kapasitas</th>
                    <th className="border p-2">Fasilitas</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRuangan.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center p-4">
                        {ruangan.length === 0 ? "Tidak ada data ruangan" : "Tidak ditemukan hasil pencarian"}
                      </td>
                    </tr>
                  )}
                  {filteredRuangan.map((r, index) => (
                    <tr key={r.id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{r.id}</td>
                      <td className="border p-2">{r.nama_gedung || "-"}</td>
                      <td className="border p-2">{r.nama_ruangan}</td>
                      <td className="border p-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          r.status_ruangan === "tersedia" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {r.status_ruangan}
                        </span>
                      </td>
                      <td className="border p-2 text-center">{r.kapasitas}</td>
                      <td className="border p-2">{r.fasilitas}</td>
                      <td className="border p-2 space-x-1 text-center">
                        <button
                          onClick={() => handleEdit(r)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
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