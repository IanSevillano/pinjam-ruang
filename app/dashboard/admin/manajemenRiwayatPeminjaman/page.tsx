//app/dashboard/admin/manajemenRiwayatPeminjaman/page.tsx
"use client";
import { useEffect, useState } from "react";

import SidebarUniversal from "@/components/layout/SidebarUniversal";

// Manual implementation of date-fns functions
const startOfDay = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const endOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const result = new Date(date);
  result.setDate(diff);
  return startOfDay(result);
};

const endOfWeek = (date: Date) => {
  const lastDay = new Date(startOfWeek(date));
  lastDay.setDate(lastDay.getDate() + 6);
  return endOfDay(lastDay);
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

const startOfYear = (date: Date) => {
  return new Date(date.getFullYear(), 0, 1);
};

const endOfYear = (date: Date) => {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
};

const isWithinInterval = (date: Date, interval: { start: Date; end: Date }) => {
  return date.getTime() >= interval.start.getTime() && 
         date.getTime() <= interval.end.getTime();
};

interface RiwayatPeminjaman {
  id: number;
  id_peminjaman: number;
  catatan: string;
  nama_kegiatan: string;
  waktu_peminjaman_mulai: string;
  waktu_peminjaman_selesai: string;
  nama_lengkap: string;
  no_hp: string;
  nama_ruangan: string;
  kode_gedung: string;
  nama_gedung: string;
}

interface Peminjaman {
  id: number;
  nama_kegiatan: string;
  nama_ruangan: string;
  nama_gedung: string;
}

export default function RiwayatPeminjamanPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [riwayat, setRiwayat] = useState<RiwayatPeminjaman[]>([]);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGedung, setFilterGedung] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());

  const [form, setForm] = useState({ id_peminjaman: "", catatan: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/riwayat_peminjaman");
      const data = await res.json();
      setRiwayat(data);
    } catch (error) {
      console.error("Error fetching riwayat:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeminjamanList = async () => {
    try {
      const res = await fetch("/api/peminjaman");
      const data = await res.json();
      if (data.peminjaman) {
        setPeminjamanList(data.peminjaman);
      }
    } catch (error) {
      console.error("Error fetching peminjaman:", error);
    }
  };

  useEffect(() => {
    fetchRiwayat();
    fetchPeminjamanList();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/riwayat_peminjaman/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_peminjaman: Number(form.id_peminjaman),
            catatan: form.catatan,
          }),
        });
      } else {
        await fetch("/api/riwayat_peminjaman", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_peminjaman: Number(form.id_peminjaman),
            catatan: form.catatan,
          }),
        });
      }
      handleClear();
      fetchRiwayat();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleEdit = (r: RiwayatPeminjaman) => {
    setForm({ id_peminjaman: String(r.id_peminjaman), catatan: r.catatan });
    setEditingId(r.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus riwayat peminjaman ini?")) return;
    try {
      await fetch(`/api/riwayat_peminjaman/${id}`, { method: "DELETE" });
      fetchRiwayat();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleClear = () => {
    setForm({ id_peminjaman: "", catatan: "" });
    setEditingId(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>Laporan Riwayat Peminjaman</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header-info { margin-bottom: 20px; }
              .filter-info { margin-bottom: 10px; font-style: italic; }
            </style>
          </head>
          <body>
            <h1>Laporan Riwayat Peminjaman</h1>
            <div class="header-info">
              <div>Tanggal Cetak: ${new Date().toLocaleString()}</div>
              <div class="filter-info">Filter: ${getFilterDescription()}</div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Kegiatan</th>
                  <th>Waktu Mulai</th>
                  <th>Waktu Selesai</th>
                  <th>Peminjam</th>
                  <th>No HP</th>
                  <th>Ruangan</th>
                  <th>Gedung</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                ${filteredRiwayat.map((r, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${r.nama_kegiatan}</td>
                    <td>${new Date(r.waktu_peminjaman_mulai).toLocaleString()}</td>
                    <td>${new Date(r.waktu_peminjaman_selesai).toLocaleString()}</td>
                    <td>${r.nama_lengkap}</td>
                    <td>${r.no_hp}</td>
                    <td>${r.nama_ruangan}</td>
                    <td>Gedung ${r.kode_gedung} (${r.nama_gedung})</td>
                    <td>${r.catatan}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getFilterDescription = () => {
    let description = [];
    if (searchTerm) description.push(`Pencarian: "${searchTerm}"`);
    if (filterGedung !== "all") description.push(`Gedung: ${filterGedung}`);
    
    if (timeFilter === "custom" && customStartDate && customEndDate) {
      description.push(`Periode Custom: ${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`);
    } else if (timeFilter === "month") {
      description.push(`Bulan: ${getMonthName(parseInt(selectedMonth))} ${selectedYear}`);
    } else if (timeFilter === "year") {
      description.push(`Tahun: ${selectedYear}`);
    } else if (timeFilter !== "all") {
      description.push(`Periode: ${timeFilter === "today" ? "Hari Ini" : timeFilter === "week" ? "Minggu Ini" : "Bulan Ini"}`);
    }
    
    return description.join(" | ") || "Semua Data";
  };

  const getMonthName = (month: number) => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[month - 1];
  };

  const filteredRiwayat = riwayat.filter((r) => {
    const matchesSearch = 
      r.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nama_gedung.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGedung = 
      filterGedung === "all" || 
      r.kode_gedung === filterGedung;
    
    const startDate = new Date(r.waktu_peminjaman_mulai);
    let matchesTime = true;
    
    if (timeFilter !== "all") {
      let intervalStart: Date;
      let intervalEnd: Date;
      
      if (timeFilter === "today") {
        intervalStart = startOfDay(new Date());
        intervalEnd = endOfDay(new Date());
      } else if (timeFilter === "week") {
        intervalStart = startOfWeek(new Date());
        intervalEnd = endOfWeek(new Date());
      } else if (timeFilter === "month") {
        const now = new Date();
        intervalStart = startOfMonth(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1));
        intervalEnd = endOfMonth(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1));
      } else if (timeFilter === "year") {
        intervalStart = startOfYear(new Date(parseInt(selectedYear), 0, 1));
        intervalEnd = endOfYear(new Date(parseInt(selectedYear), 0, 1));
      } else if (timeFilter === "custom" && customStartDate && customEndDate) {
        intervalStart = startOfDay(new Date(customStartDate));
        intervalEnd = endOfDay(new Date(customEndDate));
      } else {
        matchesTime = true;
        return matchesSearch && matchesGedung && matchesTime;
      }
      
      matchesTime = isWithinInterval(startDate, { 
        start: intervalStart, 
        end: intervalEnd 
      });
    }
    
    return matchesSearch && matchesGedung && matchesTime;
  });

  const uniqueGedung = Array.from(new Set(riwayat.map(r => r.kode_gedung)));
  const availableYears = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex min-h-screen">
      <SidebarUniversal
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} mt-16 md:mt-0`}>
        <button 
          onClick={toggleSidebar}
          className="md:hidden fixed top-2 left-2 z-30 bg-blue-600 text-white p-2 rounded shadow-lg"
        >
          {sidebarCollapsed ? '☰' : '✕'}
        </button>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Manajemen Riwayat Peminjaman</h1>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Cari Nama Kegiatan, Ruangan, Gedung, atau Peminjam"
              className="border p-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="border p-2"
              value={filterGedung}
              onChange={(e) => setFilterGedung(e.target.value)}
            >
              <option value="all">-- Semua Gedung --</option>
              {uniqueGedung.map((g) => (
                <option key={`gedung-${g}`} value={g}>
                  Gedung {g}
                </option>
              ))}
            </select>

            <select
              className="border p-2"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="all">-- Semua Periode --</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Tertentu</option>
              <option value="year">Tahun Tertentu</option>
              <option value="custom">Custom Range</option>
            </select>

            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              disabled={filteredRiwayat.length === 0}
            >
              Cetak Laporan
            </button>
          </div>

          {/* Additional filter controls based on timeFilter selection */}
          {timeFilter === "month" && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                className="border p-2"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map((year) => (
                  <option key={`year-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                className="border p-2"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={`month-${month}`} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {timeFilter === "year" && (
            <div className="mb-4">
              <select
                className="border p-2 w-full md:w-1/4"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map((year) => (
                  <option key={`year-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {timeFilter === "custom" && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tanggal Mulai</label>
                <input
                  type="date"
                  className="border p-2 w-full"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  className="border p-2 w-full"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={customStartDate}
                />
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-2xl">
            <div>
              <label className="block mb-1">Peminjaman</label>
              <select
                className="border p-2 w-full"
                value={form.id_peminjaman}
                onChange={(e) => setForm({...form, id_peminjaman: e.target.value})}
                required
              >
                <option value="">-- Pilih Peminjaman --</option>
                {peminjamanList.map((p) => (
                  <option key={`pem-${p.id}`} value={p.id}>
                    {p.nama_kegiatan} - {p.nama_ruangan} ({p.nama_gedung})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Catatan</label>
              <textarea
                className="border p-2 w-full"
                value={form.catatan}
                onChange={(e) => setForm({...form, catatan: e.target.value})}
                required
                rows={3}
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
          <h2 className="text-lg font-bold mb-2">Daftar Riwayat Peminjaman</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100 text-black dark:text-black">
                    <th className="border p-2">No</th>
                    <th className="border p-2">ID Riwayat Peminjaman</th>
                    <th className="border p-2">Nama Kegiatan</th>
                    <th className="border p-2">Waktu Mulai</th>
                    <th className="border p-2">Waktu Selesai</th>
                    <th className="border p-2">Peminjam</th>
                    <th className="border p-2">No HP</th>
                    <th className="border p-2">Ruangan</th>
                    <th className="border p-2">Gedung</th>
                    <th className="border p-2">Catatan</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiwayat.length === 0 && (
                    <tr>
                      <td colSpan={10} className="text-center p-4">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                  {filteredRiwayat.map((r, index) => (
                    <tr key={`riwayat-${r.id}`}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{r.id}</td>
                      <td className="border p-2">{r.nama_kegiatan}</td>
                      <td className="border p-2">{formatDateTime(r.waktu_peminjaman_mulai)}</td>
                      <td className="border p-2">{formatDateTime(r.waktu_peminjaman_selesai)}</td>
                      <td className="border p-2">{r.nama_lengkap}</td>
                      <td className="border p-2">{r.no_hp}</td>
                      <td className="border p-2">{r.nama_ruangan}</td>
                      <td className="border p-2">Gedung {r.kode_gedung} ({r.nama_gedung})</td>
                      <td className="border p-2">{r.catatan}</td>
                      <td className="border p-2 space-x-1">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                          onClick={() => handleEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(r.id)}
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



