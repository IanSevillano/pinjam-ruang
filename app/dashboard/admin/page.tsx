
// app/dashboard/admin/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { EventInput } from "@fullcalendar/core";

import SidebarUniversal from "@/components/layout/SidebarUniversal";
import Calendar from "@/components/calendar/Calendar";

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        const [peminjamanRes, holidayRes] = await Promise.all([
          fetch("/api/peminjaman").then((res) => res.json()),
          fetch("https://date.nager.at/api/v3/PublicHolidays/2025/ID").then((res) => res.json()),
        ]);

        let peminjamanEvents: EventInput[] = [];
        if (peminjamanRes.peminjaman) {
          peminjamanEvents = peminjamanRes.peminjaman.map((item: any) => ({
            id: item.id,
            title: `${item.nama_kegiatan} - ${item.nama_ruangan}`,
            start: item.waktu_peminjaman_mulai,
            end: item.waktu_peminjaman_selesai,
            color: getStatusColor(item.status_peminjaman),
            textColor: "#ffffff",
            extendedProps: {
              type: "peminjaman",
              nama_user: item.nama_user || "Tidak diketahui",
              nama_ruangan: item.nama_ruangan,
              nama_gedung: item.nama_gedung,
              status_peminjaman: item.status_peminjaman,
              surat_peminjaman: item.surat_peminjaman,
              catatan: item.status_peminjaman === "selesai" ? item.catatan || "Tidak ada catatan" : null,
            },
          }));
        }

        const holidayEvents: EventInput[] = holidayRes.map((holiday: any) => ({
          title: `Libur Nasional: ${holiday.localName}`,
          start: holiday.date,
          end: holiday.date,
          color: "#ef4444",
          textColor: "white",
          extendedProps: { type: "holiday" },
        }));

        setEvents([...peminjamanEvents, ...holidayEvents]);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      }
    }

    loadEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "selesai": return "#10b981";
      case "disetujui": return "#3b82f6";
      case "menunggu persetujuan": return "#f59e0b";
      case "ditolak": return "#ef4444";
      case "dibatalkan": return "#ef4444"; // Warna untuk dibatalkan
      default: return "#3788d8";
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (clickInfo.event.extendedProps.type === "holiday") return;
    setSelectedEvent(clickInfo.event);
  };

  const handleDateClick = (dateStr: string) => {
    localStorage.setItem("selectedDate", dateStr);
    window.location.href = "/dashboard/admin/manajemenPeminjaman";
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);

    // Gunakan setTimeout dengan waktu yang lebih panjang
      setTimeout(() => {
        if (calendarRef.current) {
          calendarRef.current.getApi().updateSize();
        }
      }, 350); // Sesuaikan waktu ini dengan durasi transisi sidebar
  };

  return (
    <div className="flex min-h-screen">
      <SidebarUniversal
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-64'} mt-16 md:mt-0`}>
        <button 
          onClick={toggleSidebar}
          className="md:hidden fixed top-2 left-2 z-30 bg-blue-600 dark:bg-blue-700 text-white p-2 rounded shadow-lg"
        >
          {sidebarCollapsed ? '☰' : '✕'}
        </button>

        <div className="calendar-container w-full overflow-x-auto">
          <h1 className="calendar-title">Dashboard Admin</h1>
          <Calendar
             ref={calendarRef}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {selectedEvent.title}
              </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Peminjam:</strong> {selectedEvent.extendedProps.nama_user}</p>
                    <p><strong>Ruangan:</strong> {selectedEvent.extendedProps.nama_ruangan} ({selectedEvent.extendedProps.nama_gedung})</p>
                    <p><strong>Status:</strong> {selectedEvent.extendedProps.status_peminjaman}</p>
                    <p><strong>Waktu Mulai:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                    <p><strong>Waktu Selesai:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                    {selectedEvent.extendedProps.surat_peminjaman && (
                      <p>
                        <strong>Surat:</strong>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {selectedEvent.extendedProps.surat_peminjaman}
                        </span>
                      </p>
                    )}
                    {selectedEvent.extendedProps.catatan && (
                      <p><strong>Catatan:</strong> {selectedEvent.extendedProps.catatan}</p>
                    )}
                  </div>
              <button
                onClick={closeModal}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}




