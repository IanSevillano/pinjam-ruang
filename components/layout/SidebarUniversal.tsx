// components/layout/SidebarUniversal.tsx
"use client";

import ThemeToggle from "@/components/theme/ThemeToggle";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarUniversalProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface Role {
  id: number;
  nama_role: string;
}

const roleMap: Record<number, string> = {
  1: "admin",
  2: "dosen",
  3: "mahasiswa",
  4: "unit-kerja",
};

const SidebarUniversal = ({ collapsed, setCollapsed }: SidebarUniversalProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<number | null>(null);

  // Ambil roles dari API saat pertama kali mount
  useEffect(() => {
    fetch("/api/auth/roles", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.roles) {
          setRoles(data.roles);
          // Sesuaikan currentRole dengan pathname dulu
          const roleFromPath = Object.entries(roleMap).find(([id, roleName]) =>
            pathname?.includes(roleName)
          );
          setCurrentRole(roleFromPath ? Number(roleFromPath[0]) : data.roles[0]?.id);
        }
      })
      .catch((err) => console.error("Gagal ambil role:", err));
  }, [pathname]);

  // Update currentRole saat route berubah
  useEffect(() => {
    const roleFromPath = Object.entries(roleMap).find(([id, roleName]) =>
      pathname?.includes(roleName)
    );
    if (roleFromPath) setCurrentRole(Number(roleFromPath[0]));
  }, [pathname]);

  const redirectToDashboard = (roleId: number) => {
    setCurrentRole(roleId);
    router.push(`/dashboard/${roleMap[roleId]}`);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin logout?");
        if (!confirmLogout) return;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  // Menu berdasarkan role
  const menuItems: Record<number, { href: string; icon: string; label: string }[]> = {
    1: [
      { href: "/dashboard/admin", icon: "📊", label: "Dashboard" },
      { href: "/dashboard/admin/profile", icon: "👥", label: "Profile" },
      { href: "/dashboard/admin/manajemenUsers", icon: "👥", label: "Manajemen Pengguna" },
      { href: "/dashboard/admin/manajemenRegistrasi", icon: "👥", label: "Manajemen Registrasi" },
      { href: "/dashboard/admin/manajemenGedung", icon: "🏢", label: "Manajemen Gedung" },
      { href: "/dashboard/admin/manajemenRuangan", icon: "🚪", label: "Manajemen Ruangan" },
      { href: "/dashboard/admin/manajemenRoles", icon: "🔑", label: "Manajemen Role" },
      { href: "/dashboard/admin/manajemenHakAkses", icon: "🛡️", label: "Manajemen Hak Akses" },
      { href: "/dashboard/admin/manajemenPeminjaman", icon: "📅", label: "Manajemen Peminjaman" },
      { href: "/dashboard/admin/manajemenRiwayatPeminjaman", icon: "📋", label: "Riwayat Peminjaman" },
      
    ],
    2: [
      { href: "/dashboard/dosen", icon: "📊", label: "Dashboard" },
      { href: "/dashboard/dosen/profile", icon: "👥", label: "Profile" },
      { href: "/dashboard/dosen/peminjamanSaya", icon: "📅", label: "Peminjaman Saya" },
    ],
    3: [
      { href: "/dashboard/mahasiswa", icon: "📊", label: "Dashboard" },
      { href: "/dashboard/mahasiswa/profile", icon: "👥", label: "Profile" },
      { href: "/dashboard/mahasiswa/peminjamanSaya", icon: "📅", label: "Peminjaman Saya" },
    ],
    4: [
      { href: "/dashboard/unit-kerja", icon: "📊", label: "Dashboard" },
      { href: "/dashboard/unit-kerja/profile", icon: "👥", label: "Profile" },
      { href: "/dashboard/unit-kerja/peminjamanSaya", icon: "📅", label: "Peminjaman Saya" },
    ],
  };

  return (
    <aside className={`h-full bg-blue-600 dark:bg-blue-800 text-white p-4 fixed transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-64"}`}>
      {/* Tombol toggle */}
      <button onClick={() => setCollapsed(!collapsed)} className="mb-4 text-white hover:bg-blue-700 dark:hover:bg-blue-900 p-2 rounded flex items-center justify-center w-full">
        {collapsed ? "☰" : "✕"}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2 mb-4 ${collapsed ? "justify-center" : ""}`}>
        <Image src="/Logo-PNC.png" alt="Logo PNC" width={40} height={40} className="min-w-[40px]" />
        {!collapsed && <h1 className="text-xxl whitespace-nowrap">Sistem Peminjaman</h1>}
      </div>

      {/* Menu */}
      <nav>
        <ul className="list-none p-0 space-y-2">
          {currentRole && menuItems[currentRole]?.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center gap-3 p-2 hover:bg-blue-700 dark:hover:bg-blue-900 rounded ${collapsed ? "justify-center" : ""}`}>
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}

          {/* Dropdown ganti role */}
          {roles.length > 1 && (
            <li className="mt-4">
              {!collapsed ? (
                <select
                  value={currentRole ?? ""}
                  onChange={(e) => redirectToDashboard(Number(e.target.value))}
                  className="w-full bg-blue-700 dark:bg-blue-900 text-white p-2 rounded"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.nama_role}</option>
                  ))}
                </select>
              ) : (
                <button onClick={() => currentRole && redirectToDashboard(currentRole)} className="w-full p-2 bg-blue-700 dark:bg-blue-900 rounded text-sm">
                  🔄
                </button>
              )}
            </li>
          )}

          {/* Theme & Logout */}
          <li className="mt-4 flex justify-center ">
            <ThemeToggle collapsed={collapsed } />
          </li>
          <li className="mt-2 flex justify-center">
            <button
                onClick={handleLogout}
                className={`bg-red-600 hover:bg-red-700 text-white rounded flex items-center 
                ${collapsed ? "p-2 justify-center w-10 h-10" : "py-2 px-4 gap-3 w-full"}`}
            >
                <span className="text-lg">🚪</span>
                {!collapsed && <span>Logout</span>}
            </button>
            </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarUniversal;
