
//app/dashboard/admin/manajemenPeminjaman/page.tsx
"use client";

import { useEffect, useState } from "react";

import SidebarUniversal from "@/components/layout/SidebarUniversal";
import FileUpload from "@/components/FileUpload";

type P = {
  id: number;
  id_users: number | null;
  nama_user?: string | null;
  id_ruangan: number | null;
  nama_ruangan?: string | null;
  nama_gedung?: string | null;
  status_peminjaman: string;
  nama_kegiatan?: string | null;
  waktu_peminjaman_mulai?: string | null;
  waktu_peminjaman_selesai?: string | null;
  surat_peminjaman?: string | null;
};

type User = { id: number; nama_lengkap: string };
type Ruangan = { id: number; nama_ruangan: string; nama_gedung?: string };

export default function PeminjamanPage() {
  const [peminjaman, setPeminjaman] = useState<P[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State untuk sidebar
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian
  const [filterStatus, setFilterStatus] = useState(""); // State untuk filter status

  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [oldFileToDelete, setOldFileToDelete] = useState<string>("");

  const [form, setForm] = useState({
    id_users: "",
    id_ruangan: "",
    status_peminjaman: "menunggu persetujuan",
    nama_kegiatan: "",
    waktu_peminjaman_mulai: "",
    waktu_peminjaman_selesai: "",
    surat_peminjaman: ""
  });

  useEffect(() => {
    const selectedDate = localStorage.getItem("selectedDate");
    if (selectedDate) {
      const defaultStart = `${selectedDate}T08:00`;
      const defaultEnd = `${selectedDate}T10:00`;
      setForm((prev) => ({
        ...prev,
        waktu_peminjaman_mulai: defaultStart,
        waktu_peminjaman_selesai: defaultEnd,
      }));
      localStorage.removeItem("selectedDate");
    }
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/peminjaman");
      const json = await res.json();
      setPeminjaman(Array.isArray(json.peminjaman) ? json.peminjaman : []);
      setUsers(Array.isArray(json.users) ? json.users : []);
      setRuangan(Array.isArray(json.ruangan) ? json.ruangan : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

function utcToLocalDatetime(utcDatetime?: string | null) {
  if (!utcDatetime) return "";
  
  try {
    const date = new Date(utcDatetime);
    
    // Jika waktu sudah dalam UTC, tambah 7 jam untuk WIB
    if (utcDatetime.endsWith('Z')) {
      date.setHours(date.getHours() + 7);
    }
    
    return date.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error converting UTC to local:", error);
    return "";
  }
}

  function formatDisplayDatetime(sqlDatetime?: string | null) {
    if (!sqlDatetime) return "-";
    const d = new Date(sqlDatetime);
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

const handleFileUpload = (filePath: string) => {
  // simpan file lama untuk dihapus nanti
  if (form.surat_peminjaman && form.surat_peminjaman.startsWith("/uploads/")) {
    setOldFileToDelete(form.surat_peminjaman);
  }
  setUploadedFile(filePath);
  setForm(prev => ({ ...prev, surat_peminjaman: filePath }));
};


const handleClear = () => {
  setEditingId(null);
  setForm({
    id_users: "",
    id_ruangan: "",
    status_peminjaman: "menunggu persetujuan",
    nama_kegiatan: "",
    waktu_peminjaman_mulai: "",
    waktu_peminjaman_selesai: "",
    surat_peminjaman: ""
  });
  setOldFileToDelete(""); // reset kalau batal
};

  const handleEdit = (item: P) => {
    setEditingId(item.id);
    setForm({
      id_users: item.id_users ? String(item.id_users) : "",
      id_ruangan: item.id_ruangan ? String(item.id_ruangan) : "",
      status_peminjaman: item.status_peminjaman || "menunggu persetujuan",
      nama_kegiatan: item.nama_kegiatan || "",
      waktu_peminjaman_mulai: utcToLocalDatetime(item.waktu_peminjaman_mulai || null),
      waktu_peminjaman_selesai: utcToLocalDatetime(item.waktu_peminjaman_selesai || null),
      surat_peminjaman: item.surat_peminjaman || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus peminjaman ini?")) return;
    await fetch(`/api/peminjaman/${id}`, { method: "DELETE" });
    fetchAll();
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const payload = {
    ...form,
    id_users: form.id_users === "" ? null : Number(form.id_users),
    id_ruangan: form.id_ruangan === "" ? null : Number(form.id_ruangan),
    waktu_peminjaman_mulai: form.waktu_peminjaman_mulai
      ? form.waktu_peminjaman_mulai.replace("T", " ") + ":00"
      : null,
    waktu_peminjaman_selesai: form.waktu_peminjaman_selesai
      ? form.waktu_peminjaman_selesai.replace("T", " ") + ":00"
      : null
  };

  let res;
  if (editingId) {
    res = await fetch(`/api/peminjaman/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } else {
    res = await fetch("/api/peminjaman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  const json = await res.json();
  if (!json.success) {
    alert(json.message || "Gagal menyimpan data");
    return;
  }

  // ✅ hapus file lama hanya jika berhasil
  if (oldFileToDelete) {
    try {
      await fetch("/api/delete-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath: oldFileToDelete })
      });
    } catch (err) {
      console.error("Gagal hapus file lama:", err);
    }
    setOldFileToDelete("");
  }

  handleClear();
  fetchAll();
};


  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Filter peminjaman berdasarkan pencarian dan status
  const filteredPeminjaman = peminjaman.filter((p) => {
    const matchesSearch = p.nama_user?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.nama_kegiatan?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? p.status_peminjaman === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen">
      <SidebarUniversal
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} mt-16 md:mt-0`}>
        {/* Tombol toggle untuk mobile */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden fixed top-2 left-2 z-30 bg-blue-600 text-white p-2 rounded shadow-lg"
        >
          {sidebarCollapsed ? '☰' : '✕'}
        </button>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Manajemen Peminjaman</h1>

          {/* tombol untuk membersihkan file tidak terpakai */}
          <div className="mb-4 ">
            <button
              onClick={async () => {
                if (!confirm("Bersihkan file tidak terpakai di server?")) return;
                try {
                  const res = await fetch("/api/cleanup-surat", { method: "DELETE" });
                  const data = await res.json();
                  if (res.ok) {
                    alert(`✅ Cleanup selesai. Terhapus ${data.deletedCount} file.`);
                  } else {
                    alert("❌ Gagal membersihkan file: " + (data.error || ""));
                  }
                } catch (err) {
                  alert("Terjadi error saat cleanup file.");
                  console.error(err);
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Bersihkan File Tidak Terpakai
            </button>
          </div>

          {/* Pencarian dan Filter */}
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Cari Peminjam atau Kegiatan"
              className="border p-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">-- Filter Status --</option>
              <option value="menunggu persetujuan">Menunggu Persetujuan</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-2xl">
            {/* Pilihan User */}
            <div>
              <label className="block mb-1">Peminjam</label>
              <select
                className="border p-2 w-full"
                value={form.id_users}
                onChange={(e) => handleChange("id_users", e.target.value)}
                required
              >
                <option value="">-- Pilih User --</option>
                {users.map((u) => (
                  <option key={`user-${u.id}`} value={u.id}>
                    {u.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>

            {/* Pilihan Ruangan */}
            <div>
              <label className="block mb-1">Ruangan</label>
              <select
                className="border p-2 w-full"
                value={form.id_ruangan}
                onChange={(e) => handleChange("id_ruangan", e.target.value)}
                required
              >
                <option value="">-- Pilih Ruangan --</option>
                {ruangan.map((r) => (
                  <option key={`ruang-${r.id}`} value={r.id}>
                    {r.nama_ruangan} {r.nama_gedung ? `- ${r.nama_gedung}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1">Status</label>
              <select
                className="border p-2 w-full"
                value={form.status_peminjaman}
                onChange={(e) => handleChange("status_peminjaman", e.target.value)}
              >
                <option value="menunggu persetujuan">menunggu persetujuan</option>
                <option value="disetujui">disetujui</option>
                <option value="ditolak">ditolak</option>
                <option value="selesai">selesai</option>
                <option value="dibatalkan">dibatalkan</option>
                <option value="expired">expired</option>
              </select>
            </div>

            {/* Nama Kegiatan */}
            <div>
              <label className="block mb-1">Nama Kegiatan</label>
              <input
                type="text"
                className="border p-2 w-full"
                value={form.nama_kegiatan}
                onChange={(e) => handleChange("nama_kegiatan", e.target.value)}
                required
              />
            </div>

            {/* Waktu Mulai */}
            <div>
              <label className="block mb-1">Waktu Mulai</label>
              <input
                type="datetime-local"
                className="border p-2 w-full"
                value={form.waktu_peminjaman_mulai}
                onChange={(e) => handleChange("waktu_peminjaman_mulai", e.target.value)}
                required
              />
            </div>

            {/* Waktu Selesai */}
            <div>
              <label className="block mb-1">Waktu Selesai</label>
              <input
                type="datetime-local"
                className="border p-2 w-full"
                value={form.waktu_peminjaman_selesai}
                onChange={(e) => handleChange("waktu_peminjaman_selesai", e.target.value)}
                required
              />
            </div>

            {/* Surat */}
            <div>
              <label className="block mb-1">Surat Peminjaman</label>
              <FileUpload 
                onFileUpload={handleFileUpload} 
                existingFile={form.surat_peminjaman}
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? "Update" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Batal
              </button>
            </div>
          </form>

          {/* Tabel */}
          <h2 className="text-lg font-bold mb-2">Daftar Peminjaman</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100 text-black dark:text-black">
                  <th className="border p-2">No</th>
                  <th className="border p-2">ID Peminjaman</th>
                  <th className="border p-2">Peminjam</th>
                  <th className="border p-2">Ruangan</th>
                  <th className="border p-2">Gedung</th>
                  <th className="border p-2">Kegiatan</th>
                  <th className="border p-2">Mulai</th>
                  <th className="border p-2">Selesai</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Surat Peminjaman</th>
                  <th className="border p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPeminjaman.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center p-4">
                      Tidak ada data
                    </td>
                  </tr>
                )}
                {filteredPeminjaman.map((p, index) => (
                  <tr key={`pem-${p.id}`}>
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 text-center">{p.id}</td>
                    <td className="border p-2">{p.nama_user || "-"}</td>
                    <td className="border p-2">{p.nama_ruangan || "-"}</td>
                    <td className="border p-2">{p.nama_gedung || "-"}</td>
                    <td className="border p-2">{p.nama_kegiatan || "-"}</td>
                    <td className="border p-2">{formatDisplayDatetime(p.waktu_peminjaman_mulai || null)}</td>
                    <td className="border p-2">{formatDisplayDatetime(p.waktu_peminjaman_selesai || null)}</td>
                    <td className="border p-2">{p.status_peminjaman}</td>
                                        <td className="border p-2">
                      {p.surat_peminjaman ? (
                        <a href={p.surat_peminjaman} target="_blank" className="text-blue-600 hover:underline">
                          Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border p-2 space-x-1">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(p.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
