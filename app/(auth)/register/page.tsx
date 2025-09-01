// app/(auth)/register/page.tsx

"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 px-4 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md dark:bg-gray-800/90 dark:backdrop-blur-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Daftar Akun</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm">
            Buat akun baru untuk mulai menggunakan sistem
          </p>
        </div>

        <RegisterForm />

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="px-2 text-gray-400 text-sm">atau</span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </main>
  );
}


// "use client";

// import RegisterForm from "@/components/auth/RegisterForm";
// import Link from "next/link";

// export default function RegisterPage() {
//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 px-4 dark:from-gray-800 dark:via-gray-900 dark:to-black">
//       <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md dark:bg-gray-800/90 dark:backdrop-blur-lg">
//         {/* Logo atau Judul */}
//         <div className="text-center mb-6">
//           <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Daftar Akun</h1>
//           <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm">
//             Buat akun baru untuk mulai menggunakan sistem
//           </p>
//         </div>

//         {/* Form Register */}
//         <RegisterForm />

//         {/* Divider */}
//         <div className="flex items-center my-6">
//           <hr className="flex-1 border-gray-300 dark:border-gray-600" />
//           <span className="px-2 text-gray-400 text-sm">atau</span>
//           <hr className="flex-1 border-gray-300 dark:border-gray-600" />
//         </div>

//         {/* Link ke Login */}
//         <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
//           Sudah punya akun?{" "}
//           <Link
//             href="/login"
//             className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
//           >
//             Login di sini
//           </Link>
//         </p>
//       </div>
//     </main>
//   );
// }