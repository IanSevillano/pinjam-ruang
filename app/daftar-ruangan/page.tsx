
//app/daftar-ruangan/page.tsx

"use client";

import { useEffect, useState } from "react";
import SidebarPublic from "@/components/layout/SidebarPublic";

interface Ruangan {
  id: number;
  nama_ruangan: string;
  status_ruangan: string;
  kapasitas: number;
  fasilitas: string;
  kode_gedung: string;
  nama_gedung: string;
}

export default function DaftarRuanganPage() {
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State filter
  const [search, setSearch] = useState("");
  const [filterGedung, setFilterGedung] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    async function fetchRuangan() {
      try {
        const res = await fetch("/api/public/ruangan");
        const data = await res.json();
        setRuangan(data.ruangan || []);
      } catch (error) {
        console.error("Error fetching ruangan:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRuangan();
  }, []);

  // Ambil list gedung unik dari data
  const gedungOptions = Array.from(new Set(ruangan.map(r => r.nama_gedung)));

  // Filtered data
  const filteredRuangan = ruangan.filter((r) => {
    const matchSearch = r.nama_ruangan.toLowerCase().includes(search.toLowerCase());
    const matchGedung = filterGedung === "all" || r.nama_gedung === filterGedung;
    const matchStatus = filterStatus === "all" || r.status_ruangan === filterStatus;
    return matchSearch && matchGedung && matchStatus;
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarPublic 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />

      {/* Main content */}
      <main
        className={`flex-1 p-4 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-0" : "md:ml-64"
        } mt-16 md:mt-0`}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Daftar Ruangan
        </h1>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari nama ruangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/3 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />

          <select
            value={filterGedung}
            onChange={(e) => setFilterGedung(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="all">Semua Gedung</option>
            {gedungOptions.map((gedung, idx) => (
              <option key={idx} value={gedung}>
                {gedung}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="all">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="tidak tersedia">Tidak Tersedia</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Nama Ruangan</th>
                  <th className="border px-4 py-2">Kode Gedung</th>
                  <th className="border px-4 py-2">Nama Gedung</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Kapasitas</th>
                  <th className="border px-4 py-2">Fasilitas</th>
                </tr>
              </thead>
              <tbody>
                {filteredRuangan.length > 0 ? (
                  filteredRuangan.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="border px-4 py-2 text-center">{idx + 1}</td>
                      <td className="border px-4 py-2">{r.nama_ruangan}</td>
                      <td className="border px-4 py-2">{r.kode_gedung}</td>
                      <td className="border px-4 py-2">{r.nama_gedung}</td>
                      <td className="border px-4 py-2">{r.status_ruangan}</td>
                      <td className="border px-4 py-2 text-center">{r.kapasitas}</td>
                      <td className="border px-4 py-2">{r.fasilitas}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="border px-4 py-2 text-center text-gray-500 dark:text-gray-400"
                    >
                      Tidak ada data ruangan yang sesuai
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
