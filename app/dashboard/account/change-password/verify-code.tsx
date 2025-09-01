// // app/dashboard/account/change-password/verify-code.tsx

// app/dashboard/account/change-password/verify-code.tsx
"use client";

import { useState } from "react";

export default function VerifyCodeStep({
  email,
  onSuccess,
  onBack,
}: {
  email: string;
  onSuccess: (token: string) => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, action: "verify-code" }),
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(data.token);
      } else {
        setError(data.error || "Kode verifikasi salah atau expired");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm mb-2 text-gray-700 dark:text-gray-300">
        Kode verifikasi telah dikirim ke <strong>{email}</strong>
      </p>

      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Kode Verifikasi
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
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
          {loading ? "Memverifikasi..." : "Verifikasi"}
        </button>
      </div>
    </form>
  );
}



// 'use client';

// import { useState } from 'react';

// export default function VerifyCodeStep({
//   email,
//   onSuccess,
//   onBack
// }: {
//   email: string;
//   onSuccess: (token: string) => void;
//   onBack: () => void;
// }) {
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch('/api/auth/change-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, code, action: 'verify-code' }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         onSuccess(data.token); // token dikirim balik dari backend
//       } else {
//         setError(data.error || 'Kode verifikasi salah atau expired');
//       }
//     } catch (err) {
//       setError('Terjadi kesalahan server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <p className="text-sm mb-4">
//         Kode verifikasi telah dikirim ke <strong>{email}</strong>
//       </p>

//       <div>
//         <label className="block mb-1">Kode Verifikasi</label>
//         <input
//           type="text"
//           value={code}
//           onChange={(e) => setCode(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
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
//           {loading ? 'Memverifikasi...' : 'Verifikasi'}
//         </button>
//       </div>
//     </form>
//   );
// }
