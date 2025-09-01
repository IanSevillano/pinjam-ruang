//app/choose-role/page.tsx


"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Role {
  id: number;
  nama_role: string;
}

export default function ChooseRolePage() {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Ambil data role langsung dari API, kirim cookie HttpOnly
    fetch("/api/auth/roles", {
      credentials: "include", // penting supaya cookie HttpOnly ikut terkirim
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.roles) {
          setRoles(data.roles);

          // Kalau hanya 1 role → langsung redirect
          if (data.roles.length === 1) {
            redirectToDashboard(data.roles[0].id);
          }
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const redirectToDashboard = (roleId: number) => {
    if (roleId === 1) router.push("/dashboard/admin");
    if (roleId === 2) router.push("/dashboard/dosen");
    if (roleId === 3) router.push("/dashboard/mahasiswa");
    if (roleId === 4) router.push("/dashboard/unit-kerja");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Pilih Peran Anda</h1>
      <div className="flex gap-4 flex-wrap justify-center">
        {roles.map((role) => (
          <button
            key={role.id}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => redirectToDashboard(role.id)}
          >
            {role.nama_role}
          </button>
        ))}
      </div>
    </main>
  );
}
