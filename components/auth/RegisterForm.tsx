// components/auth/RegisterForm.tsx


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  requested_role_id: z.string().min(1, "Role harus dipilih"),
  id_pengenal: z.string().min(3, "ID Pengenal minimal 3 karakter"), // tambahin validasi
});

interface Role {
  id: number;
  nama_role: string;
}

export default function RegisterForm() {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { isSubmitting, errors } 
  } = useForm({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  // ambil role dari API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        console.error("Gagal mengambil roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const selectedRole = watch("requested_role_id");

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          requested_role_id: Number(data.requested_role_id),
        }),
      });

      const result = await res.json();
      if (res.ok) {
         alert("Pendaftaran Berhasil, Menunggu Persetujuan Admin untuk dapat email verifikasi akun");
        router.push("/login?registered=true");
      } else {
        setError(result.error || "Registrasi gagal");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-2 border rounded"
            placeholder="contoh@email.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block mb-1">Username</label>
          <input
            {...register("username")}
            type="text"
            className="w-full p-2 border rounded"
            placeholder="username"
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message as string}</p>}
        </div>

        {/* Nama Lengkap */}
        <div>
          <label className="block mb-1">Nama Lengkap</label>
          <input
            {...register("nama_lengkap")}
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Nama Lengkap"
          />
          {errors.nama_lengkap && <p className="text-sm text-red-500">{errors.nama_lengkap.message as string}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full p-2 border rounded"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message as string}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1">Pilih Role</label>
          <select
            {...register("requested_role_id")}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Pilih Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.nama_role}
              </option>
            ))}
          </select>
          {errors.requested_role_id && (
            <p className="text-sm text-red-500">{errors.requested_role_id.message as string}</p>
          )}
        </div>

        {/* ID Pengenal */}
        {selectedRole && (
          <div>
            <label className="block mb-1">ID Pengenal</label>
            <input
              {...register("id_pengenal")}
              type="text"
              className="w-full p-2 border rounded"
              placeholder={
                roles.find(r => String(r.id) === String(selectedRole))?.nama_role === "Dosen"
                  ? "Masukkan NIDN"
                  : roles.find(r => String(r.id) === String(selectedRole))?.nama_role === "Mahasiswa"
                  ? "Masukkan NIM"
                  : "Masukkan ID Pengenal"
              }
            />
            {errors.id_pengenal && (
              <p className="text-sm text-red-500">{errors.id_pengenal.message as string}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Memproses..." : "Daftar"}
        </button>
      </form>
    </>
  );
}






// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const schema = z.object({
//   email: z.string().email("Email tidak valid"),
//   username: z.string().min(3, "Username minimal 3 karakter"),
//   nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
//   password: z.string().min(6, "Password minimal 6 karakter"),
// });

// export default function RegisterForm() {
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { isSubmitting, errors } 
//   } = useForm({
//     resolver: zodResolver(schema),
//   });
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   const onSubmit = async (data: any) => {
//     setError(null);
//     try {
//       const res = await fetch("/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
      
//       const result = await res.json();
      
//       if (res.ok) {
//         router.push("/login?registered=true");
//       } else {
//         setError(result.error || "Registrasi gagal");
//       }
//     } catch {
//       setError("Terjadi kesalahan. Coba lagi nanti.");
//     }
//   };

//   return (
//     <>
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label 
//             htmlFor="email" 
//             className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Email
//           </label>
//           <input
//             id="email"
//             {...register("email")}
//             type="email"
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
//               errors.email ? "border-red-500" : "border-gray-300"
//             }`}
//             placeholder="contoh@email.com"
//           />
//           {errors.email && (
//             <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//               {errors.email.message as string}
//             </p>
//           )}
//         </div>

//         <div>
//           <label 
//             htmlFor="username" 
//             className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Username
//           </label>
//           <input
//             id="username"
//             {...register("username")}
//             type="text"
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
//               errors.username ? "border-red-500" : "border-gray-300"
//             }`}
//             placeholder="username"
//           />
//           {errors.username && (
//             <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//               {errors.username.message as string}
//             </p>
//           )}
//         </div>

//         <div>
//           <label 
//             htmlFor="nama_lengkap" 
//             className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Nama Lengkap
//           </label>
//           <input
//             id="nama_lengkap"
//             {...register("nama_lengkap")}
//             type="text"
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
//               errors.nama_lengkap ? "border-red-500" : "border-gray-300"
//             }`}
//             placeholder="Nama Lengkap"
//           />
//           {errors.nama_lengkap && (
//             <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//               {errors.nama_lengkap.message as string}
//             </p>
//           )}
//         </div>

//         <div>
//           <label 
//             htmlFor="password" 
//             className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
//           >
//             Password
//           </label>
//           <input
//             id="password"
//             {...register("password")}
//             type="password"
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
//               errors.password ? "border-red-500" : "border-gray-300"
//             }`}
//             placeholder="••••••••"
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-600 dark:text-red-400">
//               {errors.password.message as string}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//             isSubmitting 
//               ? "bg-blue-400 cursor-not-allowed" 
//               : "bg-blue-600 hover:bg-blue-700"
//           } dark:bg-blue-700 dark:hover:bg-blue-800`}
//         >
//           {isSubmitting ? (
//             <span className="flex items-center justify-center">
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Memproses...
//             </span>
//           ) : "Daftar"}
//         </button>
//       </form>
//     </>
//   );
// }