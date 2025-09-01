// components/layout/SidebarPublic.tsx
// 
"use client";

import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface SidebarPublicProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarPublic = ({ collapsed, setCollapsed }: SidebarPublicProps) => {
  return (
    <aside className={`h-full bg-blue-600 dark:bg-blue-800 text-white p-4 fixed transition-all duration-300 z-40 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 text-white hover:bg-blue-700 dark:hover:bg-blue-900 p-2 rounded flex items-center justify-center w-full"
      >
        {collapsed ? (
          <span className="text-xl">☰</span>
        ) : (
          <span className="text-xl">✕</span>
        )}
      </button>

      {/* Logo + Title */}
      <div className={`flex items-center gap-2 mb-4 ${collapsed ? 'justify-center' : ''}`}>
        <Image
          src="/Logo-PNC.png"
          alt="Logo PNC"
          width={40}
          height={40}
          className="min-w-[40px]"
        />
        {/* {!collapsed && <h1 className="text-xl whitespace-nowrap">Sistem Peminjaman</h1>} */}
        {!collapsed && <h1 className="text-xxl whitespace-nowrap">Sistem Peminjaman</h1>}
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="list-none p-0 space-y-2">
          <li>
            <Link 
              href="/" 
              className={`flex items-center gap-3 p-2 hover:bg-blue-700 dark:hover:bg-blue-900 rounded ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="text-lg">📅</span>
              {!collapsed && <span>Kalender Peminjaman</span>}
            </Link>
          </li>
          <li>
            <Link 
              href="/daftar-ruangan" 
              className={`flex items-center gap-3 p-2 hover:bg-blue-700 dark:hover:bg-blue-900 rounded ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="text-lg">🏢</span>
              {!collapsed && <span>Daftar Ruangan</span>}
            </Link>
          </li>
          <li>
            <Link 
              href="/panduan" 
              className={`flex items-center gap-3 p-2 hover:bg-blue-700 dark:hover:bg-blue-900 rounded ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="text-lg">📘</span>
              {!collapsed && <span>Panduan Peminjaman</span>}
            </Link>
          </li>
          <li className="mt-4">
            <div className={`flex flex-col gap-2 ${collapsed ? 'items-center' : ''}`}>
              <Link
                href="/login"
                className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}
              >
                <span className="text-lg">🔑</span>
                {!collapsed && <span>Login</span>}
              </Link>
              <Link
                href="/register"
                className={`bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}
              >
                <span className="text-lg">📝</span>
                {!collapsed && <span>Register</span>}
              </Link>
              <ThemeToggle collapsed={collapsed} />
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarPublic;