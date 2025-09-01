// // app/dashboard/account/change-password/verify-email.tsx
// // app/dashboard/account/change-password/verify-email.tsx


// app/dashboard/account/change-password/verify-email.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function VerifyEmailStep({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email || "");
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
        body: JSON.stringify({ email, action: "request-code" }),
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess(email);
      } else {
        setError(data.error || "Gagal mengirim kode verifikasi");
      }
    } catch {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          required
          disabled={!!session?.user?.email}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 dark:bg-gray-600"
            : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        }`}
      >
        {loading ? "Mengirim..." : "Kirim Kode Verifikasi"}
      </button>
    </form>
  );
}

// 'use client';

// import { useState } from 'react';
// import { useSession } from 'next-auth/react';

// export default function VerifyEmailStep({ onSuccess }: { onSuccess: (email: string) => void }) {
//   const { data: session } = useSession();
//   const [email, setEmail] = useState(session?.user?.email || '');
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
//         body: JSON.stringify({ email, action: 'request-code' }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         onSuccess(email); // lanjut ke step input kode
//       } else {
//         setError(data.error || 'Gagal mengirim kode verifikasi');
//       }
//     } catch (err) {
//       setError('Terjadi kesalahan server');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block mb-1">Email</label>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border rounded"
//           required
//           disabled={!!session?.user?.email}
//         />
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
//       >
//         {loading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
//       </button>
//     </form>
//   );
// }
