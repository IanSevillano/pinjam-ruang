//app/dashboard/admin/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

import SidebarUniversal from "@/components/layout/SidebarUniversal";


interface User {
  id?: number;
  email: string;
  username: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  tgl_lahir: string;
  no_hp: string;
  alamat: string;
  id_pengenal: string;
  password: string;
  is_verified?: boolean;
  is_active?: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({
    username: "",
    nama_lengkap: "",
    jenis_kelamin: "",
    tgl_lahir: "",
    no_hp: "",
    alamat: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: string, text: string} | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fungsi untuk mengonversi format tanggal dari API ke format input date
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    // Format: YYYY-MM-DD (sesuai dengan input type="date")
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setForm({
          username: data.username || "",
          nama_lengkap: data.nama_lengkap || "",
          jenis_kelamin: data.jenis_kelamin || "",
          tgl_lahir: formatDateForInput(data.tgl_lahir) || "",
          no_hp: data.no_hp || "",
          alamat: data.alamat || "",
        });
      } else {
        console.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // const confirmSave = async () => {
  //   setSaving(true);
  //   setMessage(null);
  //   setShowConfirm(false);
    
  //   try {
  //     // Konversi format tanggal kembali ke format yang diharapkan API
  //     const dataToSend = {
  //       ...form,
  //       tgl_lahir: form.tgl_lahir ? new Date(form.tgl_lahir).toISOString() : null
  //     };
      
  //     const res = await fetch("/api/users/profile", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(dataToSend),
  //     });
      
  //     if (res.ok) {
  //       setMessage({ type: "success", text: "Profil berhasil diperbarui" });
  //       fetchProfile(); // Refresh data
  //     } else {
  //       setMessage({ type: "error", text: "Gagal memperbarui profil" });
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error);
  //     setMessage({ type: "error", text: "Terjadi kesalahan saat memperbarui profil" });
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // app/dashboard/admin/profile/page.tsx

  const confirmSave = async () => {
      setSaving(true);
      setMessage(null);
      setShowConfirm(false);
      
      try {
        // Konversi format tanggal ke format YYYY-MM-DD sebelum dikirim
        let formattedTglLahir = form.tgl_lahir;
        if (form.tgl_lahir) {
          const date = new Date(form.tgl_lahir);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedTglLahir = `${year}-${month}-${day}`;
          }
        }
        
        const dataToSend = {
          ...form,
          tgl_lahir: formattedTglLahir
        };
        
        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });
        
        if (res.ok) {
          setMessage({ type: "success", text: "Profil berhasil diperbarui" });
          fetchProfile(); // Refresh data
        } else {
          const errorData = await res.json();
          setMessage({ type: "error", text: errorData.details || "Gagal memperbarui profil" });
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setMessage({ type: "error", text: "Terjadi kesalahan saat memperbarui profil" });
      } finally {
        setSaving(false);
      }
    };

  const cancelSave = () => {
    setShowConfirm(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Fungsi untuk memformat tanggal untuk tampilan
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    
    return date.toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <SidebarUniversal 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        
        <main className={`flex-1 p-4 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} mt-16 md:mt-0`}>
          <div className="p-6">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold mb-4">Profil Saya</h1>

          {/* Status Message */}
          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="border p-2 w-full"
                  value={form.username || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama_lengkap"
                  placeholder="Nama Lengkap"
                  className="border p-2 w-full"
                  value={form.nama_lengkap || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={form.jenis_kelamin || ""}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="">- Pilih Jenis Kelamin -</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tgl_lahir"
                  value={form.tgl_lahir || ""}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1">No HP</label>
                <input
                  type="text"
                  name="no_hp"
                  placeholder="No HP"
                  className="border p-2 w-full"
                  value={form.no_hp || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1">Alamat</label>
              <input
                type="text"
                name="alamat"
                placeholder="Alamat"
                className="border p-2 w-full"
                value={form.alamat || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded text-white ${saving ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
            {/* Tombol Ganti Password */}
            <div className="mt-6 border-t pt-4">
              <p className="text-sm text-gray-600 mb-2">Ingin mengubah password Anda?</p>
              <button
                type="button"
                onClick={() => window.location.href = "/dashboard/account/change-password"}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Ganti Password
              </button>
            </div>


          </form>

          {/* Modal Konfirmasi */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h3 className="text-lg font-bold mb-4 dark:text-black">Konfirmasi Perubahan</h3>
                <p className="mb-6 dark:text-black">Apakah Anda yakin ingin menyimpan perubahan pada profil Anda?</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelSave}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Ya, Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Informasi Profil (Read-only) */}
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4">Informasi Profil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">Data Pribadi</h3>
                <p><span className="font-medium">Email:</span> {user?.email || "-"}</p>
                <p><span className="font-medium">Username:</span> {user?.username || "-"}</p>
                <p><span className="font-medium">Nama Lengkap:</span> {user?.nama_lengkap || "-"}</p>
                <p><span className="font-medium">ID Pengenal:</span> {user?.id_pengenal || "-"}</p>
                <p><span className="font-medium">Jenis Kelamin:</span> {user?.jenis_kelamin === 'L' ? 'Laki-laki' : user?.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</p>
              </div>
              
              <div className="border p-4 rounded">
                <h3 className="font-semibold mb-2">Kontak & Status</h3>
                <p><span className="font-medium">Tanggal Lahir:</span> {formatDateForDisplay(user?.tgl_lahir)}</p>
                <p><span className="font-medium">No HP:</span> {user?.no_hp || "-"}</p>
                <p><span className="font-medium">Alamat:</span> {user?.alamat || "-"}</p>
                <p>
                  <span className="font-medium">Status:</span> 
                  <span className={`inline-block ml-2 px-2 py-1 rounded text-xs ${
                    user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}