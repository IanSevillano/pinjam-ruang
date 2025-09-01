//app/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import SidebarPublic from "@/components/layout/SidebarPublic";
import Calendar from "@/components/calendar/Calendar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<any>(null);
  const router = useRouter();

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
      setIsLoading(true);
      setError(null);
      
      try {
        const [peminjamanRes, holidayRes] = await Promise.all([
          fetch("/api/public/peminjaman").then((res) => {
            if (!res.ok) throw new Error("Failed to fetch peminjaman");
            return res.json();
          }),
          fetch("https://date.nager.at/api/v3/PublicHolidays/2025/ID").then((res) => {
            if (!res.ok) throw new Error("Failed to fetch holidays");
            return res.json();
          }),
        ]);

        console.log("Peminjaman data:", peminjamanRes); // Debug log

        let peminjamanEvents: EventInput[] = [];
        if (peminjamanRes.peminjaman && Array.isArray(peminjamanRes.peminjaman)) {
          peminjamanEvents = peminjamanRes.peminjaman.map((item: any) => ({
            id: item.id.toString(),
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
      } catch (err: any) {
        console.error("Error loading events:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
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
      case "dibatalkan": return "#ef4444";
      default: return "#3788d8";
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (clickInfo.event.extendedProps.type === "holiday") return;
    setSelectedEvent(clickInfo.event);
  };

  const handleDateClick = (dateStr: string) => {
    router.push("/login");
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    setTimeout(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, 350);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <SidebarPublic 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-64'} mt-16 md:mt-0`}>
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <SidebarPublic 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-64'} mt-16 md:mt-0`}>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SidebarPublic 
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
          <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Kalender Peminjaman Ruangan</h1>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              Klik pada tanggal di kalender untuk memulai peminjaman ruangan. Anda perlu login terlebih dahulu.
            </p>
          </div>
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
                <p><strong>Status:</strong> 
                  <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                    selectedEvent.extendedProps.status_peminjaman === 'disetujui' ? 'bg-blue-100 text-blue-800' :
                    selectedEvent.extendedProps.status_peminjaman === 'selesai' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedEvent.extendedProps.status_peminjaman}
                  </span>
                </p>
                <p><strong>Waktu Mulai:</strong> {new Date(selectedEvent.start).toLocaleString('id-ID')}</p>
                <p><strong>Waktu Selesai:</strong> {new Date(selectedEvent.end).toLocaleString('id-ID')}</p>
                {selectedEvent.extendedProps.catatan && (
                  <p>
                    <strong>Catatan:</strong> 
                    <span className="block mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      {selectedEvent.extendedProps.catatan}
                    </span>
                  </p>
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