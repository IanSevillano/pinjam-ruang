// // app/dashboard/account/change-password/new-password.tsx


// app/dashboard/account/change-password/new-password.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPasswordStep({
  email,
  token,
  onBack,
}: {
  email: string;
  token: string;
  onBack: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: token,
          password,
          action: "change-password",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/choose-role"), 2000);
      } else {
        setError(data.error || "Gagal mengubah password");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="text-green-500 text-3xl mb-2">✓</div>
        <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
          Password Berhasil Diubah!
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Anda akan diarahkan ke Pemilihan Role...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Password Baru
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Konfirmasi Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
          minLength={6}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 dark:bg-gray-600"
              : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Password"}
        </button>
      </div>
    </form>
  );
}


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function NewPasswordStep({
//   email,
//   token,
//   onBack
// }: {
//   email: string;
//   token: string;
//   onBack: () => void;
// }) {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError('Password tidak sama');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('/api/auth/change-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email,
//           code: token,
//           password,
//           action: 'change-password',
//         }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setSuccess(true);
//         setTimeout(() => router.push('/dashboard'), 2000);
//       } else {
//         setError(data.error || 'Gagal mengubah password');
//       }
//     } catch (err) {
//       setError('Terjadi kesalahan server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="text-center py-8">
//         <div className="text-green-500 text-2xl mb-2">✓</div>
//         <h2 className="text-xl font-bold mb-2">Password Berhasil Diubah!</h2>
//         <p>Anda akan diarahkan ke dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block mb-1">Password Baru</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//           minLength={6}
//         />
//       </div>

//       <div>
//         <label className="block mb-1">Konfirmasi Password</label>
//         <input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//           minLength={6}
//         />
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <div className="flex gap-2">
//         <button
//           type="button"
//           onClick={onBack}
//           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//         >
//           Kembali
//         </button>
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
//         >
//           {loading ? 'Menyimpan...' : 'Simpan Password'}
//         </button>
//       </div>
//     </form>
//   );
// }
