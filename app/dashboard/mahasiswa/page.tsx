// app/dashboard/mahasiswa/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import SidebarUniversal from "@/components/layout/SidebarUniversal";
import Calendar from "@/components/calendar/Calendar";

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const [peminjamanRes, holidayRes] = await Promise.all([
          fetch("/api/peminjaman").then((res) => res.json()),
          fetch("https://date.nager.at/api/v3/PublicHolidays/2025/ID").then((res) => res.json()),
        ]);

        const peminjamanEvents: EventInput[] = (peminjamanRes.peminjaman || []).map((item: any) => ({
          id: item.id,
          title: `${item.nama_kegiatan} - ${item.nama_ruangan}`,
          start: item.waktu_peminjaman_mulai,
          end: item.waktu_peminjaman_selesai,
          color: getStatusColor(item.status_peminjaman),
          textColor: "#ffffff",
          extendedProps: { ...item, type: "peminjaman" },
        }));

        const holidayEvents: EventInput[] = (holidayRes || []).map((holiday: any) => ({
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
      case "ditolak":
      case "dibatalkan": return "#ef4444";
      default: return "#3788d8";
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (clickInfo.event.extendedProps.type === "holiday") return;
    setSelectedEvent(clickInfo.event);
  };

  // const handleDateClick = (dateStr: string) => {
  //   localStorage.setItem("selectedDate", dateStr);
  //   window.location.href = "/dashboard/mahasiswa/peminjamanSaya";
  // };

  const handleDateClick = (dateStr: string) => {
  window.location.href = `/dashboard/mahasiswa/peminjamanSaya?date=${encodeURIComponent(dateStr)}`;
};

  const closeModal = () => setSelectedEvent(null);

  return (
    <div className="flex min-h-screen">
      <SidebarUniversal collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-64'} mt-16 md:mt-0`}>
        <div className="calendar-container w-full overflow-x-auto">
          <h1 className="calendar-title">Dashboard Mahasiswa</h1>
          <Calendar
            ref={calendarRef}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </div>

        {/* Modal detail event */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{selectedEvent.title}</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Peminjam:</strong> {selectedEvent.extendedProps.nama_user}</p>
                <p><strong>Ruangan:</strong> {selectedEvent.extendedProps.nama_ruangan} ({selectedEvent.extendedProps.nama_gedung})</p>
                <p><strong>Status:</strong> {selectedEvent.extendedProps.status_peminjaman}</p>
                <p><strong>Waktu Mulai:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                <p><strong>Waktu Selesai:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                {selectedEvent.extendedProps.surat_peminjaman && <p><strong>Surat:</strong> {selectedEvent.extendedProps.surat_peminjaman}</p>}
                {selectedEvent.extendedProps.catatan && <p><strong>Catatan:</strong> {selectedEvent.extendedProps.catatan}</p>}
              </div>
              <button onClick={closeModal} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white py-2 px-4 rounded">Tutup</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
