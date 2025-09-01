//app/dashboard/admin/manajemenUsers/page.tsx



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

const defaultFormData: Partial<User> = {
  id: undefined,
  email: "",
  username: "",
  nama_lengkap: "",
  jenis_kelamin: "",
  tgl_lahir: "",
  no_hp: "",
  alamat: "",
  id_pengenal: "",
  password: "",
  is_verified: false,
  is_active: true,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Partial<User>>(defaultFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterVerification, setFilterVerification] = useState<"all" | "verified" | "unverified">("all");
  const [filterGender, setFilterGender] = useState<"all" | "L" | "P">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      setUsers(await res.json());
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/users`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      handleClear();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      email: user.email || "",
      username: user.username || "",
      nama_lengkap: user.nama_lengkap || "",
      jenis_kelamin: user.jenis_kelamin || "",
      tgl_lahir: user.tgl_lahir || "",
      no_hp: user.no_hp || "",
      alamat: user.alamat || "",
      is_verified: user.is_verified ?? false,
      is_active: user.is_active ?? true,
    });
    setEditingId(user.id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menonaktifkan pengguna ini?")) {
      try {
        await fetch(`/api/users`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deactivating user:", error);
      }
    }
  };

  const handleActivate = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin mengaktifkan kembali pengguna ini?")) {
      try {
        await fetch(`/api/users/activate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        fetchUsers();
      } catch (error) {
        console.error("Error activating user:", error);
      }
    }
  };

  const handleClear = () => {
    setFormData(defaultFormData);
    setEditingId(null);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getGenderLabel = (gender: string) => {
  if (gender === 'L') return 'L';
  if (gender === 'P') return 'P';
  return '-'; // atau 'Tidak diisi' sesuai preferensi
};

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    // Search term filter
    const matchesSearch = 
      user.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      filterStatus === "all" || 
      (filterStatus === "active" && user.is_active) || 
      (filterStatus === "inactive" && !user.is_active);
    
    // Verification filter
    const matchesVerification = 
      filterVerification === "all" || 
      (filterVerification === "verified" && user.is_verified) || 
      (filterVerification === "unverified" && !user.is_verified);
    
    // Gender filter
    const matchesGender = 
      filterGender === "all" || 
      user.jenis_kelamin === filterGender;
    
    return matchesSearch && matchesStatus && matchesVerification && matchesGender;
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
          <h1 className="text-xl font-bold mb-4">Manajemen Pengguna</h1>

          {/* Search and Filters */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Cari Nama, Email, atau Username"
              className="border p-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select
              className="border p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">-- Semua Status --</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
            
            <select
              className="border p-2"
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value as any)}
            >
              <option value="all">-- Semua Verifikasi --</option>
              <option value="verified">Terverifikasi</option>
              <option value="unverified">Belum Verifikasi</option>
            </select>
            
            <select
              className="border p-2"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as any)}
            >
              <option value="all">-- Semua Jenis Kelamin --</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6 space-y-3 max-w-2xl">
            <input type="hidden" name="id" value={formData.id ?? ""} />
            
            {/* <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 w-full"
                value={formData.email ?? ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div> */}
            <div>
              <label className="block mb-1 grid grid-cols-1 md:grid-cols-2 gap-4">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 w-full disabled:cursor-not-allowed"
                value={formData.email ?? ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!!editingId} // kalau sedang edit, email tidak bisa diganti
              />
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="border p-2 w-full"
                  value={formData.username ?? ""}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                  value={formData.nama_lengkap ?? ""}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin ?? ""}
                  onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                  required
                  className="border p-2 w-full"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tgl_lahir"
                  value={formData.tgl_lahir ?? ""}
                  onChange={(e) => setFormData({ ...formData, tgl_lahir: e.target.value })}
                  required
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
                  value={formData.no_hp ?? ""}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  required
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
                value={formData.alamat ?? ""}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                required
              />
            </div>
            
            {/* <div>
              <label className="block mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password ?? ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!formData.id}
                className="border p-2 w-full"
              />
            </div> */}
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified ?? false}
                  onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })}
                  className="h-4 w-4"
                />
                Verifikasi
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active ?? false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4"
                />
                Aktif
              </label>
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
          <h2 className="text-lg font-bold mb-2">Daftar Pengguna</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100 text-black dark:text-black">
                    <th className="border p-2">No</th>
                    <th className="border p-2">ID Pengguna</th>
                    <th className="border p-2">Nama Lengkap</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Jenis Kelamin</th>
                    <th className="border p-2">Alamat</th>
                    <th className="border p-2">ID Pengenal</th>
                    <th className="border p-2">No HP</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Verifikasi</th>
                    <th className="border p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center p-4">
                        Tidak ada data pengguna
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{user.id}</td>
                      <td className="border p-2">{user.nama_lengkap}</td>
                      <td className="border p-2">{user.username}</td>
                      <td className="border p-2">{user.email}</td>
                      {/* <td className="border p-2 text-center">
                        {user.jenis_kelamin === 'L' ? 'L' : 'P'}
                      </td> */}
                      <td className="border p-2 text-center">
                        {getGenderLabel(user.jenis_kelamin)}
                      </td>
                      <td className="border p-2">{user.alamat}</td>
                      <td className="border p-2 text-center">{user.id_pengenal}</td>
                      <td className="border p-2 text-center">{user.no_hp}</td>
                      <td className="border p-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="border p-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          user.is_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </td>
                      <td className="border p-2 space-x-1">
                        <button
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        {user.is_active ? (
                          <button
                            className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleDelete(user.id!)}
                          >
                            Nonaktifkan
                          </button>
                        ) : (
                          <button
                            className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                            onClick={() => handleActivate(user.id!)}
                          >
                            Aktifkan
                          </button>
                        )}
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




