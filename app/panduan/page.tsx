// app/panduan/page.tsx
"use client";

import { useState } from 'react';
// Impor komponen SidebarPublic yang sudah Anda buat
import SidebarPublic from '@/components/layout/SidebarPublic'; 

export default function PanduanPage() {
  // State untuk mengelola kondisi sidebar (terbuka/tertutup)
  const [collapsed, setCollapsed] = useState(false);

  return (
    // Container utama dengan layout flex untuk menempatkan sidebar dan konten
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* 1. Komponen Sidebar dimasukkan di sini */}
      <SidebarPublic collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* 2. Konten utama halaman panduan */}
      {/* Diberi margin kiri yang berubah sesuai kondisi sidebar */}
      <main 
        className={`flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}
      >
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            {/* Judul halaman */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Panduan Penggunaan Sistem
            </h1>
            
            {/* Tombol Unduh Panduan */}
            <a
              href="/Guidebook Peminjaman Ruangan.pdf" 
              download="Guidebook Peminjaman Ruangan.pdf"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Unduh Panduan
            </a>
          </div>

          {/* Konten panduan tetap sama */}
          <section id="register" className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              1. Panduan Pendaftaran Akun (Register)
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Pendaftaran akun diperlukan agar Anda dapat masuk ke sistem dan mengajukan peminjaman ruangan. Pastikan Anda menggunakan data yang valid dan aktif.
              </p>
              {/* ...dan seterusnya... */}
            </div>
          </section>

          {/* ... Lanjutkan dengan section lainnya ... */}

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Informasi Penting</h3>
            <p className="text-blue-700 dark:text-blue-300">
              Untuk panduan yang lebih lengkap dan terformat, silakan unduh file panduan resmi yang tersedia. Jika Anda mengalami kendala, hubungi administrator sistem.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}