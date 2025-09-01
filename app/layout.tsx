//app/layout.tsx
import { Providers } from '@/components/providers'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Peminjaman Ruangan",
  description: "Aplikasi peminjaman ruangan dengan fitur kalender dan manajemen user",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${geistMono.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// //app/layout.tsx

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";



// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Sistem Peminjaman Ruangan",
//   description: "Aplikasi peminjaman ruangan dengan fitur kalender dan manajemen user",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
//       </body>
//     </html>
//   );
// }
