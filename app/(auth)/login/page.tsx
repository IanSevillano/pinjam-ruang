// app/(auth)/login/page.tsx
"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 px-4 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md dark:bg-gray-800/90 dark:backdrop-blur-lg">
        {/* Logo atau Judul */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Login</h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        {/* Form Login */}
        <LoginForm />

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Lupa Password??{" "}
          <Link
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Reset password di sini
          </Link>
        </p>


        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="px-2 text-gray-400 text-sm">atau</span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Link ke Register */}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
          <div className="mt-2">
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Kembali
            </Link>
          </div>
      </div>
    </main>
  );
}